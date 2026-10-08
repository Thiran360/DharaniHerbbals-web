import { X, Trash2, ShoppingBag, Sparkles, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useAuthModal } from '../context/AuthModalContext';
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
  const { products } = useProducts();
  const { openLoginModal } = useAuthModal();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isUserLoggedIn = typeof window !== 'undefined' && localStorage.getItem('user') !== null;

  // Filter recommendations: avoid items already in cart
  const recommendedProducts = products
    .filter((p) => !cartItems.some((item) => item.id === p.id))
    .slice(0, 5);

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

        {!isUserLoggedIn && cartItems.length > 0 && (
          <div style={{
            margin: '10px 16px 0',
            padding: '10px 14px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534' }}>
              <Sparkles size={15} color="#16a34a" />
              <span>Sign in to unlock exclusive offers</span>
            </div>
            <button
              type="button"
              onClick={() => { closeCart(); openLoginModal(); }}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap'
              }}
            >
              Sign In
            </button>
          </div>
        )}

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
                    <img
                      src={item.image || '/logo.png'}
                      alt={item.name}
                      className="cart-item-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.png';
                      }}
                    />
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

          {/* Cart Recommendations */}
          {cartItems.length > 0 && recommendedProducts.length > 0 && (
            <div className="cart-recommendations">
              <h4 className="cart-rec-title">You May Also Like</h4>
              <div className="cart-rec-slider">
                {recommendedProducts.map((p) => (
                  <div key={p.id} className="cart-rec-card" onClick={() => { closeCart(); navigate(`/product/${p.id}`); }}>
                    <div className="cart-rec-img-wrap">
                      <img src={p.image || '/logo.png'} alt={p.name} />
                    </div>
                    <div className="cart-rec-info">
                      <p className="cart-rec-name">{language === 'ta' && p.tamil_name ? p.tamil_name : p.name}</p>
                      <p className="cart-rec-price">{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="cart-total-price">₹{Number(cartTotal).toFixed(2)}</span>
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
