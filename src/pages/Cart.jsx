import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, taxTotal, shippingCost } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

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
                        <img src={item.image} alt={item.name} />
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
              <div className="cart-summary-card">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-val">₹{cartTotal}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="summary-val">₹{shippingCost.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax</span>
                  <span className="summary-val">₹{taxTotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-row">
                  <span>Estimated Total</span>
                  <span className="summary-total-val">₹{(cartTotal + shippingCost + taxTotal).toFixed(2)}</span>
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
