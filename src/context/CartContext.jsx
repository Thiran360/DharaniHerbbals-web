import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useProducts } from './ProductsContext';
import { useAuthModal } from './AuthModalContext';
import { API_BASE_URL, resolveMediaUrl } from '../services/api';
import { showAppToast } from '../components/GlobalToast';
import { formatProductPackSize, formatVariationLabel, formatProductDisplayName, formatCurrency } from '../utils/productFormatters';
import { getProductVariations, getDefaultVariation } from '../data/productVariationsData';
import { COMPANY_FACTS } from '../data/companyFacts';
import liveProductsBackup from '../data/liveProductsCache.json';

const CartContext = createContext();

const BUNDLE_CART_KEY = 'dharani_bundle_cart_items';

const getStoredBundleCartItems = () => {
  try {
    const raw = localStorage.getItem(BUNDLE_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveStoredBundleCartItems = (bundles) => {
  try {
    localStorage.setItem(BUNDLE_CART_KEY, JSON.stringify(bundles || []));
  } catch (e) {}
};


export function isValidProductImage(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  if (!trimmed) return false;
  if (trimmed === '/logo.png' || trimmed.endsWith('/logo.png') || trimmed === 'logo.png') return false;
  if (trimmed.includes('default.jpg') || trimmed.includes('placeholder')) return false;
  return true;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      let initial = [];
      const stored = localStorage.getItem('user');
      if (stored) {
        const offline = localStorage.getItem('dharani_cart_offline_backup');
        if (offline) initial = JSON.parse(offline);
      } else {
        const saved = localStorage.getItem('dharani_cart');
        if (saved) initial = JSON.parse(saved);
      }
      const storedBundles = getStoredBundleCartItems();
      if (storedBundles && storedBundles.length > 0) {
        const bundleKeys = new Set(storedBundles.map(b => b.id));
        const filtered = (initial || []).filter(i => !bundleKeys.has(i.id));
        return [...filtered, ...storedBundles];
      }
      return initial || [];
    } catch { return []; }
  });
  const [shippingCost, setShippingCost] = useState(null);
  const [deliveryState, setDeliveryState] = useState(() => {
    try {
      return localStorage.getItem('dharani_delivery_state') || 'Tamil Nadu';
    } catch {
      return 'Tamil Nadu';
    }
  });
  const [stateShippingRates, setStateShippingRates] = useState(() => {
    try {
      const cached = localStorage.getItem('dharani_state_shipping_rates');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/shipping-charge/`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!isMounted) return;
        const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        if (list.length > 0) {
          setStateShippingRates(list);
          try {
            localStorage.setItem('dharani_state_shipping_rates', JSON.stringify(list));
          } catch (e) {}
        }
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.warn("Unable to fetch state shipping rates, using defaults/cache:", err.message);
      });
    return () => { isMounted = false; };
  }, []);
  const [taxAmount, setTaxAmount] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products } = useProducts();
  const { openLoginModal } = useAuthModal();

  const getUser = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const user = parsed.user || parsed;
      // Sanitize string IDs caused by legacy bug
      if (typeof user.id === 'string' && user.id.startsWith('user-')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
      return user;
    } catch { return null; }
  };

  const refreshCart = async (params = {}) => {
    if (params.state) {
      setDeliveryState(params.state);
      try {
        localStorage.setItem('dharani_delivery_state', params.state);
      } catch (e) {}
    }
    const user = getUser();
    if (user) {
      // Sync any guest cart items stored in localStorage to server on login
      try {
        const savedGuestCart = localStorage.getItem('dharani_cart');
        if (savedGuestCart) {
          const guestItems = JSON.parse(savedGuestCart);
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            localStorage.removeItem('dharani_cart');
            for (const item of guestItems) {
              try {
                await fetch(`${API_BASE_URL}/carts/`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                  },
                  body: JSON.stringify({
                    user_id: user.id,
                    product_id: item.id,
                    quantity: item.quantity,
                    ...(item.variation_id && { variation_id: item.variation_id })
                  })
                });
              } catch (e) {
                console.error("Failed to sync guest cart item to server:", e);
              }
            }
          }
        }
      } catch (e) {
        console.error("Error syncing guest cart:", e);
      }

      let url = `${API_BASE_URL}/carts/?user_id=${user.id}`;
      if (params.address_id) {
        url += `&address_id=${params.address_id}`;
      }
      if (params.state) {
        url += `&state=${encodeURIComponent(params.state)}`;
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        let res = await fetch(url, {
          method: 'GET',
          headers: { 'ngrok-skip-browser-warning': 'true' },
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        // If request with extra params (like address_id) failed, retry with pure user_id to prevent losing cart
        if (!res.ok && (params.address_id || params.state)) {
          try {
            const fallbackRes = await fetch(`${API_BASE_URL}/carts/?user_id=${user.id}`, {
              method: 'GET',
              headers: { 'ngrok-skip-browser-warning': 'true' },
              cache: 'no-store'
            });
            if (fallbackRes.ok) {
              res = fallbackRes;
            }
          } catch (e) {}
        }

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('user');
            openLoginModal();
            return null;
          }
          if (res.status === 404) {
            // Cart is empty on backend, preserve local bundles
            const storedBundles = getStoredBundleCartItems();
            setCartItems([...storedBundles]);
            return null;
          }
          console.warn(`refreshCart received status ${res.status}. Preserving current cart state.`);
          return null;
        }

        const text = await res.text(); let data = {}; try { data = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error:", text); }
        if (data) {
          let itemsArray = [];
          if (Array.isArray(data)) {
            itemsArray = data;
          } else if (data.cart && Array.isArray(data.cart)) {
            itemsArray = data.cart;
          } else if (data.data && Array.isArray(data.data)) {
            itemsArray = data.data;
          }

          const backendItems = itemsArray.map(item => ({
            id: item.product_id || item.product || item.id,
            cartItemId: item.id,
            name: formatProductDisplayName(item.product_name || item.name),
            image: item.product_image || item.image || item.product?.image || '',
            price: formatCurrency(item.price),
            quantity: item.quantity,
            variation_id: item.variation_id,
            variation_name: item.variation_name ? formatVariationLabel(item.variation_name, item) : '',
            pack_size: item.pack_size || formatProductPackSize(item)
          }));

          const storedBundles = getStoredBundleCartItems();
          setCartItems([...backendItems, ...storedBundles]);
          if (data.delivery_charge !== undefined) {
            setShippingCost(parseFloat(data.delivery_charge) || 0);
          } else if (data.shipping_charge !== undefined) {
            setShippingCost(parseFloat(data.shipping_charge) || 0);
          } else if (data.shipping_price !== undefined) {
            setShippingCost(parseFloat(data.shipping_price) || 0);
          } else if (data.shipping !== undefined) {
            setShippingCost(parseFloat(data.shipping) || 0);
          }
          if (data.gst_total !== undefined) {
            setTaxAmount(0);
          } else if (data.tax !== undefined) {
            setTaxAmount(parseFloat(data.tax) || 0);
          } else if (data.tax_amount !== undefined) {
            setTaxAmount(parseFloat(data.tax_amount) || 0);
          }

          // New separate tax fields
          if (data.cgst !== undefined) setCgst(0);
          if (data.sgst !== undefined) setSgst(0);
          if (data.igst !== undefined) setIgst(0);
          if (data.tax_total !== undefined) {
            setTaxTotal(parseFloat(data.tax_total) || 0);
            // Fallback taxAmount if not set above
            setTaxAmount(prev => prev || parseFloat(data.tax_total) || 0);
          }
          setGrandTotal(null);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const savedCart = localStorage.getItem('dharani_cart');
      const base = savedCart ? JSON.parse(savedCart) : [];
      const storedBundles = getStoredBundleCartItems();
      const bundleKeys = new Set(storedBundles.map(b => b.id));
      const filtered = (base || []).filter(i => !bundleKeys.has(i.id));
      setCartItems([...filtered, ...storedBundles]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    refreshCart();
  }, []);

  // Sync cart when user logs in or logs out
  useEffect(() => {
    const handleAuthChange = () => {
      refreshCart();
    };
    window.addEventListener('user-login-status-changed', handleAuthChange);
    return () => window.removeEventListener('user-login-status-changed', handleAuthChange);
  }, []);

  useEffect(() => {
    try {
      if (!getUser()) {
        localStorage.setItem('dharani_cart', JSON.stringify(cartItems));
      } else {
        localStorage.setItem('dharani_cart_offline_backup', JSON.stringify(cartItems));
      }
    } catch(e) {}
  }, [cartItems]);

  const triggerCartCrackers = () => {
    try {
      const cartElem = document.querySelector('.capsule-btn.cart-btn') || 
                       document.querySelector('.cart-btn') || 
                       document.querySelector('.cart-icon-wrapper');
      
      let originX = 0.90;
      let originY = 0.08;

      if (cartElem) {
        const rect = cartElem.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          originX = (rect.left + rect.width / 2) / window.innerWidth;
          originY = (rect.top + rect.height / 2) / window.innerHeight;
        }
        
        cartElem.classList.remove('cart-patasu-bounce');
        void cartElem.offsetWidth;
        cartElem.classList.add('cart-patasu-bounce');
        setTimeout(() => cartElem.classList.remove('cart-patasu-bounce'), 1000);
      }

      // 1. Initial cracker burst
      confetti({
        particleCount: 55,
        angle: 90,
        spread: 85,
        origin: { x: originX, y: originY },
        colors: ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#ec4899', '#f97316'],
        startVelocity: 32,
        gravity: 0.9,
        ticks: 160,
        scalar: 1,
        zIndex: 9999999
      });

      // 2. Sparkler star shower
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 110,
          spread: 75,
          origin: { x: originX, y: originY },
          colors: ['#ffd700', '#ff6b6b', '#48dbfb', '#1dd1a1', '#ffffff'],
          startVelocity: 26,
          gravity: 0.85,
          ticks: 140,
          shapes: ['circle', 'star'],
          scalar: 1.2,
          zIndex: 9999999
        });
      }, 120);

      // 3. Mini crackle finale
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 70,
          spread: 60,
          origin: { x: originX, y: originY },
          colors: ['#10b981', '#fbbf24', '#a855f7', '#ff4757'],
          startVelocity: 22,
          gravity: 1,
          ticks: 110,
          shapes: ['circle'],
          scalar: 0.9,
          zIndex: 9999999
        });
      }, 240);
    } catch (err) {
      console.error('Error triggering cart crackers:', err);
    }
  };

  const triggerDrawerPatasu = () => {
    try {
      const drawerElem = document.querySelector('.cart-header') || 
                         document.querySelector('.cart-drawer.open') ||
                         document.querySelector('.cart-drawer');
      
      let originX = 0.86;
      let originY = 0.14;

      if (drawerElem) {
        const rect = drawerElem.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          originX = (rect.left + rect.width / 2) / window.innerWidth;
          originY = (rect.top + 70) / window.innerHeight;
        }
      }

      // 1. Main cracker explosion right on the cart drawer
      confetti({
        particleCount: 65,
        angle: 90,
        spread: 90,
        origin: { x: originX, y: originY },
        colors: ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#ec4899', '#10b981'],
        startVelocity: 35,
        gravity: 0.9,
        ticks: 180,
        zIndex: 10000000
      });

      // 2. Golden sparkle and star shower
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 115,
          spread: 80,
          origin: { x: originX, y: originY },
          colors: ['#ffd700', '#ff6b6b', '#48dbfb', '#1dd1a1', '#ffffff'],
          startVelocity: 28,
          gravity: 0.85,
          ticks: 150,
          shapes: ['circle', 'star'],
          scalar: 1.25,
          zIndex: 10000000
        });
      }, 140);

      // 3. Mini crackle sparkles finale
      setTimeout(() => {
        confetti({
          particleCount: 35,
          angle: 65,
          spread: 70,
          origin: { x: originX, y: originY },
          colors: ['#10b981', '#fbbf24', '#a855f7', '#ff4757'],
          startVelocity: 24,
          gravity: 1,
          ticks: 120,
          shapes: ['circle'],
          scalar: 0.9,
          zIndex: 10000000
        });
      }, 280);
    } catch (err) {
      console.error('Error triggering drawer patasu:', err);
    }
  };

  const addToCart = async (product, quantity = 1, variationId = null, silent = false) => {
    const user = getUser();
    const wasEmpty = cartItems.length === 0;

    // Resolve variations list from product or variations registry
    const variationsList = (Array.isArray(product.variations) && product.variations.length > 0)
      ? product.variations
      : getProductVariations(product.id);

    // If variationId wasn't passed, check for default_variation
    let effectiveVariationId = variationId;
    if (!effectiveVariationId) {
      if (product.default_variation_id) {
        effectiveVariationId = product.default_variation_id;
      } else if (product.default_variation) {
        effectiveVariationId = product.default_variation.id || product.default_variation.variation_id;
      } else if (variationsList && variationsList.length > 0) {
        const def = getDefaultVariation(product, variationsList);
        effectiveVariationId = def ? (def.id || def.variation_id) : null;
      }
    }

    // Check if the exact product and variation are already in cart
    const existingItem = cartItems.find(item => item.id === product.id);

    // Resolve variation details and price
    let variationName = '';
    let itemPrice = product.price;
    let effectivePackSize = product.pack_size || formatProductPackSize(product);

    if (effectiveVariationId && variationsList && variationsList.length > 0) {
      const matchedVar = variationsList.find(v => String(v.id || v.variation_id) === String(effectiveVariationId));
      if (matchedVar) {
        variationName = matchedVar.variation_name || matchedVar.name || matchedVar.weight || '';
        if (matchedVar.price) {
          itemPrice = matchedVar.price;
        }
        effectivePackSize = formatVariationLabel(matchedVar, product);
      }
    }

    let formattedPrice = formatCurrency(itemPrice);

    // ── GUEST USER: ADD TO LOCAL STATE WITHOUT REQUIRING LOGIN ──
    if (!user) {
      if (existingItem) {
        if (String(existingItem.variation_id || '') === String(effectiveVariationId || '')) {
          // Same variation -> update quantity
          updateQuantity(product.id, quantity);
          if (!silent) {
            showAppToast('Added to cart successfully');
            triggerCartCrackers();
          }
          return;
        }
        // Different variation -> will replace existing item below
      }

      const rawGuestImg = product.image || product.product_image || (Array.isArray(product.images) && product.images[0]?.image) || '';
      const guestItem = {
        id: product.id,
        cartItemId: 'guest-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: formatProductDisplayName(product.name),
        image: resolveMediaUrl(rawGuestImg) || rawGuestImg || '/logo.png',
        price: formattedPrice,
        quantity: quantity,
        variation_id: effectiveVariationId,
        variation_name: variationName ? formatVariationLabel(variationName, product) : '',
        pack_size: effectivePackSize
      };

      setCartItems(prev => {
        const filtered = prev.filter(item => item.id !== product.id);
        return [...filtered, guestItem];
      });

      if (!silent) {
        showAppToast('Added to cart successfully');
        if (wasEmpty) {
          setIsCartOpen(true);
          setTimeout(() => {
            triggerDrawerPatasu();
          }, 350);
        } else {
          triggerCartCrackers();
        }
      }
      return;
    }

    // ── LOGGED-IN USER: SYNC WITH SERVER ──
    if (existingItem) {
      if (String(existingItem.variation_id || '') === String(effectiveVariationId || '')) {
        // Same variation -> just add quantity
        updateQuantity(product.id, quantity);
        if (!silent) {
          showAppToast('Added to cart successfully');
          triggerCartCrackers();
        }
        return;
      } else {
        // Different variation -> Backend doesn't support multiple variations of the same product.
        // Delete the old one before adding the new one.
        if (existingItem.cartItemId && !String(existingItem.cartItemId).startsWith('guest-') && !String(existingItem.cartItemId).startsWith('offline-')) {
          try {
            await fetch(`${API_BASE_URL}/carts/${existingItem.cartItemId}/`, {
              method: 'DELETE',
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
          } catch (e) { console.error(e); }
        }
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/carts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          quantity: quantity,
          ...(effectiveVariationId && { variation_id: effectiveVariationId })
        })
      });

      if (!response.ok) {
        const text = await response.text(); let errData = {}; try { errData = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error:", text); }
        if (errData.message && errData.message.toLowerCase().includes('user')) {
          localStorage.removeItem('user');
          if (typeof openLoginModal === 'function') openLoginModal();
          return; // Stop execution
        }
      }

      await refreshCart();
    } catch (err) {
      console.warn("Cart network sync deferred (Offline mode active):", err);
      // Offline fallback: Update local state if network unavailable
      if (!cartItems.some(item => item.id === product.id)) {
        const rawFallbackImg = product.image || product.product_image || (Array.isArray(product.images) && product.images[0]?.image) || '';
        const fallbackItem = {
          id: product.id,
          cartItemId: 'offline-' + Date.now(),
          name: formatProductDisplayName(product.name),
          image: resolveMediaUrl(rawFallbackImg) || rawFallbackImg || '/logo.png',
          price: formattedPrice,
          quantity: quantity,
          variation_id: effectiveVariationId,
          variation_name: variationName ? formatVariationLabel(variationName, product) : '',
          pack_size: effectivePackSize
        };
        setCartItems(prev => [...prev, fallbackItem]);
      }
    }

    if (!silent) {
      showAppToast('Added to cart successfully');
      if (wasEmpty) {
        setIsCartOpen(true);
        // Wait for cart drawer to slide in, then burst patasu right on the drawer
        setTimeout(() => {
          triggerDrawerPatasu();
        }, 350);
      } else {
        triggerCartCrackers();
      }
    }
  };

  const addBundleToCart = (bundle, quantity = 1, silent = false) => {
    const wasEmpty = cartItems.length === 0;
    const bundleKey = `bundle_${bundle.id || bundle.slug}`;

    const priceNum = typeof bundle.offerPrice === 'number' ? bundle.offerPrice : parseFloat(bundle.offerPrice) || 0;
    const regularNum = typeof bundle.regularTotal === 'number' ? bundle.regularTotal : parseFloat(bundle.regularPrice) || priceNum;

    // Compile primary/composite image from bundle items if bundle image is not set
    const bundleImage = bundle.image || (bundle.items && bundle.items[0]?.image) || '/logo.png';

    const bundleCartItem = {
      id: bundleKey,
      isBundle: true,
      bundleId: bundle.id || bundle.slug,
      cartItemId: 'bundle-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: bundle.name,
      tamil_name: bundle.tamil_name || bundle.name,
      image: bundleImage,
      price: formatCurrency(priceNum),
      offerPrice: Math.round(priceNum),
      regularPrice: Math.round(regularNum),
      discount: bundle.discountPercent ? `${bundle.discountPercent}% OFF` : '',
      quantity: quantity,
      bundleItems: (bundle.items || []).map(b => ({
        productId: b.productId,
        name: b.name || b.productName,
        tamil_name: b.tamil_name,
        quantity: b.quantity || 1,
        unitPrice: b.unitPrice || b.fallbackPrice,
        image: b.image || b.fallbackImage
      }))
    };

    // Save directly to persistent bundle store
    try {
      const stored = getStoredBundleCartItems();
      const existingIdx = stored.findIndex(i => i.id === bundleKey);
      if (existingIdx > -1) {
        stored[existingIdx].quantity += quantity;
      } else {
        stored.push(bundleCartItem);
      }
      saveStoredBundleCartItems(stored);
    } catch (e) {}

    setCartItems(prev => {
      const existingIndex = prev.findIndex(i => i.id === bundleKey);
      if (existingIndex > -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      }
      return [...prev, bundleCartItem];
    });

    if (!silent) {
      showAppToast(`Added "${bundle.name}" to cart!`);
      if (wasEmpty) {
        setIsCartOpen(true);
        setTimeout(() => {
          triggerDrawerPatasu();
        }, 350);
      } else {
        triggerCartCrackers();
      }
    }
  };

  const removeFromCart = async (productId) => {
    const user = getUser();
    const itemToRemove = cartItems.find(item => item.id === productId);

    // Optimistic UI Update - instantly remove it
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

    if (itemToRemove?.isBundle) {
      try {
        const stored = getStoredBundleCartItems().filter(i => i.id !== productId);
        saveStoredBundleCartItems(stored);
      } catch (e) {}
      return; // Local bundle item removed
    }

    if (user && itemToRemove && itemToRemove.cartItemId && !String(itemToRemove.cartItemId).startsWith('guest-') && !String(itemToRemove.cartItemId).startsWith('offline-') && !String(itemToRemove.cartItemId).startsWith('bundle-')) {
      try {
        await fetch(`${API_BASE_URL}/cart/${itemToRemove.cartItemId}/`, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        refreshCart();
      } catch (err) {
        console.error(err);
        refreshCart(); // Revert on failure
      }
    }
  };

  const updateQuantity = async (productId, amount) => {
    const user = getUser();
    const item = cartItems.find(item => item.id === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + amount);

    // Optimistic UI Update - instantly update the number
    setCartItems(prevItems =>
      prevItems.map(i => i.id === productId ? { ...i, quantity: newQuantity } : i)
    );

    if (item.isBundle) {
      try {
        const stored = getStoredBundleCartItems().map(i => i.id === productId ? { ...i, quantity: newQuantity } : i);
        saveStoredBundleCartItems(stored);
      } catch (e) {}
      return; // Local bundle item quantity updated
    }

    if (user && item.cartItemId && !String(item.cartItemId).startsWith('guest-') && !String(item.cartItemId).startsWith('offline-') && !String(item.cartItemId).startsWith('bundle-')) {
      try {
        await fetch(`${API_BASE_URL}/cart/${item.cartItemId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ quantity: newQuantity })
        });
        refreshCart(); // Background sync
      } catch (err) {
        console.error(err);
        refreshCart(); // Revert on failure
      }
    }
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Keep price & image enrichment fast: Map product id -> product
  const productById = useMemo(() => {
    const map = new Map();
    // 1. Seed from local static product cache to guarantee instant product images
    (liveProductsBackup || []).forEach((p) => {
      if (p && p.id) {
        map.set(String(p.id), p);
      }
    });
    // 2. Overlay live products from ProductsContext if loaded
    (products || []).forEach((p) => {
      if (p && p.id) {
        map.set(String(p.id), p);
      }
    });
    return map;
  }, [products]);

  // Robust product image resolver following strict user priorities
  const resolveCartItemImage = (item) => {
    if (item?.isBundle) {
      return isValidProductImage(item?.image) ? resolveMediaUrl(item.image) : '/logo.png';
    }

    // Match product using reliable product ID (from product_id, product FK, or candidate id)
    const candidateId = item?.product_id 
      || (typeof item?.product === 'number' || (typeof item?.product === 'string' && /^\d+$/.test(item.product)) ? item.product : (item?.product?.id || item?.id));

    let liveProduct = null;
    if (candidateId) {
      liveProduct = productById.get(String(candidateId))
        || (products && products.find(p => String(p.id) === String(candidateId)))
        || (liveProductsBackup && liveProductsBackup.find(p => String(p.id) === String(candidateId)));
    }

    // If reliable product ID found in catalog, prefer its clean official image
    if (liveProduct) {
      const prodImg = liveProduct.image 
        || liveProduct.product_image 
        || (Array.isArray(liveProduct.images) && liveProduct.images[0]?.image)
        || (Array.isArray(liveProduct.extra_images) && liveProduct.extra_images[0]);
      
      if (isValidProductImage(prodImg)) {
        return resolveMediaUrl(prodImg);
      }
    }

    // Priority 1: Cart item's valid image URL (ignore fallback logo.png)
    if (isValidProductImage(item?.image)) {
      return resolveMediaUrl(item.image);
    }

    // Priority 2: Cart item's product_image (ignore fallback logo.png)
    if (isValidProductImage(item?.product_image)) {
      return resolveMediaUrl(item.product_image);
    }

    // Priority 5: Match by normalized product name if ID was missing or corrupted
    if (!liveProduct && (item?.name || item?.product_name)) {
      const cleanTarget = formatProductDisplayName(item.name || item.product_name).toLowerCase().trim();
      liveProduct = (products && products.find(p => {
        const pClean = formatProductDisplayName(p.raw_name || p.name || '').toLowerCase().trim();
        return pClean === cleanTarget;
      })) || (liveProductsBackup && liveProductsBackup.find(p => {
        const pClean = formatProductDisplayName(p.name || '').toLowerCase().trim();
        return pClean === cleanTarget;
      }));
      if (liveProduct) {
        const prodImg = liveProduct.image 
          || liveProduct.product_image 
          || (Array.isArray(liveProduct.images) && liveProduct.images[0]?.image)
          || (Array.isArray(liveProduct.extra_images) && liveProduct.extra_images[0]);
        
        if (isValidProductImage(prodImg)) {
          return resolveMediaUrl(prodImg);
        }
      }
    }

    return '/logo.png';
  };

  const enrichedCartItems = useMemo(() => {
    return cartItems.map((item) => {
      if (item.isBundle) {
        return {
          ...item,
          image: resolveCartItemImage(item),
          tamil_name: item.tamil_name || item.name,
          gst_percentage: 0
        };
      }

      const rawId = item.product_id 
        || (typeof item.product === 'number' || (typeof item.product === 'string' && /^\d+$/.test(item.product)) ? item.product : (item.product?.id || item.id));

      const cleanItemName = formatProductDisplayName(item.name || item.product_name).toLowerCase().trim();
      const liveProduct = (rawId ? productById.get(String(rawId)) : null)
        || (cleanItemName ? (products || []).find(p => {
          const pClean = formatProductDisplayName(p.raw_name || p.name || '').toLowerCase().trim();
          return pClean === cleanItemName;
        }) : null);

      const finalImg = resolveCartItemImage(item);

      return {
        ...item,
        id: item.id || (liveProduct ? liveProduct.id : rawId),
        image: finalImg,
        name: liveProduct ? liveProduct.name : formatProductDisplayName(item.name),
        tamil_name: liveProduct ? liveProduct.tamil_name : (item.tamil_name || item.name),
        gst_percentage: liveProduct ? parseFloat(liveProduct.gst_percentage) || 0 : 0,
      };
    });
  }, [cartItems, productById, products]);

  // Compute calculated taxes locally based on enriched cart items
  const localTaxes = useMemo(() => {
    let totalTax = 0;
    enrichedCartItems.forEach(item => {
      const priceStr = typeof item.price === 'string' ? item.price.replace(/[^\d.]/g, '') : item.price;
      const price = parseFloat(priceStr) || 0;
      const gstRate = item.gst_percentage || 0;
      totalTax += 0;
    });

    // Split tax into CGST and SGST equally (assuming local state)
    return {
      taxTotal: totalTax,
      cgst: totalTax / 2,
      sgst: totalTax / 2,
      igst: 0
    };
  }, [enrichedCartItems]);

  const cartTotal = useMemo(() => {
    return enrichedCartItems.reduce((total, item) => {
      // Parse price strings like "₹249.00" to floats
      const priceStr = typeof item.price === 'string' ? item.price.replace(/[^\d.]/g, '') : item.price;
      const price = parseFloat(priceStr) || 0;
      return total + price * item.quantity;
    }, 0);
  }, [enrichedCartItems]);

  const effectiveShippingCost = useMemo(() => {
    if (cartTotal <= 0) return 0;

    // Look up rate for selected delivery state from existing configured rates
    const activeState = (deliveryState || '').trim().toLowerCase();
    if (activeState && stateShippingRates.length > 0) {
      const stateRate = stateShippingRates.find(r =>
        (r.state_name && r.state_name.trim().toLowerCase() === activeState) ||
        (r.state_code && r.state_code.trim().toLowerCase() === activeState)
      );

      if (stateRate) {
        const freeAbove = parseFloat(stateRate.free_above) || 0;
        const shippingAmount = parseFloat(stateRate.shipping_amount) || 0;

        // If order subtotal is equal to or greater than Free Above, shipping must be ₹0
        if (cartTotal >= freeAbove) {
          return 0;
        }
        // If order meets minimum order amount but is below Free Above, charge configured Shipping amount
        return shippingAmount;
      }
    }

    // Fallback if rates not yet loaded or state not found
    const threshold = COMPANY_FACTS?.shipping?.freeShippingThreshold || 750;
    const standardFee = COMPANY_FACTS?.shipping?.standardShippingFee || 50;

    if (cartTotal >= threshold) return 0;
    if (shippingCost !== null && shippingCost > 0) {
      return shippingCost;
    }
    return standardFee;
  }, [cartTotal, deliveryState, stateShippingRates, shippingCost]);


  return (
    <CartContext.Provider value={{
      cartItems: enrichedCartItems,
      isCartOpen,
      addToCart,
      addBundleToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      closeCart,
      cartCount,
      cartTotal,
      shippingCost: effectiveShippingCost,
      deliveryState,
      setDeliveryState,
      stateShippingRates,
      taxAmount: taxAmount || localTaxes.taxTotal,
      cgst: cgst || localTaxes.cgst,
      sgst: sgst || localTaxes.sgst,
      igst: igst || localTaxes.igst,
      taxTotal: taxTotal || localTaxes.taxTotal,
      grandTotal: grandTotal,
      refreshCart,
      triggerCartCrackers
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
