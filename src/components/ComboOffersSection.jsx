import { useState, useEffect, useMemo, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sparkles, Check, ArrowRight, Clock, Plus, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { getStoredBundles, calculateBundlePricing, isBundleActive } from '../services/bundleService';
import { formatCurrency, formatProductDisplayName } from '../utils/productFormatters';
import './ComboOffersSection.css';

export default function ComboOffersSection() {
  const [bundles, setBundles] = useState(() => getStoredBundles());
  const { products } = useProducts();
  const { addBundleToCart } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Listen for admin changes
  useEffect(() => {
    const handleUpdate = () => {
      setBundles(getStoredBundles());
    };
    window.addEventListener('dharani-bundles-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('dharani-bundles-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Filter only active bundles whose scheduled dates are valid today
  const activeBundles = useMemo(() => {
    return (bundles || [])
      .filter(bundle => isBundleActive(bundle))
      .map(bundle => {
        const pricing = calculateBundlePricing(bundle.items, products, bundle.offerPrice);
        return {
          ...bundle,
          regularTotal: pricing.regularTotal,
          offerPrice: pricing.offerPrice,
          savings: pricing.savings,
          discountPercent: pricing.discountPercent,
          enrichedItems: pricing.items
        };
      });
  }, [bundles, products]);

  if (activeBundles.length === 0) {
    return null; // Don't render section if no active bundles currently
  }

  const handleAddBundle = (bundle) => {
    addBundleToCart(bundle, 1);
  };

  return (
    <section className="combo-offers-section">
      <div className="combo-offers-container">
        
        {/* Section Header */}
        <div className="combo-section-header">
          <div className="combo-header-pill">
            <Sparkles size={14} className="combo-sparkle-icon" />
            <span>{language === 'ta' ? 'சிறப்பு சலுகைகள்' : 'Curated Value Packs'}</span>
          </div>
          <h2 className="combo-section-title">
            {language === 'ta' ? 'மூலிகை காம்போ & சேமிப்பு பேக்குகள்' : 'Herbal Bundles & Combo Offers'}
          </h2>
          <p className="combo-section-subtitle">
            {language === 'ta'
              ? 'முழுமையான இயற்கை கூந்தல் & சரும பராமரிப்புக்கு இணைக்கப்பட்ட சிறந்த தயாரிப்புகள், கூடுதல் சேமிப்புடன்!'
              : 'Complete botanical wellness regimens bundled together with exclusive savings. Verified 100% natural Siddha formulations.'}
          </p>
        </div>

        {/* Combos Grid / Showcase */}
        <div className="combo-cards-grid">
          {activeBundles.map((bundle) => {
            const savingsAmount = bundle.savings > 0 ? bundle.savings : 0;
            const discountPct = bundle.discountPercent > 0 ? bundle.discountPercent : 0;

            return (
              <div key={bundle.id} className="combo-card-hero">
                {/* Top Badge Strip */}
                <div className="combo-card-top-strip">
                  <div className="combo-badge-tag">
                    <Tag size={13} />
                    <span>{bundle.badge || 'BEST VALUE'}</span>
                  </div>
                  {discountPct > 0 && (
                    <span className="combo-discount-tag">
                      {discountPct}% OFF
                    </span>
                  )}
                  {bundle.endDate && (
                    <div className="combo-expiry-chip">
                      <Clock size={12} />
                      <span>Valid till {bundle.endDate}</span>
                    </div>
                  )}
                </div>

                {/* Main Card Content */}
                <div className="combo-card-content">
                  
                  {/* Left Column: Visual Product Formula & Value Highlight */}
                  <div className="combo-left-col">
                    <div className="combo-visual-formula">
                      <div className="combo-formula-header">
                        <span className="combo-formula-label">
                          {language === 'ta' ? 'இணைக்கப்பட்டுள்ள பொருட்கள்' : 'Products in this Bundle'}
                        </span>
                        <span className="combo-items-count-badge">
                          {bundle.enrichedItems.length} {language === 'ta' ? 'பொருட்கள்' : 'Items'}
                        </span>
                      </div>

                      <div className="combo-items-row">
                        {bundle.enrichedItems.map((item, idx) => (
                          <Fragment key={idx}>
                            <div className="combo-product-node">
                              <div className="combo-item-thumb-box">
                                <img
                                  src={item.image || '/logo.png'}
                                  alt={item.name}
                                  loading="lazy"
                                  onError={(e) => { e.target.src = '/logo.png'; }}
                                />
                                <span className="combo-item-qty-badge">
                                  {item.quantity}x
                                </span>
                              </div>
                              <span className="combo-item-node-name" title={formatProductDisplayName(item.name)}>
                                {formatProductDisplayName(language === 'ta' && item.tamil_name ? item.tamil_name : item.name)}
                              </span>
                              <span className="combo-item-node-price">{formatCurrency(item.unitPrice)}</span>
                            </div>

                            {idx < bundle.enrichedItems.length - 1 && (
                              <div className="combo-plus-divider" aria-hidden="true">
                                <Plus size={14} strokeWidth={2.5} />
                              </div>
                            )}
                          </Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Value Highlight Box to fill left column and balance layout */}
                    <div className="combo-value-highlight">
                      <div className="combo-value-row">
                        <span className="value-label">{language === 'ta' ? 'தனித்தனி மொத்த விலை:' : 'Individual Items Value:'}</span>
                        <span className="value-original">{formatCurrency(bundle.regularTotal)}</span>
                      </div>
                      <div className="combo-value-row highlight">
                        <span className="value-label">{language === 'ta' ? 'காம்போ சிறப்பு விலை:' : 'Combo Offer Price:'}</span>
                        <span className="value-offer">{formatCurrency(bundle.offerPrice)}</span>
                      </div>
                      {savingsAmount > 0 && (
                        <div className="combo-value-savings">
                          <Check size={14} />
                          <span>{language === 'ta' ? `ரூ.${savingsAmount} உடனடி சேமிப்பு (${discountPct}% தள்ளுபடி)` : `Instant Savings of ${formatCurrency(savingsAmount)} (${discountPct}% OFF)`}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Details, Pricing & Action */}
                  <div className="combo-details-pane">
                    {bundle.tagline && (
                      <div className="combo-tagline-eyebrow">
                        <Sparkles size={13} />
                        <span>{bundle.tagline}</span>
                      </div>
                    )}

                    <h3 className="combo-title">
                      {language === 'ta' && bundle.tamil_name ? bundle.tamil_name : bundle.name}
                    </h3>
                    
                    <p className="combo-description">{bundle.description}</p>

                    {/* Included Products Pills */}
                    <div className="combo-included-pills">
                      <span className="included-label">{language === 'ta' ? 'அடங்கியவை:' : 'Included in this routine:'}</span>
                      <div className="pills-wrap">
                        {bundle.enrichedItems.map((it, i) => (
                          <span key={i} className="included-pill">
                            <Check size={12} className="pill-check" />
                            <strong>{it.quantity}x</strong> {formatProductDisplayName(it.name)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & CTA Block */}
                    <div className="combo-cta-block">
                      <div className="combo-prices-row">
                        <div className="combo-price-main">
                          <span className="combo-amount">{formatCurrency(bundle.offerPrice)}</span>
                        </div>
                        {bundle.regularTotal > bundle.offerPrice && (
                          <div className="combo-price-regular">
                            <span className="combo-regular-label">{language === 'ta' ? 'வழக்கமான விலை:' : 'Combined MRP:'}</span>
                            <span className="combo-strike-amount">{formatCurrency(bundle.regularTotal)}</span>
                          </div>
                        )}
                        {savingsAmount > 0 && (
                          <span className="combo-save-badge">
                            Save {formatCurrency(savingsAmount)}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="combo-action-buttons">
                        <button
                          type="button"
                          className="btn-add-combo"
                          onClick={() => handleAddBundle(bundle)}
                          aria-label={`Add ${bundle.name} to cart`}
                        >
                          <ShoppingBag size={18} />
                          <span>{language === 'ta' ? 'கார்ட்டில் சேர்க்க' : 'Add Bundle to Cart'}</span>
                        </button>

                        <button
                          type="button"
                          className="btn-view-combo-details"
                          onClick={() => navigate(`/combo/${bundle.id || bundle.slug}`)}
                          aria-label="View combo details"
                        >
                          <span>{language === 'ta' ? 'முழு விபரம்' : 'View Details'}</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>

                      <div className="combo-assurance">
                        <ShieldCheck size={14} className="assurance-icon" />
                        <span>{language === 'ta' ? '100% தூய சித்த தயாரிப்புகள் • விரைவான டெலிவரி' : '100% Authentic Siddha Formulations • Fast Dispatch across India'}</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
