import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Minus, Plus, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useLanguage } from '../context/LanguageContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cgst, sgst, igst, taxTotal, shippingCost, grandTotal } = useCart();
  const { openLoginModal } = useAuthModal();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isUserLoggedIn = typeof window !== 'undefined' && localStorage.getItem('user') !== null;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page-wrapper">
      <div className="cart-page-container">
        
        <div className="cart-page-header">
          <button onClick={() => navigate(-1)} className="cart-back-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>
            <ArrowLeft size={18} /> Continue Shopping
          </button>
          <h1 className="cart-page-title">Shopping Cart</h1>
          <p className="cart-page-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-page-empty">
            <div className="empty-cart-icon-bg">
              <ShoppingBag size={64} className="empty-cart-icon" />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="btn-cart-primary">
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
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/logo.png';
                          }}
                        />
                      </div>
                      <div className="cart-item-info">
                        <h3>{language === 'ta' && item.tamil_name ? item.tamil_name : item.name}</h3>
                        {item.variation_name && <p className="cart-item-variation" style={{ color: '#16a34a', fontSize: '0.9rem', marginBottom: '4px' }}>{item.variation_name}</p>}
                        <p className="cart-item-price-unit">{item.price}</p>
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
                      <button 
                        className="btn-cart-remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>

                    <div className="cart-item-total">
                      <span className="cart-item-total-price">
                        ₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-summary-section">
              {!isUserLoggedIn && (
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '0.85rem' }}>
                    <Sparkles size={16} color="#16a34a" />
                    <span>Sign in to unlock exclusive offers</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openLoginModal()}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Sign In
                  </button>
                </div>
              )}
              <div className="cart-summary-card">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-val">₹{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="summary-val">
                    {shippingCost === 0 ? (
                      <span className="text-free" style={{ color: '#16a34a', fontWeight: '600' }}>Free</span>
                    ) : (
                      `₹${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="summary-row">
                  <span>CGST</span>
                  <span className="summary-val">₹{cgst.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>SGST</span>
                  <span className="summary-val">₹{sgst.toFixed(2)}</span>
                </div>

                {Number(igst) > 0 && (
                  <div className="summary-row">
                    <span>IGST</span>
                    <span className="summary-val">₹{Number(igst).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span>Tax Total</span>
                  <span className="summary-val">₹{taxTotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="summary-total-val" style={{ color: '#16a34a', fontWeight: '800' }}>₹{grandTotal.toFixed(2)}</span>
                </div>
                
                <button className="btn-cart-checkout" onClick={handleCheckout}>
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
                
                <div className="summary-secure-badges">
                  <p>🔒 Secure checkout guarantee</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
