import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, Package, Heart, LogOut, ChevronRight, Image as ImageIcon, MapPin, Plus, Trash2, ChevronDown, Calendar, ShoppingCart } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuthModal } from '../context/AuthModalContext';
import UsageCalendar from '../components/UsageCalendar';
import { API_BASE_URL, getMyOrdersUrl } from '../services/api';
import './Profile.css';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'account'); // Added tab state
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({ name: '', email: '' });
  const [profileUpdating, setProfileUpdating] = useState(false);
  
  // ── Wishlist Add All ──
  const [addingAllToCart, setAddingAllToCart] = useState(false);
  const [addAllMessage, setAddAllMessage] = useState(null);

  // ── Mobile number change flow ──
  const [mobileChangeMode, setMobileChangeMode] = useState('idle'); // 'idle' | 'input' | 'otp'
  const [newMobile, setNewMobile] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileOtpUserId, setMobileOtpUserId] = useState(null);
  const [mobileOtpLoading, setMobileOtpLoading] = useState(false);
  const [mobileOtpError, setMobileOtpError] = useState('');
  const [mobileOtpSuccess, setMobileOtpSuccess] = useState('');
  const [mobileResendTimer, setMobileResendTimer] = useState(0);
  const mobileResendRef = useRef(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    id: null, full_name: '', phone: '', address: '', city: '', state: '', pincode: '', latitude: '11.0168', longitude: '76.9558', is_default: false
  });
  const { products, refreshProducts } = useProducts();
  const { addToCart, refreshCart, cartItems } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { language, t } = useLanguage();
  const { openLoginModal } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Fetch user from localStorage
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        // If the user is an admin, clear their local storage and redirect to the dashboard
        if (parsed.mobile === 'admin' || parsed.is_admin || parsed.user?.role === 'admin') {
          localStorage.removeItem('user');
          window.location.href = '/admin';
          return;
        }

        setUserData(parsed);
        const actualUser = parsed.user || parsed;
        if (actualUser && actualUser.id) {
          fetch(`${API_BASE_URL}/customers/${actualUser.id}/`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          }).then(res => res.json()).then(customerData => {
            let backendUser = customerData;
            if (Array.isArray(backendUser) && backendUser.length > 0) backendUser = backendUser[0];
            if (backendUser && (backendUser.email || backendUser.name)) {
               const merged = { ...actualUser, ...backendUser };
               const updatedData = { ...parsed, user: merged };
               localStorage.setItem('user', JSON.stringify(updatedData));
               setUserData(updatedData);
            }
          }).catch(() => {});
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

          fetch(getMyOrdersUrl(actualUser.id), {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          })
            .then(res => {
              if (!res.ok) {
                return fetch(`${API_BASE_URL}/orders/?user_id=${actualUser.id}&role=${roleParam}`, {
                  headers: { 'ngrok-skip-browser-warning': 'true' }
                }).then(r => r.json());
              }
              return res.json();
            })
            .then(async (data) => {
              let fetchedOrders = [];
              if (Array.isArray(data)) {
                fetchedOrders = data;
              } else if (data && Array.isArray(data.orders)) {
                fetchedOrders = data.orders;
              } else if (data && Array.isArray(data.results)) {
                fetchedOrders = data.results;
              } else if (data && Array.isArray(data.value)) {
                fetchedOrders = data.value;
              }

              // Fetch addresses for this user
              fetch(`${API_BASE_URL}/address/${actualUser.id}/`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
              })
                .then(res => res.json())
                .then(addressData => {
                  if (addressData && Array.isArray(addressData.addresses)) {
                    setAddresses(addressData.addresses);
                  } else if (Array.isArray(addressData)) {
                    setAddresses(addressData);
                  }
                })
                .catch(err => console.error("Failed to fetch addresses", err));

              // Now fetch the details for each order to get the items
              try {
                const ordersWithItems = await Promise.all(
                  fetchedOrders.map(async (order) => {
                    try {
                      // Skip fetching tracking for pending/failed orders to avoid backend 502 errors
                      if (order.status && (order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'failed')) {
                        return order;
                      }

                      // Fetch the tracking info using the new ngrok track endpoint
                      const trackingIdToUse = order.id || order.order_id;
                      const trackRes = await fetch(`${API_BASE_URL}/tracking/${trackingIdToUse}/`, {
                        headers: { 'ngrok-skip-browser-warning': 'true' }
                      });
                      if (trackRes.ok) {
                        const trackData = await trackRes.json();
                        return { ...order, items: trackData.items };
                      }
                    } catch (err) {
                      // Silently ignore to prevent console spam
                    }
                    return order;
                  })
                );
                setOrders(ordersWithItems);
              } catch (err) {
                console.error("Failed to fetch order details in parallel", err);
                setOrders(fetchedOrders);
              }

              setLoadingOrders(false);
            })
            .catch(err => {
              console.error("Failed to fetch orders", err);
              setLoadingOrders(false);
            });
        } else {
          setLoadingOrders(false);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
        setLoadingOrders(false);
      }
    } else {
      // If no user found, open login modal and redirect to home
      openLoginModal();
      navigate('/');
    }
  }, [navigate, openLoginModal]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user-login-status-changed'));
    if (refreshProducts) {
      refreshProducts();
    }
    if (refreshCart) {
      refreshCart();
    }
    navigate('/login');
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    if (!userData || (!userData.id && !userData.user?.id)) return;
    const actualUser = userData.user || userData;
    setProfileUpdating(true);

    const userRole = (actualUser.role || '').toLowerCase();
    const isB2B = ['retailer', 'reseller', 'staff', 'store', 'store_member'].includes(userRole);
    const updateEndpoint = isB2B
      ? `${API_BASE_URL}/retailers/${actualUser.id}/`
      : `${API_BASE_URL}/customers/${actualUser.id}/`;

    try {
      const response = await fetch(updateEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          name: profileFormData.name,
          email: profileFormData.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...actualUser, name: profileFormData.name, email: profileFormData.email };
        const updatedUserData = { ...userData, user: updatedUser };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        setIsEditingProfile(false);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setProfileUpdating(false);
    }
  };

  // ── Mobile number change: Step 1 – Send OTP ──
  const handleSendMobileOtp = async () => {
    const digits = newMobile.replace(/\D/g, '');
    if (digits.length !== 10) {
      setMobileOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }
    const actualUser = userData?.user || userData;
    const currentMobile = (actualUser?.mobile || actualUser?.phone_number || '').replace(/\D/g, '');
    if (digits === currentMobile) {
      setMobileOtpError('New number is the same as your current number.');
      return;
    }
    setMobileOtpError('');
    setMobileOtpLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ mobile: digits, phone_number: digits })
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        if (data.user_id) setMobileOtpUserId(data.user_id);
        setMobileChangeMode('otp');
        setMobileOtp('');
        setMobileOtpError('');
        // Start 30-second resend timer
        setMobileResendTimer(30);
        if (mobileResendRef.current) clearInterval(mobileResendRef.current);
        mobileResendRef.current = setInterval(() => {
          setMobileResendTimer(prev => {
            if (prev <= 1) { clearInterval(mobileResendRef.current); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setMobileOtpError(data.message || data.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setMobileOtpError('Network error. Please try again.');
    } finally {
      setMobileOtpLoading(false);
    }
  };

  // ── Mobile number change: Step 2 – Verify OTP & Update ──
  const handleVerifyMobileOtp = async () => {
    const digits = newMobile.replace(/\D/g, '');
    if (mobileOtp.length < 4) {
      setMobileOtpError('Please enter the OTP sent to your new number.');
      return;
    }
    setMobileOtpError('');
    setMobileOtpLoading(true);
    try {
      // Verify OTP
      const verifyRes = await fetch(`${API_BASE_URL}/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({
          phone_number: digits,
          mobile: digits,
          otp: mobileOtp,
          ...(mobileOtpUserId && { user_id: mobileOtpUserId })
        })
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || verifyData.success === false) {
        setMobileOtpError(verifyData.message || verifyData.error || 'Invalid OTP. Please try again.');
        setMobileOtpLoading(false);
        return;
      }

      // OTP verified — now PATCH the user's mobile number
      const actualUser = userData?.user || userData;
      const userRole = (actualUser?.role || '').toLowerCase();
      const isB2B = ['retailer', 'reseller', 'staff', 'store', 'store_member'].includes(userRole);
      const updateEndpoint = isB2B
        ? `${API_BASE_URL}/retailers/${actualUser.id}/`
        : `${API_BASE_URL}/customers/${actualUser.id}/`;

      const patchRes = await fetch(updateEndpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ mobile: digits, phone_number: digits })
      });
      const patchData = await patchRes.json();

      if (patchRes.ok) {
        const updatedUser = { ...actualUser, mobile: digits, phone_number: digits };
        const updatedUserData = { ...userData, user: updatedUser };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        setMobileOtpSuccess('✅ Mobile number updated successfully!');
        setMobileChangeMode('idle');
        setNewMobile('');
        setMobileOtp('');
        setMobileOtpUserId(null);
        if (mobileResendRef.current) clearInterval(mobileResendRef.current);
      } else {
        setMobileOtpError(patchData.message || 'Failed to update mobile number.');
      }
    } catch {
      setMobileOtpError('Network error. Please try again.');
    } finally {
      setMobileOtpLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!userData) return;
    const actualUser = userData.user || userData;
    const payload = { ...addressFormData, user_id: actualUser.id };
    if (addressFormData.id) {
      payload.address_id = addressFormData.id;
    }

    try {
      let url = `${API_BASE_URL}/address/`;
      let method = addressFormData.id ? 'PUT' : 'POST';

      if (addressFormData.id) {
        url = `${url}${addressFormData.id}/`;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Refresh addresses
        const addrRes = await fetch(`${API_BASE_URL}/address/${actualUser.id}/`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        const addrData = await addrRes.json();

        if (addrData && Array.isArray(addrData.addresses)) {
          setAddresses(addrData.addresses);
        } else {
          setAddresses(Array.isArray(addrData) ? addrData : []);
        }

        setShowAddressForm(false);
        setAddressFormData({ id: null, full_name: '', phone: '', address: '', city: '', state: '', pincode: '', latitude: '11.0168', longitude: '76.9558', is_default: false });
      } else {
        console.error("Failed to save address");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete || !userData) return;

    const id = addressToDelete;
    const actualUser = userData.user || userData;
    try {
      const res = await fetch(`${API_BASE_URL}/address/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ address_id: id })
      });
      if (res.ok) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddressToDelete(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? If you have paid, a refund will be initiated.")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/paytm/refund/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ order_id: orderId })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("Order cancelled successfully. " + (data.message || ""));
        // Update local order status to 'Cancelled'
        setOrders(orders.map(o => o.order_id === orderId ? { ...o, status: 'Cancelled' } : o));
      } else {
        alert("Failed to cancel order: " + (data.message || data.error || "Please try again."));
      }
    } catch (err) {
      console.error(err);
      alert("Network error while trying to cancel order.");
    }
  };

  const handleEditAddress = (addr) => {
    setAddressFormData(addr);
    setShowAddressForm(true);
  };

  const handleAddAllToCart = async () => {
    if (wishlist.length === 0 || addingAllToCart) return;
    
    setAddingAllToCart(true);
    setAddAllMessage(null);

    let addedCount = 0;
    const outOfStockNames = [];

    for (const item of wishlist) {
      const pId = item.product || item.product_id || item.id;
      const matchedProduct = products.find(p => String(p.id) === String(pId));
      
      if (!matchedProduct) continue;

      // Check if already in cart
      const alreadyInCart = cartItems && cartItems.some(cItem => String(cItem.id) === String(matchedProduct.id));
      if (alreadyInCart) {
        // Skip so we do not increase the existing quantity
        continue;
      }

      let isOutOfStock = false;
      if (matchedProduct.stock !== undefined) {
        isOutOfStock = Number(matchedProduct.stock) <= 0;
      } else if (matchedProduct.quantity !== undefined) {
        isOutOfStock = Number(matchedProduct.quantity) <= 0;
      } else if (matchedProduct.in_stock !== undefined) {
        isOutOfStock = !matchedProduct.in_stock;
      } else if (matchedProduct.status !== undefined) {
        const s = String(matchedProduct.status).toLowerCase();
        isOutOfStock = (s === 'out_of_stock' || s === 'outofstock');
      }

      if (isOutOfStock) {
        const itemName = matchedProduct.name || item.name || item.product_name;
        outOfStockNames.push(itemName);
        continue;
      }

      try {
        await addToCart(matchedProduct, 1);
        addedCount++;
      } catch (e) {
        console.error("Failed to add item to cart", e);
      }
    }

    setAddingAllToCart(false);

    if (addedCount > 0) {
      const skippedMsg = outOfStockNames.length > 0 ? ` (Skipped unavailable: ${outOfStockNames.join(', ')})` : '';
      setAddAllMessage({
        type: 'success',
        text: `${addedCount} product${addedCount > 1 ? 's' : ''} added to your cart.${skippedMsg}`
      });
      if (refreshCart) refreshCart();
    } else if (outOfStockNames.length > 0) {
      setAddAllMessage({
        type: 'error',
        text: `Products are out of stock: ${outOfStockNames.join(', ')}`
      });
    } else {
      setAddAllMessage({
        type: 'error',
        text: 'No new products were added (they might already be in your cart).'
      });
    }
  };

  if (!userData)  {
    return <div className="profile-loading">Loading your profile...</div>;
  }

  // Fallback data if API doesn't return everything
  const user = userData.user || userData;
  const name = user.name || 'Dharani Customer';
  const mobile = user.mobile || user.phone_number || '+91 00000 00000';
  const email = user.email || 'No email provided';

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">

        {/* Left Column: SaaS Sidebar */}
        <div className="saas-sidebar">
          <div className="saas-profile-header">
            <div className="saas-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="saas-profile-info">
              <h2 className="saas-name">{name}</h2>
              <p className="saas-email">{email}</p>
            </div>
          </div>

          <nav className="saas-nav">
            <button
              className={`saas-nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
              title="Profile Settings"
              aria-label="Profile Settings"
            >
              <User size={18} />
              <span>Profile Settings</span>
            </button>
            <button
              className={`saas-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
              title="Order History"
              aria-label="Order History"
            >
              <Package size={18} />
              <span>Order History</span>
            </button>
            <button
              className={`saas-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
              title="Saved Addresses"
              aria-label="Saved Addresses"
            >
              <MapPin size={18} />
              <span>Saved Addresses</span>
            </button>
            <button
              className={`saas-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              <span>Wishlist</span>
            </button>
            <button
              className={`saas-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
              title="Usage Calendar"
              aria-label="Usage Calendar"
            >
              <Calendar size={18} />
              <span>Usage Calendar</span>
            </button>
            <div className="saas-nav-divider"></div>
            <button className="saas-nav-item logout" onClick={handleLogout} title="Sign Out" aria-label="Sign Out">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Right Column: Main Content */}
        <div className="profile-main-content">
          {activeTab === 'account' && (
            <>
              <div className="profile-content-header">
                <h1>Account Details</h1>
                <p>Manage your personal information and preferences.</p>
              </div>

              {isEditingProfile ? (
                <form className="address-form" onSubmit={handleEditProfileSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileFormData.name}
                      onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileFormData.email}
                      onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ opacity: 0.6 }}>
                    <label>Mobile Number</label>
                    <input type="text" value={mobile} disabled />
                    <small style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>To change your mobile number, use the "Change" option on the profile view.</small>
                  </div>
                  <div className="address-form-actions">
                    <button type="button" className="btn-cancel" onClick={() => setIsEditingProfile(false)} disabled={profileUpdating}>Cancel</button>
                    <button type="submit" className="btn-save" disabled={profileUpdating}>{profileUpdating ? 'Saving...' : 'Save Profile'}</button>
                  </div>
                </form>
              ) : (
                <>
                  {mobileOtpSuccess && (
                    <div className="profile-mobile-success">{mobileOtpSuccess}</div>
                  )}

                  <div className="profile-info-grid">
                    <div className="profile-info-card">
                      <div className="info-icon"><User size={20} /></div>
                      <div className="info-details">
                        <label>Full Name</label>
                        <p>{name}</p>
                      </div>
                    </div>

                    <div className="profile-info-card">
                      <div className="info-icon"><Mail size={20} /></div>
                      <div className="info-details">
                        <label>Email Address</label>
                        <p>{email}</p>
                      </div>
                    </div>

                    {/* Mobile Number card with inline change flow */}
                    <div className="profile-info-card profile-mobile-card">
                      <div className="info-icon"><Phone size={20} /></div>
                      <div className="info-details" style={{ flex: 1 }}>
                        <label>Mobile Number</label>

                        {mobileChangeMode === 'idle' && (
                          <div className="profile-mobile-view">
                            <p>{mobile}</p>
                          </div>
                        )}

                        {mobileChangeMode === 'input' && (
                          <div className="profile-mobile-input-row">
                            <input
                              type="tel"
                              className="mobile-change-input"
                              placeholder="Enter new 10-digit number"
                              maxLength={10}
                              value={newMobile}
                              onChange={(e) => { setNewMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setMobileOtpError(''); }}
                            />
                            {mobileOtpError && <p className="profile-mobile-error">{mobileOtpError}</p>}
                            <div className="profile-mobile-actions">
                              <button type="button" className="btn-cancel" onClick={() => { setMobileChangeMode('idle'); setMobileOtpError(''); }} disabled={mobileOtpLoading}>Cancel</button>
                              <button type="button" className="btn-save" onClick={handleSendMobileOtp} disabled={mobileOtpLoading || newMobile.length < 10}>
                                {mobileOtpLoading ? 'Sending...' : 'Send OTP'}
                              </button>
                            </div>
                          </div>
                        )}

                        {mobileChangeMode === 'otp' && (
                          <div className="profile-mobile-otp-row">
                            <p className="profile-otp-hint">OTP sent to <strong>+91 {newMobile}</strong></p>
                            <input
                              type="tel" autoComplete="one-time-code" className="mobile-change-input" placeholder="Enter 6-digit OTP"
                              maxLength={6}
                              value={mobileOtp}
                              onChange={(e) => { setMobileOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setMobileOtpError(''); }}
                              autoFocus
                            />
                            {mobileOtpError && <p className="profile-mobile-error">{mobileOtpError}</p>}
                            <div className="profile-mobile-actions">
                              <button type="button" className="btn-cancel" onClick={() => { setMobileChangeMode('input'); setMobileOtpError(''); }} disabled={mobileOtpLoading}>Back</button>
                              <button type="button" className="btn-save" onClick={handleVerifyMobileOtp} disabled={mobileOtpLoading || mobileOtp.length < 4}>
                                {mobileOtpLoading ? 'Verifying...' : 'Verify & Update'}
                              </button>
                            </div>
                            <button
                              type="button"
                              className="profile-resend-otp"
                              onClick={handleSendMobileOtp}
                              disabled={mobileResendTimer > 0 || mobileOtpLoading}
                            >
                              {mobileResendTimer > 0 ? `Resend OTP in ${mobileResendTimer}s` : 'Resend OTP'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn-shop-now"
                    style={{ marginTop: '20px', width: 'auto' }}
                    onClick={() => {
                      setProfileFormData({
                        name: (name !== 'Vedan Customer' && name !== 'Dharani Customer') ? name : '',
                        email: email !== 'No email provided' ? email : ''
                      });
                      setIsEditingProfile(true);
                    }}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </>
          )}

          {activeTab === 'addresses' && (
            <div className="profile-addresses">
              <div className="profile-content-header has-action">
                <div>
                  <h1>My Addresses</h1>
                  <p>Manage your shipping addresses for quick checkout.</p>
                </div>
              </div>

              {showAddressForm ? (
                <div className="address-form-container fade-in">
                  <h3 style={{ marginBottom: '20px' }}>{addressFormData.id ? 'Edit Address' : 'Add New Address'}</h3>
                  <form className="address-form" onSubmit={handleAddressSubmit}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" value={addressFormData.full_name} onChange={(e) => setAddressFormData({ ...addressFormData, full_name: e.target.value })} required placeholder="Enter name" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" value={addressFormData.phone} onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })} required placeholder="10-digit mobile number" />
                    </div>
                    <div className="form-group">
                      <label>Address (House No, Building, Street)</label>
                      <textarea value={addressFormData.address} onChange={(e) => setAddressFormData({ ...addressFormData, address: e.target.value })} required placeholder="Full address" rows="3" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input type="text" value={addressFormData.city} onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })} required placeholder="City" />
                      </div>
                      <div className="form-group relative">
                        <label>State</label>
                        <div
                          className="custom-select-trigger"
                          onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                        >
                          <span style={{ color: addressFormData.state ? '#0f172a' : '#94a3b8' }}>
                            {addressFormData.state || 'Select State'}
                          </span>
                          <ChevronDown size={18} className={isStateDropdownOpen ? 'rotate-180' : ''} style={{ transition: 'transform 0.2s', color: '#64748b' }} />
                        </div>

                        {isStateDropdownOpen && (
                          <>
                            <div className="custom-select-overlay" onClick={() => setIsStateDropdownOpen(false)} />
                            <div className="custom-select-dropdown">
                              {INDIAN_STATES.map(state => (
                                <div
                                  key={state}
                                  className={`custom-select-option ${addressFormData.state === state ? 'selected' : ''}`}
                                  onClick={() => {
                                    setAddressFormData(prev => ({ ...prev, state }));
                                    setIsStateDropdownOpen(false);
                                  }}
                                >
                                  {state}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="form-group" style={{ width: 'calc(50% - 10px)' }}>
                      <label>PIN Code</label>
                      <input type="text" value={addressFormData.pincode} onChange={(e) => setAddressFormData({ ...addressFormData, pincode: e.target.value })} required placeholder="PIN Code" />
                    </div>
                    <div className="address-form-actions">
                      <button type="button" className="btn-cancel" onClick={() => setShowAddressForm(false)}>Cancel</button>
                      <button type="submit" className="btn-save">Save Address</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="address-list">
                  {addresses.length > 0 ? (
                    <>
                      {addresses.map(addr => (
                        <div key={addr.id} className="address-card">
                          <div className="address-card-header">
                            <h4>{addr.full_name}</h4>
                            <span className="address-phone">{addr.phone}</span>
                          </div>
                          <p className="address-text">{addr.address}</p>
                          <p className="address-city">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button className="btn-edit-address" onClick={() => handleEditAddress(addr)}>
                              Edit
                            </button>
                            <button className="btn-delete-address" onClick={() => setAddressToDelete(addr.id)}>
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                        <button className="btn-add-address" onClick={() => {
                          setAddressFormData({ id: null, full_name: '', phone: '', address: '', city: '', state: '', pincode: '', latitude: '11.0168', longitude: '76.9558', is_default: false });
                          setShowAddressForm(true);
                        }}>
                          <Plus size={18} /> Add Another Address
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="empty-orders">
                      <MapPin size={40} className="empty-icon" />
                      <p>You haven't saved any addresses yet.</p>
                      <button className="btn-shop-now" onClick={() => setShowAddressForm(true)}>Add Address</button>
                    </div>
                  )}
                </div>
              )}

              {addressToDelete && (
                <div className="delete-modal-overlay">
                  <div className="delete-modal">
                    <h3>Delete Address</h3>
                    <p>Are you sure you want to delete this address? This action cannot be undone.</p>
                    <div className="delete-modal-actions">
                      <button className="btn-cancel" onClick={() => setAddressToDelete(null)}>Cancel</button>
                      <button className="btn-confirm-delete" onClick={confirmDeleteAddress}>Yes, Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="profile-recent-orders" style={{ marginTop: 0 }}>
              <div className="profile-content-header">
                <h1>My Orders</h1>
                <p>View and track your recent orders.</p>
              </div>

              {loadingOrders ? (
                <div className="empty-orders">
                  <p>Loading your orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((order, idx) => {
                    let firstImageUrl = null;
                    let itemName = "Multiple items";
                    let itemSummary = "";

                    if (order.items && order.items.length > 0) {
                      const firstItem = order.items[0];
                      const baseName = firstItem.product_name || firstItem.product || "Unknown Item";
                      const matchedProduct = products.find(p => p.name === baseName);

                      itemName = language === 'ta' && matchedProduct && matchedProduct.tamil_name ? matchedProduct.tamil_name : baseName;

                      firstImageUrl = (firstItem.image && !firstItem.image.includes('default.jpg') && firstItem.image !== '')
                        ? firstItem.image
                        : matchedProduct?.image || firstItem.image;

                      if (order.items.length > 1) {
                        itemSummary = `+${order.items.length - 1} more items`;
                      }
                    }

                    return (
                      <div key={idx} className="order-card">
                        <div className="order-card-header">
                          <div className="order-card-title-group">
                            <div className="order-card-image">
                              {firstImageUrl ? (
                                <img src={firstImageUrl} alt={itemName} />
                              ) : (
                                <div className="placeholder-img"><ImageIcon size={20} /></div>
                              )}
                            </div>
                            <div>
                              <h3>Order</h3>
                              <p className="order-date">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`order-status ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="order-items-summary">
                            <span className="primary-item-name">{itemName}</span>
                            {itemSummary && <span className="extra-items-count">{itemSummary}</span>}
                          </div>
                        )}

                        <div className="order-card-footer">
                          <div className="order-total">
                            Total: <strong>₹{parseFloat(order.total_amount).toFixed(2)}</strong>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {order.status && order.status.toLowerCase() !== 'cancelled' && order.status.toLowerCase() !== 'returned' && (
                              <button
                                className="btn-cancel-order"
                                onClick={() => handleCancelOrder(order.order_id)}
                              >
                                Cancel Order
                              </button>
                            )}
                            <button
                                className="btn-track-order"
                                onClick={() => navigate(`/track/${order.id || order.order_id}`)}
                            >
                              Track Order
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-orders">
                  <Package size={40} className="empty-icon" />
                  <p>You haven't placed any orders yet.</p>
                  <button className="btn-shop-now" onClick={() => navigate('/shop')}>Start Shopping</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="profile-wishlist" style={{ marginTop: 0 }}>
              <div className="profile-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h1>MY WISHLIST</h1>
                  <p>{wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved</p>
                </div>
                {wishlist.length > 0 && (
                  <button 
                    className="btn-add-all-to-cart" 
                    onClick={handleAddAllToCart}
                    disabled={addingAllToCart}
                  >
                    <ShoppingCart size={18} />
                    {addingAllToCart ? 'Adding...' : 'Add All to Cart'}
                  </button>
                )}
              </div>

              {addAllMessage && (
                <div className={`address-message ${addAllMessage.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{addAllMessage.text}</span>
                  {addAllMessage.type === 'success' && (
                    <button 
                      onClick={() => navigate('/profile', { state: { activeTab: 'cart' } })} // Though cart is generally a drawer, navigate might open cart or redirect. Let's redirect to /shop or open cart. Wait, cart is opened by addToCart or navbar.
                      style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                      onClickCapture={(e) => {
                         e.preventDefault();
                         // The site uses a cart drawer controlled by context, we should tell user to click cart icon or reload
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                         // Also clear message
                         setTimeout(() => setAddAllMessage(null), 3000);
                      }}
                    >
                      View Cart
                    </button>
                  )}
                </div>
              )}

              {wishlist.length > 0 ? (
                <div className="wishlist-list-container">
                  {wishlist.map((item) => {
                    const pId = item.product || item.product_id || item.id;
                    const matchedProduct = products.find(p => String(p.id) === String(pId)) || {};
                    const itemImage = matchedProduct.image || item.product_image || item.image;
                    const itemName = matchedProduct.name || item.product_name || item.name;
                    const itemTamilName = matchedProduct.tamil_name || item.tamil_name;

                    let itemPrice = matchedProduct.price || item.price || '₹0';
                    if (item.customer_price) {
                      itemPrice = `₹${parseFloat(item.customer_price).toFixed(0)}`;
                    }

                    const itemIdToUse = matchedProduct.id || pId;

                    return (
                      <div key={item.id || itemIdToUse} className="wishlist-row">
                        <div className="wishlist-row-img-wrapper">
                          {itemImage ? (
                            <img src={itemImage} alt={itemName} className="wishlist-row-img" />
                          ) : (
                            <div className="wishlist-row-img placeholder">
                              <ImageIcon size={30} color="#cbd5e1" />
                            </div>
                          )}
                        </div>
                        <div className="wishlist-row-content">
                          <div className="wishlist-row-details">
                            <h4>{language === 'ta' && itemTamilName ? itemTamilName : itemName}</h4>
                            <p>{itemPrice}</p>
                          </div>
                          <div className="wishlist-row-actions">
                            <button
                              className="btn-add-all-to-cart"
                              onClick={() => {
                                addToCart(matchedProduct.id ? matchedProduct : item);
                              }}
                            >
                              <ShoppingCart size={16} />
                              {t('addToCart')}
                            </button>
                            <button
                              className="btn-wishlist-row-remove"
                              onClick={() => removeFromWishlist(itemIdToUse)}
                              title="Remove from wishlist"
                            >
                              <Heart size={16} color="#ef4444" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-orders">
                  <Heart size={40} className="empty-icon" />
                  <p>Your wishlist is currently empty.</p>
                  <button className="btn-shop-now" onClick={() => navigate('/shop')}>Explore Products</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <UsageCalendar orders={orders} />
          )}
        </div>

      </div>
    </div>
  );
}
