import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Minus, Plus, Truck, CheckCircle, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import SeoHead from '../components/SeoHead';
import { formatProductPackSize, formatVariationLabel, formatProductDisplayName, formatCurrency } from '../utils/productFormatters';
import { COMPANY_FACTS } from '../data/companyFacts';
import { checkDeliveryPincode, isValidIndianPin } from '../utils/deliveryChecker';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, shippingCost } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const freeThreshold = COMPANY_FACTS?.shipping?.freeShippingThreshold || 750;
  const isFreeShipping = shippingCost === 0;
  const remainingForFree = Math.max(0, freeThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.max(0, Math.round((cartTotal / freeThreshold) * 100)));

  const [pinCode, setPinCode] = useState(() => {
    try {
      return localStorage.getItem('dharani_delivery_pincode') || '';
    } catch {
      return '';
    }
  });
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    if (pinCode && pinCode.length === 6 && isValidIndianPin(pinCode)) {
      checkDeliveryPincode(pinCode).then(res => {
        if (res.success && res.deliverable) {
          setDeliveryInfo(res);
        }
      }).catch(() => {});
    }
  }, []);

  const handleVerifyPincode = async () => {
    const cleanPin = pinCode.trim();
    if (!cleanPin || cleanPin.length !== 6 || !isValidIndianPin(cleanPin)) {
      setPinError('Enter a valid 6-digit Indian PIN code');
      setDeliveryInfo(null);
      return;
    }
    setPinError('');
    setIsCheckingPin(true);
    try {
      const res = await checkDeliveryPincode(cleanPin);
      if (res.success && res.deliverable) {
        setDeliveryInfo(res);
        setPinError('');
        try { localStorage.setItem('dharani_delivery_pincode', cleanPin); } catch(e) {}
      } else {
        setPinError(res.message || 'PIN code not serviceable');
        setDeliveryInfo(null);
      }
    } catch {
      setPinError('Could not verify PIN code. Please try again.');
      setDeliveryInfo(null);
    } finally {
      setIsCheckingPin(false);
    }
  };

  const checkoutHandledRef = useRef(false);
  const handleCheckout = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (checkoutHandledRef.current) return;
    checkoutHandledRef.current = true;
    setTimeout(() => { checkoutHandledRef.current = false; }, 800);
    navigate('/checkout');
  };

  return (
    <div className="cart-page-wrapper">
      <SeoHead
        title="Your Shopping Cart | Dharani Herbals"
        description="Review your selected authentic South Indian herbal products, traditional shampoos, and oils in your shopping cart before checkout."
        canonicalUrl="https://www.dharaniherbbals.in/cart"
        openGraph={{
          title: "Your Shopping Cart | Dharani Herbals",
          description: "Review your selected authentic South Indian herbal products, traditional shampoos, and oils in your shopping cart before checkout.",
          url: "https://www.dharaniherbbals.in/cart",
          image: "https://www.dharaniherbbals.in/logo.png",
          type: "website"
        }}
      />
      <div className="cart-page-container">
        
        <div style={{ marginBottom: '24px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 500, marginBottom: '14px' }}>
            <ArrowLeft size={18} /> Continue Shopping
          </button>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Shopping Cart</h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <ShoppingBag size={64} style={{ color: '#94a3b8' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '8px' }}>Your cart is empty</h2>
            <p style={{ color: '#64748b', marginBottom: '32px' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderRadius: '50px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-page-content">
            {/* Left Column: Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <span>Product</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>
              
              <ul className="cart-items-list">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-page-item">
                    <div className="cart-item-product">
                      <div className="cart-img-box">
                        <img 
                          src={item.image || '/logo.png'} 
                          alt={item.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/logo.png';
                          }}
                        />
                      </div>
                      <div className="cart-item-info">
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>
                          {language === 'ta' && item.tamil_name ? formatProductDisplayName(item.tamil_name) : formatProductDisplayName(item.name)}
                        </h3>
                        {item.variation_name ? (
                          <p style={{ color: '#16a34a', fontSize: '0.85rem', margin: '4px 0 0', fontWeight: 500 }}>
                            {formatVariationLabel(item.variation_name, item)}
                          </p>
                        ) : (item.pack_size || formatProductPackSize(item)) ? (
                          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>
                            {item.pack_size || formatProductPackSize(item)}
                          </p>
                        ) : null}
                        <p style={{ margin: '6px 0 0', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    
                    <div className="cart-item-quantity">
                      <div className="cart-qty-spinner">
                        <button className="btn-minus" onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button className="btn-plus" onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">
                          <Plus size={16} />
                        </button>
                      </div>
                      <button className="btn-cart-remove" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="cart-item-total">
                      <span className="cart-item-total-price">
                        {formatCurrency(parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * item.quantity, { showDecimals: true })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-summary-section">
              {/* Free Shipping Progress Card */}
              <div className="cart-shipping-progress-card">
                <div className="cart-shipping-progress-header">
                  <Truck size={18} className="truck-icon" />
                  <span>
                    {isFreeShipping 
                      ? "Congratulations! You've unlocked FREE shipping!" 
                      : `Add ${formatCurrency(remainingForFree)} more to unlock FREE shipping!`}
                  </span>
                </div>
                <div className="cart-shipping-progress-bar-bg">
                  <div className="cart-shipping-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="cart-summary-card">
                <h3 className="summary-title">Order Summary</h3>

                {/* Pincode Delivery Estimator */}
                <div className="cart-pincode-box">
                  <div className="cart-pincode-header">
                    <Truck size={16} />
                    <span>Estimate Delivery Time</span>
                  </div>
                  <div className="cart-pincode-input-row">
                    <input
                      type="text"
                      className="cart-pincode-input"
                      placeholder="6-digit PIN"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => {
                        setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                        if (pinError) setPinError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleVerifyPincode();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="cart-pincode-btn"
                      onClick={handleVerifyPincode}
                      disabled={isCheckingPin || pinCode.length !== 6}
                    >
                      {isCheckingPin ? '...' : 'Check'}
                    </button>
                  </div>
                  {deliveryInfo && (
                    <p className="cart-pincode-result success">
                      ✓ Deliverable in <strong>{deliveryInfo.timeline}</strong>{deliveryInfo.location ? ` to ${deliveryInfo.location}` : ''}.
                    </p>
                  )}
                  {pinError && (
                    <p className="cart-pincode-result error">{pinError}</p>
                  )}
                </div>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-val">{formatCurrency(cartTotal, { showDecimals: true })}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>FREE</span>
                  ) : (
                    <span className="summary-val">{formatCurrency(shippingCost, { showDecimals: true })}</span>
                  )}
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-row">
                  <span>Estimated Total</span>
                  <span className="summary-total-val">
                    {formatCurrency(cartTotal + (shippingCost || 0), { showDecimals: true })}
                  </span>
                </div>
                
                <button
                  type="button"
                  className="btn-cart-checkout"
                  onClick={handleCheckout}
                  onTouchEnd={handleCheckout}
                  aria-label="Proceed to Checkout"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
                
                <div className="summary-secure-badges">
                  <p>🔒 100% Secure Checkout Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
