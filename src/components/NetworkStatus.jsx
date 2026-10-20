import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import './NetworkStatus.css';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showToast, setShowToast] = useState(false);
  const [statusType, setStatusType] = useState('offline');
  const { refreshProducts } = useProducts();
  const { refreshCart } = useCart();

  useEffect(() => {
    let hideTimer = null;

    const handleOnline = () => {
      setIsOnline(true);
      setStatusType('online');
      setShowToast(true);

      // Auto-sync fresh data when back online
      if (refreshProducts) refreshProducts();
      if (refreshCart) refreshCart();

      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setStatusType('offline');
      setShowToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check if opened offline
    if (!navigator.onLine) {
      setIsOnline(false);
      setStatusType('offline');
      setShowToast(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [refreshProducts, refreshCart]);

  if (!showToast && isOnline) return null;

  return (
    <div className={`network-status-capsule ${statusType} ${showToast ? 'visible' : ''}`}>
      {statusType === 'offline' ? (
        <>
          <span className="network-status-icon-dot offline-dot"></span>
          <WifiOff size={15} className="network-icon" />
          <span className="network-text">Offline Mode • Fast Local Browsing Active</span>
        </>
      ) : (
        <>
          <span className="network-status-icon-dot online-dot"></span>
          <Wifi size={15} className="network-icon" />
          <span className="network-text">Back Online • All Data Synced</span>
        </>
      )}
    </div>
  );
}
