import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useProducts } from './ProductsContext';
import { useAuthModal } from './AuthModalContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [serverShippingCost, setServerShippingCost] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products } = useProducts();
  const { openLoginModal } = useAuthModal();

  const getUser = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.user || parsed;
    } catch { return null; }
  };

  const refreshCart = async (params = {}) => {
    const user = getUser();
    if (user) {
      // Sync guest cart items to user server cart if any exist
      try {
        const savedGuestCart = localStorage.getItem('dharani_cart');
        if (savedGuestCart) {
          const guestItems = JSON.parse(savedGuestCart);
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            for (const gItem of guestItems) {
              try {
                await fetch('https://api.codingboss.in/herbal/carts/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                  },
                  body: JSON.stringify({
                    user_id: user.id,
                    product_id: gItem.id,
                    quantity: gItem.quantity || 1,
                    ...(gItem.variation_id && { variation_id: gItem.variation_id })
                  })
                });
              } catch (e) {
                console.error("Cart item merge error:", e);
              }
            }
          }
          localStorage.removeItem('dharani_cart');
        }
      } catch (err) {
        console.error("Guest cart merge exception:", err);
      }

      let url = `https://api.codingboss.in/herbal/carts/?user_id=${user.id}`;
      if (params.address_id) {
        url += `&address_id=${params.address_id}`;
      }
      if (params.state) {
        url += `&state=${encodeURIComponent(params.state)}`;
      }
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: { 'ngrok-skip-browser-warning': 'true' },
          cache: 'no-store'
        });

        if (!res.ok && (res.status === 404 || res.status === 401)) {
          localStorage.removeItem('user');
          return null;
        }

        const data = await res.json();
        if (data) {
          let itemsArray = [];
          if (Array.isArray(data)) {
            itemsArray = data;
          } else if (data.cart && Array.isArray(data.cart)) {
            itemsArray = data.cart;
          } else if (data.data && Array.isArray(data.data)) {
            itemsArray = data.data;
          }

          setCartItems(itemsArray.map(item => ({
            id: item.product_id,
            cartItemId: item.id,
            name: item.product_name,
            image: item.product_image,
            price: `₹${parseFloat(item.price).toFixed(0)}`,
            quantity: item.quantity,
            variation_id: item.variation_id,
            variation_name: item.variation_name
          })));
          if (data.delivery_charge !== undefined) {
            setServerShippingCost(parseFloat(data.delivery_charge) || 0);
          } else if (data.shipping_charge !== undefined) {
            setServerShippingCost(parseFloat(data.shipping_charge) || 0);
          } else if (data.shipping_price !== undefined) {
            setServerShippingCost(parseFloat(data.shipping_price) || 0);
          } else if (data.shipping !== undefined) {
            setServerShippingCost(parseFloat(data.shipping) || 0);
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const savedCart = localStorage.getItem('dharani_cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    refreshCart();
  }, []);

  useEffect(() => {
    if (!getUser()) {
      localStorage.setItem('dharani_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = async (product, quantity = 1, variationId = null) => {
    const user = getUser();

    // Guest User Flow - No forced sign-in
    if (!user) {
      setCartItems(prevItems => {
        const existingIndex = prevItems.findIndex(item =>
          item.id === product.id && (variationId ? item.variation_id === variationId : true)
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity
          };
          return updated;
        } else {
          let formattedPrice = '₹0';
          if (product.price) {
            if (typeof product.price === 'string') {
              formattedPrice = product.price.startsWith('₹') ? product.price : `₹${product.price}`;
            } else {
              formattedPrice = `₹${parseFloat(product.price).toFixed(0)}`;
            }
          }

          let variationName = product.variation_name || '';
          if (variationId && product.variations && Array.isArray(product.variations)) {
            const vMatch = product.variations.find(v => v.id === variationId || v.variation_id === variationId);
            if (vMatch) {
              variationName = vMatch.name || vMatch.variation_name || vMatch.weight || variationName;
            }
          }

          const newItem = {
            id: product.id,
            cartItemId: `guest_${product.id}_${variationId || 'default'}_${Date.now()}`,
            name: product.name,
            image: product.image || (product.images && product.images[0]?.image) || '/logo.png',
            price: formattedPrice,
            quantity: quantity,
            variation_id: variationId || null,
            variation_name: variationName,
            gst_percentage: product.gst_percentage || 0
          };

          return [...prevItems, newItem];
        }
      });

      setIsCartOpen(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#fbbf24', '#f87171', '#a855f7', '#ffffff'],
        zIndex: 100000
      });
      return;
    }

    // Logged-in User Flow
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.variation_id === variationId) {
        // Same variation -> just add quantity
        updateQuantity(product.id, quantity);
        setIsCartOpen(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#fbbf24', '#f87171', '#a855f7', '#ffffff'],
          zIndex: 100000
        });
        return;
      } else {
        // Different variation -> Delete the old one before adding the new one
        try {
          await fetch(`https://api.codingboss.in/herbal/carts/${existingItem.cartItemId}/`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': 'true' }
          });
        } catch (e) { console.error(e); }
      }
    }

    try {
      const response = await fetch('https://api.codingboss.in/herbal/carts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          quantity: quantity,
          ...(variationId && { variation_id: variationId })
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        if (errData.message && errData.message.toLowerCase().includes('user')) {
          localStorage.removeItem('user');
          // Add to guest cart as fallback so action is never lost
          setCartItems(prevItems => [
            ...prevItems,
            {
              id: product.id,
              cartItemId: `guest_${product.id}_${Date.now()}`,
              name: product.name,
              image: product.image || '/logo.png',
              price: typeof product.price === 'string' && product.price.startsWith('₹') ? product.price : `₹${product.price}`,
              quantity: quantity,
              variation_id: variationId || null,
              variation_name: product.variation_name || '',
              gst_percentage: product.gst_percentage || 0
            }
          ]);
          setIsCartOpen(true);
          return;
        }
      }

      await refreshCart();
    } catch (err) { console.error(err); }

    setIsCartOpen(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#fbbf24', '#f87171', '#a855f7', '#ffffff'],
      zIndex: 100000
    });
  };

  const removeFromCart = async (productId) => {
    const user = getUser();
    const itemToRemove = cartItems.find(item => item.id === productId);

    // Optimistic UI Update - instantly remove it
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

    if (user && itemToRemove && itemToRemove.cartItemId && !String(itemToRemove.cartItemId).startsWith('guest_')) {
      try {
        await fetch(`https://api.codingboss.in/herbal/cart/${itemToRemove.cartItemId}/`, {
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

    if (user && item.cartItemId && !String(item.cartItemId).startsWith('guest_')) {
      try {
        await fetch(`https://api.codingboss.in/herbal/cart/${item.cartItemId}/`, {
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

  // Keep price enrichment fast: Map product id -> product
  const productById = useMemo(() => {
    const map = new Map();
    (products || []).forEach((p) => {
      if (p && p.id) {
        map.set(String(p.id), p);
      }
    });
    return map;
  }, [products]);

  const enrichedCartItems = useMemo(() => {
    return cartItems.map((item) => {
      const liveProduct = productById.get(String(item.id));
      return {
        ...item,
        tamil_name: liveProduct ? liveProduct.tamil_name : (item.tamil_name || item.name),
        gst_percentage: liveProduct ? (parseFloat(liveProduct.gst_percentage) || 0) : (parseFloat(item.gst_percentage) || 0),
      };
    });
  }, [cartItems, productById]);

  // Centralized single-source calculation for Cart and Checkout
  const pricing = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;

    enrichedCartItems.forEach(item => {
      const priceStr = typeof item.price === 'string' ? item.price.replace(/[^\d.]/g, '') : item.price;
      const unitPrice = parseFloat(priceStr) || 0;
      const qty = parseInt(item.quantity, 10) || 1;
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;

      const gstRate = parseFloat(item.gst_percentage) || 0;
      if (gstRate > 0) {
        // Price is inclusive of tax. Tax = Price - (Price / (1 + (gstRate / 100)))
        const basePrice = lineTotal / (1 + (gstRate / 100));
        totalTax += (lineTotal - basePrice);
      }
    });

    subtotal = parseFloat(subtotal.toFixed(2));
    totalTax = parseFloat(totalTax.toFixed(2));

    const cgst = parseFloat((totalTax / 2).toFixed(2));
    const sgst = parseFloat((totalTax / 2).toFixed(2));
    const igst = 0;

    // Shipping rules:
    // Subtotal 0 -> 0
    // Subtotal >= 500 -> Free (0)
    // Subtotal < 500 -> server delivery charge if present, else 50
    let shipping = 0;
    if (subtotal > 0) {
      if (subtotal >= 500) {
        shipping = 0;
      } else if (serverShippingCost !== null && serverShippingCost !== undefined) {
        shipping = serverShippingCost;
      } else {
        shipping = 50;
      }
    }

    const discountAmount = 0;
    // Do NOT add totalTax to grandTotal since prices are inclusive of tax
    const grand = parseFloat((Math.max(0, subtotal - discountAmount) + shipping).toFixed(2));

    return {
      subtotal,
      cartTotal: subtotal,
      shippingCost: shipping,
      isFreeShipping: shipping === 0 && subtotal > 0,
      cgst,
      sgst,
      igst,
      taxTotal: totalTax,
      taxAmount: totalTax,
      discountAmount,
      grandTotal: grand,
      finalTotal: grand
    };
  }, [enrichedCartItems, serverShippingCost]);

  return (
    <CartContext.Provider value={{
      cartItems: enrichedCartItems,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      closeCart,
      cartCount,
      subtotal: pricing.subtotal,
      cartTotal: pricing.subtotal,
      shippingCost: pricing.shippingCost,
      isFreeShipping: pricing.isFreeShipping,
      cgst: pricing.cgst,
      sgst: pricing.sgst,
      igst: pricing.igst,
      taxTotal: pricing.taxTotal,
      taxAmount: pricing.taxTotal,
      discountAmount: pricing.discountAmount,
      grandTotal: pricing.grandTotal,
      finalTotal: pricing.grandTotal,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
