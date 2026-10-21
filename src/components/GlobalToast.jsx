import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import './GlobalToast.css';

export function showAppToast(message, type = 'success') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-app-toast', { detail: { message, type } }));
  }
}

export default function GlobalToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const { message, type = 'success' } = e.detail || {};
      if (!message) return;

      // Prevent duplicate stacked notifications by clearing any active timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Re-trigger animation cleanly by setting a new key
      setToast({ message, type, id: Date.now() });

      // Automatically dismiss after 2.5 seconds (within requested 2-3s range)
      timerRef.current = setTimeout(() => {
        setToast(null);
      }, 2500);
    };

    window.addEventListener('show-app-toast', handleToastEvent);
    return () => {
      window.removeEventListener('show-app-toast', handleToastEvent);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!toast) return null;

  return (
    <div key={toast.id} className="app-global-toast" role="status" aria-live="polite">
      <div className="app-global-toast-icon">
        <Check size={14} strokeWidth={3} />
      </div>
      <span className="app-global-toast-text">{toast.message}</span>
    </div>
  );
}
