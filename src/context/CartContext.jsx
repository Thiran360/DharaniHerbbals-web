import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useProducts } from './ProductsContext';
import { useAuthModal } from './AuthModalContext';
import { API_BASE_URL } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(null);
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
    const user = getUser();
    if (user) {
      let url = `${API_BASE_URL}/carts/?user_id=${user.id}`;
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
          openLoginModal();
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
            setShippingCost(parseFloat(data.delivery_charge) || 0);
          } else if (data.shipping_charge !== undefined) {
            setShippingCost(parseFloat(data.shipping_charge) || 0);
          } else if (data.shipping_price !== undefined) {
            setShippingCost(parseFloat(data.shipping_price) || 0);
          } else if (data.shipping !== undefined) {
            setShippingCost(parseFloat(data.shipping) || 0);
          }
          if (data.gst_total !== undefined) {
            setTaxAmount(parseFloat(data.gst_total) || 0);
          } else if (data.tax !== undefined) {
            setTaxAmount(parseFloat(data.tax) || 0);
          } else if (data.tax_amount !== undefined) {
            setTaxAmount(parseFloat(data.tax_amount) || 0);
          }

          // New separate tax fields
          if (data.cgst !== undefined) setCgst(parseFloat(data.cgst) || 0);
          if (data.sgst !== undefined) setSgst(parseFloat(data.sgst) || 0);
          if (data.igst !== undefined) setIgst(parseFloat(data.igst) || 0);
          if (data.tax_total !== undefined) {
            setTaxTotal(parseFloat(data.tax_total) || 0);
            // Fallback taxAmount if not set above
            setTaxAmount(prev => prev || parseFloat(data.tax_total) || 0);
          }
          if (data.grand_total !== undefined) {
            setGrandTotal(parseFloat(data.grand_total) || 0);
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const savedCart = localStorage.getItem('dharani_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
      else setCartItems([]);
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

    if (!user) {
      openLoginModal();
      return;
    }

    // Check if the exact product is already in cart
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.variation_id === variationId) {
        // Same variation -> just add quantity
        updateQuantity(product.id, quantity);
        setIsCartOpen(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#fbbf24', '#f87171', '#a855f7', '#ffffff'],
          zIndex: 100000
        });
        return;
      } else {
        // Different variation -> Backend doesn't support multiple variations of the same product.
        // We must delete the old one before adding the new one.
        try {
          await fetch(`${API_BASE_URL}/carts/${existingItem.cartItemId}/`, {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': 'true' }
          });
        } catch (e) { console.error(e); }
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
          ...(variationId && { variation_id: variationId })
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        if (errData.message && errData.message.toLowerCase().includes('user')) {
          localStorage.removeItem('user');
          if (typeof openLoginModal === 'function') openLoginModal();
          return; // Stop execution
        }
      }

      await refreshCart();
    } catch (err) { console.error(err); }

    setIsCartOpen(true);
    confetti({
      particleCount: 100,
      spread: 70,
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

    if (user && itemToRemove && itemToRemove.cartItemId) {
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

    if (user && item.cartItemId) {
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
        tamil_name: liveProduct ? liveProduct.tamil_name : item.name,
        gst_percentage: liveProduct ? parseFloat(liveProduct.gst_percentage) || 0 : 0,
      };
    });
  }, [cartItems, productById]);

  // Compute calculated taxes locally based on enriched cart items
  const localTaxes = useMemo(() => {
    let totalTax = 0;
    enrichedCartItems.forEach(item => {
      const priceStr = typeof item.price === 'string' ? item.price.replace(/[^\d.]/g, '') : item.price;
      const price = parseFloat(priceStr) || 0;
      const gstRate = item.gst_percentage || 0;
      totalTax += (price * item.quantity * (gstRate / 100));
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

  const calculatedShippingCost = useMemo(() => {
    return cartTotal > 0 && cartTotal < 500 ? 50 : 0;
  }, [cartTotal]);


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
      cartTotal,
      shippingCost: shippingCost !== null ? shippingCost : calculatedShippingCost,
      taxAmount: taxAmount || localTaxes.taxTotal,
      cgst: cgst || localTaxes.cgst,
      sgst: sgst || localTaxes.sgst,
      igst: igst || localTaxes.igst,
      taxTotal: taxTotal || localTaxes.taxTotal,
      grandTotal: grandTotal,
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
