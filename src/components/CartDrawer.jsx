import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    cartTotal 
  } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`cart-backdrop ${isCartOpen ? 'open' : ''}`} 
        onClick={closeCart}
      />
      
      {/* Side Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={24} />
            <h2>Your Cart</h2>
            <span className="cart-count-badge">{cartItems.length}</span>
          </div>
          <button className="cart-close-btn" onClick={closeCart} aria-label="Close Cart">
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={48} className="cart-empty-icon" />
              <p>Your cart is empty.</p>
              <button className="btn-continue-shopping" onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="cart-item-list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-img-wrapper">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  </div>
                  
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{language === 'ta' && item.tamil_name ? item.tamil_name : item.name}</h3>
                    {item.variation_name && <p className="cart-item-variation" style={{ color: '#16a34a', fontSize: '0.85rem', marginBottom: '2px', fontWeight: '500' }}>{item.variation_name}</p>}
                    <p className="cart-item-price">{item.price}</p>
                    
                    <div className="cart-item-actions">
                      <div className="cart-qty-controls">
                        <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
                      </div>
                      
                      <button 
                        className="cart-remove-btn" 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="cart-total-price">₹{cartTotal}</span>
            </div>
            <p className="cart-taxes-note">Taxes and shipping calculated at checkout.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn-view-cart" 
                onClick={() => { closeCart(); navigate('/cart'); }}
              >
                View Full Cart
              </button>
              <button className="btn-checkout" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
