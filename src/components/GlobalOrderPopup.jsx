import { useState, useEffect, useRef } from 'react';
import { Package, Truck, CheckCircle, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';
import './GlobalOrderPopup.css';

export default function GlobalOrderPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const shownStatusRef = useRef(new Set()); // Track shown statuses in memory so hard refresh shows it again

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const parsed = JSON.parse(storedUser);
        const actualUser = parsed.user || parsed;
        if (!actualUser || !actualUser.id || actualUser.role === 'admin' || parsed.is_admin) return;

        const role1 = (parsed.role || '').toLowerCase();
        const role2 = (parsed.user?.role || '').toLowerCase();
        const type1 = (parsed.user_type || '').toLowerCase();
        const type2 = (parsed.user?.user_type || '').toLowerCase();
        const isStaff = parsed.is_store_login || parsed.is_store_member || parsed.user?.is_store_member || parsed.is_store ||
          ['staff', 'store', 'store_member'].includes(role1) ||
          ['staff', 'store', 'store_member'].includes(role2) ||
          ['staff', 'store', 'store_member'].includes(type1) ||
          ['staff', 'store', 'store_member'].includes(type2);
        const roleParam = isStaff ? 'staff' : 'customer';

        const response = await fetch(`${API_BASE_URL}/orders/?user_id=${actualUser.id}&role=${roleParam}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        if (response.ok) {
          const data = await response.json();
          let fetchedOrders = Array.isArray(data) ? data : (data.results || data.value || []);

          if (fetchedOrders.length > 0) {
            // Sort by date descending
            fetchedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            const latestOrder = fetchedOrders[0];

            // Unique key for this specific order state
            const currentStatusKey = `${latestOrder.order_id}_${latestOrder.status}`;

            // If we haven't shown this exact status update yet since page load
            if (!shownStatusRef.current.has(currentStatusKey)) {
              setOrder(latestOrder);
              setShowPopup(true);
              shownStatusRef.current.add(currentStatusKey);

              // Auto hide after 8 seconds
              setTimeout(() => setShowPopup(false), 8000);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest order for notification", err);
      }
    };

    // Check for updates on mount and on route changes
    const timer = setTimeout(fetchLatestOrder, 1500);
    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run when user navigates around the app

  if (!showPopup || !order) return null;

  const getStatusStep = (status) => {
    if (!status) return 1;
    const s = String(status).toLowerCase();
    if (s === 'delivered') return 3;
    if (s === 'shipped') return 2;
    return 1;
  };

  const step = getStatusStep(order.status);

  const getPopupContent = () => {
    if (step === 3) return { title: 'Order Delivered', desc: 'Package arrived safely', icon: <CheckCircle size={24} /> };
    if (step === 2) return { title: 'Order Shipped', desc: 'Your order is on the way', icon: <Truck size={24} /> };
    return { title: 'Order Placed', desc: 'We have received your order', icon: <Package size={24} /> };
  };

  const popupData = getPopupContent();

  return (
    <div className={`global-status-popup step-${step}`} onClick={() => navigate(`/track/${order.order_id}`)}>
      <div className="popup-icon-container">
        {popupData.icon}
      </div>
      <div className="popup-text">
        <h4>{popupData.title}</h4>
        <p>{popupData.desc}</p>
        <span className="popup-link">Click to track order</span>
      </div>
      <button className="popup-close" onClick={(e) => { e.stopPropagation(); setShowPopup(false); }}>
        <X size={16} />
      </button>
    </div>
  );
}
