import { useEffect, useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Heart, X } from 'lucide-react';
import './WishlistToast.css';

export default function WishlistToast() {
  const { recentWishlistAction } = useWishlist();
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState(null);
  const [animOut, setAnimOut] = useState(false);

  useEffect(() => {
    if (!recentWishlistAction) return;

    setAnimOut(false);
    setToast(recentWishlistAction);
    setVisible(true);

    const hideTimer = setTimeout(() => {
      setAnimOut(true);
    }, 2600);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      setToast(null);
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [recentWishlistAction]);

  if (!visible || !toast) return null;

  const isAdded = toast.type === 'added';

  return (
    <div className={`wl-toast ${isAdded ? 'wl-toast-added' : 'wl-toast-removed'} ${animOut ? 'wl-toast-out' : ''}`}>
      <div className="wl-toast-icon">
        <Heart size={18} fill={isAdded ? '#ef4444' : 'transparent'} color={isAdded ? '#ef4444' : '#6b7280'} strokeWidth={2} />
      </div>
      <span className="wl-toast-msg">
        {isAdded ? '❤️ Item saved to Wishlist!' : '🗑️ Item removed from Wishlist'}
      </span>
      <button className="wl-toast-close" onClick={() => { setAnimOut(true); setTimeout(() => { setVisible(false); setToast(null); }, 400); }}>
        <X size={14} />
      </button>
    </div>
  );
}
