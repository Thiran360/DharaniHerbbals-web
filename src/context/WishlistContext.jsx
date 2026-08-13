import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('dharani_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading wishlist from local storage', e);
      return [];
    }
  });

  const [recentWishlistAction, setRecentWishlistAction] = useState(null);

  const getUser = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const user = parsed.user || parsed;
      if (typeof user.id === 'string' && user.id.startsWith('user-')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
      return user;
    } catch {
      return null;
    }
  };

  const refreshWishlist = async () => {
    const user = getUser();
    if (!user) return;

    try {
      const res = await fetch(`https://api.codingboss.in/herbal/wishlist/${user.id}/`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Assuming data is an array of products
        if (Array.isArray(data)) {
          setWishlist(data);
          localStorage.setItem('dharani_wishlist', JSON.stringify(data));
        } else if (data.data && Array.isArray(data.data)) {
          setWishlist(data.data);
          localStorage.setItem('dharani_wishlist', JSON.stringify(data.data));
        } else if (data.wishlist && Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist);
          localStorage.setItem('dharani_wishlist', JSON.stringify(data.wishlist));
        }
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  // Fetch wishlist on load
  useEffect(() => {
    refreshWishlist();
  }, []);

  // Save to local storage whenever wishlist changes, for guest users
  useEffect(() => {
    if (!getUser()) {
      try {
        localStorage.setItem('dharani_wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.error('Error saving wishlist to local storage', e);
      }
    }
  }, [wishlist]);

  const addToWishlist = async (product) => {
    const user = getUser();

    // Optimistic UI update - we just append the product, so item.id is product ID
    setWishlist((prev) => {
      if (prev.find((item) => (item.product !== undefined ? item.product === product.id : item.id === product.id))) return prev;
      setRecentWishlistAction({ type: 'added', product, timestamp: Date.now() });
      return [...prev, product];
    });

    if (user) {
      try {
        await fetch('https://api.codingboss.in/herbal/wishlist/add/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            user_id: user.id,
            product_id: product.id
          })
        });
        refreshWishlist();
      } catch (err) {
        console.error('Error adding to wishlist:', err);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    const user = getUser();

    let deleteId = productId;
    const wishlistItem = wishlist.find(item => (item.product !== undefined ? item.product === productId : item.id === productId));
    if (wishlistItem && wishlistItem.product !== undefined) {
      deleteId = wishlistItem.id;
    }

    // Optimistic UI update
    setWishlist((prev) => prev.filter((item) => (item.product !== undefined ? item.product !== productId : item.id !== productId)));

    if (user) {
      try {
        await fetch(`https://api.codingboss.in/herbal/wishlist/delete/${deleteId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            user_id: user.id
          })
        });
        refreshWishlist();
      } catch (err) {
        console.error('Error removing from wishlist:', err);
      }
    }
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.product !== undefined ? item.product === productId : item.id === productId));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, recentWishlistAction, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
