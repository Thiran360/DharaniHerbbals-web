import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, Package, Heart, LogOut, ChevronRight, Image as ImageIcon, MapPin, Plus, Trash2, ChevronDown, Calendar } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuthModal } from '../context/AuthModalContext';
import UsageCalendar from '../components/UsageCalendar';
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
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    id: null, full_name: '', phone: '', address: '', city: '', state: '', pincode: '', latitude: '11.0168', longitude: '76.9558', is_default: false
  });
  const { products, refreshProducts } = useProducts();
  const { addToCart, refreshCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { language } = useLanguage();
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

          fetch(`https://api.codingboss.in/herbal/orders/?user_id=${actualUser.id}&role=${roleParam}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          })
            .then(res => res.json())
            .then(async (data) => {
              let fetchedOrders = [];
              if (Array.isArray(data)) {
                fetchedOrders = data;
              } else if (data && Array.isArray(data.results)) {
                fetchedOrders = data.results;
              } else if (data && Array.isArray(data.value)) {
                fetchedOrders = data.value;
              }

              // Fetch addresses for this user
              fetch(`https://api.codingboss.in/herbal/address/${actualUser.id}/`, {
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
                      const trackRes = await fetch(`https://api.codingboss.in/herbal/tracking/${trackingIdToUse}/`, {
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
      // If no user found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

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

    try {
      const response = await fetch(`https://api.codingboss.in/herbal/customers/${actualUser.id}/`, {
        method: 'PUT',
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

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!userData) return;
    const actualUser = userData.user || userData;
    const payload = { ...addressFormData, user_id: actualUser.id };
    if (addressFormData.id) {
      payload.address_id = addressFormData.id;
    }

    try {
      let url = 'https://api.codingboss.in/herbal/address/';
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
        const addrRes = await fetch(`https://api.codingboss.in/herbal/address/${actualUser.id}/`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
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
      const res = await fetch(`https://api.codingboss.in/herbal/address/${id}/`, {
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
      const res = await fetch('https://api.codingboss.in/herbal/paytm/refund/', {
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

        {/* Left Column: Profile Card & Nav */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-name">{name}</h2>
          </div>

          <div className="profile-nav">
            <button
              className={`profile-nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <User size={18} />
              <span>Account Details</span>
              <ChevronRight size={16} className="chevron" />
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={18} />
              <span>My Orders</span>
              <ChevronRight size={16} className="chevron" />
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={18} />
              <span>My Addresses</span>
              <ChevronRight size={16} className="chevron" />
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <Heart size={18} />
              <span>Wishlist</span>
              <ChevronRight size={16} className="chevron" />
            </button>
            <button
              className={`profile-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar size={18} />
              <span>Usage Calendar</span>
              <ChevronRight size={16} className="chevron" />
            </button>
            <button className="profile-nav-item logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
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
                    <label>Mobile Number (Cannot be changed)</label>
                    <input type="text" value={mobile} disabled />
                  </div>
                  <div className="address-form-actions">
                    <button type="button" className="btn-cancel" onClick={() => setIsEditingProfile(false)} disabled={profileUpdating}>Cancel</button>
                    <button type="submit" className="btn-save" disabled={profileUpdating}>{profileUpdating ? 'Saving...' : 'Save Profile'}</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="profile-info-grid">
                    <div className="profile-info-card">
                      <div className="info-icon">
                        <User size={20} />
                      </div>
                      <div className="info-details">
                        <label>Full Name</label>
                        <p>{name}</p>
                      </div>
                    </div>

                    <div className="profile-info-card">
                      <div className="info-icon">
                        <Mail size={20} />
                      </div>
                      <div className="info-details">
                        <label>Email Address</label>
                        <p>{email}</p>
                      </div>
                    </div>

                    <div className="profile-info-card">
                      <div className="info-icon">
                        <Phone size={20} />
                      </div>
                      <div className="info-details">
                        <label>Mobile Number</label>
                        <p>{mobile}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn-shop-now"
                    style={{ marginTop: '20px', width: 'auto' }}
                    onClick={() => {
                      setProfileFormData({
                        name: name !== 'Dharani Customer' ? name : '',
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
              <div className="profile-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1>My Addresses</h1>
                  <p>Manage your shipping addresses for quick checkout.</p>
                </div>
                {!showAddressForm && (
                  <button className="btn-add-address" onClick={() => {
                    setAddressFormData({ id: null, full_name: '', phone: '', address: '', city: '', state: '', pincode: '', latitude: '11.0168', longitude: '76.9558', is_default: false });
                    setShowAddressForm(true);
                  }}>
                    <Plus size={18} /> Add New Address
                  </button>
                )}
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
                    addresses.map(addr => (
                      <div key={addr.id} className="address-card">
                        <div className="address-card-header">
                          <h4>{addr.full_name}</h4>
                          <span className="address-phone">{addr.phone}</span>
                        </div>
                        <p className="address-text">{addr.address}</p>
                        <p className="address-city">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button className="btn-delete-address" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleEditAddress(addr)}>
                            Edit
                          </button>
                          <button className="btn-delete-address" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setAddressToDelete(addr.id)}>
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    ))
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
                                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}
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
              <div className="profile-content-header">
                <h1>Wishlist</h1>
                <p>Items you've saved for later.</p>
              </div>

              {wishlist.length > 0 ? (
                <div className="wishlist-grid">
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
                      <div key={item.id || itemIdToUse} className="wishlist-card">
                        {itemImage ? (
                          <img src={itemImage} alt={itemName} className="wishlist-card-img" />
                        ) : (
                          <div className="wishlist-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
                            <ImageIcon size={40} color="#cbd5e1" />
                          </div>
                        )}
                        <div className="wishlist-card-details">
                          <h4>{language === 'ta' && itemTamilName ? itemTamilName : itemName}</h4>
                          <p>{itemPrice}</p>
                        </div>
                        <div className="wishlist-card-actions">
                          <button
                            className="btn-wishlist-cart"
                            onClick={() => {
                              addToCart(matchedProduct.id ? matchedProduct : item);
                              removeFromWishlist(itemIdToUse);
                            }}
                          >
                            Add to Cart
                          </button>
                          <button
                            className="btn-wishlist-remove"
                            onClick={() => removeFromWishlist(itemIdToUse)}
                          >
                            Remove
                          </button>
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
