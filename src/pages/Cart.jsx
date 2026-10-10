import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductsContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, taxTotal, shippingCost, addToCart } = useCart();
  const { language, t } = useLanguage();
  const { products } = useProducts();
  
  const recommendedProducts = (products || [])
    .filter(p => !cartItems.some(ci => ci.id === p.id))
    .slice(0, 3);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page-wrapper">
      <div className="cart-page-container">
        
        <div className="cart-page-header">
          <button onClick={() => navigate(-1)} className="cart-back-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>
            <ArrowLeft size={18} /> {t('continueShopping')}
          </button>
          <h1 className="cart-page-title">{t('shoppingCart')}</h1>
          <p className="cart-page-subtitle">
            {cartItems.length} {cartItems.length === 1 ? (language === 'ta' ? 'பொருள்' : 'item') : (language === 'ta' ? 'பொருட்கள்' : 'items')} {t('itemsInYourCart')}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-page-empty">
            <div className="empty-cart-icon-bg">
              <ShoppingBag size={64} className="empty-cart-icon" />
            </div>
            <h2>{t('emptyCart')}</h2>
            <p>{t('cartEmptyMsg')}</p>
            <Link to="/shop" className="btn-cart-primary">
              {t('continueShopping')}
            </Link>
          </div>
        ) : (
          <div className="cart-page-content">
            {/* Left Column: Cart Items */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <span>{t('products')}</span>
                <span>{t('quantity')}</span>
                <span>{t('subtotal')}</span>
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

              {/* Price Transparency Strip */}
              <div className="cart-trust-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#f0fdf4', padding: '16px', borderRadius: '12px', marginTop: '24px', border: '1px solid #dcfce7' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                  <div style={{ background: '#dcfce7', color: '#16a34a', padding: '8px', borderRadius: '50%' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#166534' }}>{t('priceTransparency')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                  <div style={{ background: '#dcfce7', color: '#16a34a', padding: '8px', borderRadius: '50%' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#166534' }}>{t('clearPriceBreakdown')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                  <div style={{ background: '#dcfce7', color: '#16a34a', padding: '8px', borderRadius: '50%' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#166534' }}>{t('noHiddenCharges')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                  <div style={{ background: '#dcfce7', color: '#16a34a', padding: '8px', borderRadius: '50%' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#166534' }}>{t('sameTotalAtCheckout')}</span>
                </div>
              </div>

              {/* Recommendations Section */}
              {recommendedProducts.length > 0 && (
                <div className="cart-recommendations">
                  <h3 className="recommendations-title">{t('relatedProducts')}</h3>
                  <div className="recommendations-grid">
                    {recommendedProducts.map(product => (
                      <div key={product.id} className="rec-card">
                        <div className="rec-img-box">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="rec-info">
                          <h4>{language === 'ta' && product.tamil_name ? product.tamil_name : product.name}</h4>
                          <p className="rec-price">₹{product.customer_price || product.mrp || product.price}</p>
                          <button className="btn-rec-add" onClick={() => addToCart(product, 1)}>
                            <Plus size={14} /> {language === 'ta' ? 'சேர்' : 'Add'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-summary-section">
              <div className="cart-summary-card">
                <h3 className="summary-title">{t('orderSummary')}</h3>
                
                <div className="summary-row">
                  <span>{t('subtotal')}</span>
                  <span className="summary-val">₹{cartTotal}</span>
                </div>
                
                <div className="summary-row">
                  <span>{t('shipping')}</span>
                  <span className="summary-val">₹{shippingCost.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>{t('applicableGst')}</span>
                  <span className="summary-val">₹{taxTotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total-row">
                  <span>{t('totalPayable')}</span>
                  <span className="summary-total-val" style={{ color: '#16a34a', fontWeight: 'bold' }}>₹{(cartTotal + shippingCost + taxTotal).toFixed(2)}</span>
                </div>
                
                <button className="btn-cart-checkout" onClick={handleCheckout}>
                  {t('proceedToCheckout')} <ArrowRight size={18} />
                </button>
                
                <div className="summary-secure-badges">
                  <p>🔒 {t('secureCheckout')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
