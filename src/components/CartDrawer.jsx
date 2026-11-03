import { useRef } from 'react';
import { X, Trash2, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatVariationLabel, formatProductPackSize, formatProductDisplayName, formatCurrency } from '../utils/productFormatters';
import { COMPANY_FACTS } from '../data/companyFacts';
import './CartDrawer.css';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    cartTotal,
    shippingCost
  } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const checkoutHandledRef = useRef(false);

  const freeThreshold = COMPANY_FACTS?.shipping?.freeShippingThreshold || 750;
  const isFreeShipping = shippingCost === 0;
  const remainingForFree = Math.max(0, freeThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.max(0, Math.round((cartTotal / freeThreshold) * 100)));

  const handleCheckout = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (checkoutHandledRef.current) return;
    checkoutHandledRef.current = true;
    setTimeout(() => { checkoutHandledRef.current = false; }, 800);
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
                    <img 
                      src={item.image || '/logo.png'} 
                      alt={item.name} 
                      className="cart-item-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.png';
                      }}
                    />
                  </div>
                  
                  <div className="cart-item-details">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <h3 className="cart-item-name" style={{ margin: 0 }}>{language === 'ta' && item.tamil_name ? formatProductDisplayName(item.tamil_name) : formatProductDisplayName(item.name)}</h3>
                      {item.isBundle && (
                        <span style={{
                          background: '#ecfdf5',
                          color: '#059669',
                          border: '1px solid #a7f3d0',
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          padding: '1px 6px',
                          borderRadius: '999px'
                        }}>
                          COMBO
                        </span>
                      )}
                    </div>
                    {item.variation_name ? (
                      <p className="cart-item-variation" style={{ color: '#16a34a', fontSize: '0.85rem', marginBottom: '2px', fontWeight: '500' }}>
                        {formatVariationLabel(item.variation_name, item)}
                      </p>
                    ) : (item.pack_size || formatProductPackSize(item)) ? (
                      <p className="cart-item-variation" style={{ color: '#16a34a', fontSize: '0.85rem', marginBottom: '2px', fontWeight: '500' }}>
                        {item.pack_size || formatProductPackSize(item)}
                      </p>
                    ) : null}
                    
                    {item.isBundle && item.bundleItems && (
                      <p style={{ margin: '3px 0', fontSize: '0.75rem', color: '#64748b', lineHeight: '1.2' }}>
                        {item.bundleItems.map(b => `${b.quantity}x ${formatProductDisplayName(b.name)}`).join(' + ')}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p className="cart-item-price" style={{ margin: 0 }}>{formatCurrency(item.price)}</p>
                      {item.isBundle && item.regularPrice > item.offerPrice && (
                        <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.8rem' }}>
                          {formatCurrency(item.regularPrice)}
                        </span>
                      )}
                    </div>
                    
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
            {/* Free Shipping Progress */}
            <div className="drawer-shipping-progress">
              <div className="drawer-shipping-header">
                <Truck size={15} style={{ color: '#16a34a' }} />
                <span>
                  {isFreeShipping 
                    ? "Congratulations! You've unlocked FREE shipping!" 
                    : `Add ${formatCurrency(remainingForFree)} more to unlock FREE shipping!`}
                </span>
              </div>
              <div className="drawer-shipping-bar-bg">
                <div 
                  className="drawer-shipping-bar-fill" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>

            <div className="drawer-shipping-rows">
              <div className="drawer-row">
                <span>Subtotal</span>
                <span>{formatCurrency(cartTotal, { showDecimals: true })}</span>
              </div>
              <div className="drawer-row">
                <span>Shipping</span>
                {shippingCost === 0 ? (
                  <span style={{ color: '#16a34a', fontWeight: '700' }}>FREE</span>
                ) : (
                  <span>{formatCurrency(shippingCost, { showDecimals: true })}</span>
                )}
              </div>
              <div className="drawer-row total">
                <span>Total</span>
                <span className="cart-total-price" style={{ fontSize: '1.4rem' }}>
                  {formatCurrency(cartTotal + (shippingCost || 0), { showDecimals: true })}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-view-cart"
                style={{ textDecoration: 'none', textAlign: 'center' }}
                onClick={() => {
                  closeCart();
                  navigate('/cart');
                }}
              >
                View Full Cart
              </button>
              <button
                type="button"
                className="btn-checkout"
                onClick={handleCheckout}
                onTouchEnd={handleCheckout}
                aria-label="Proceed to Checkout"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
