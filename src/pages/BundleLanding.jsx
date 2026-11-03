import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check, Sparkles, Clock, ShieldCheck, Tag, Heart, Share2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { showAppToast } from '../components/GlobalToast';
import SeoHead from '../components/SeoHead';
import { getStoredBundles, calculateBundlePricing, isBundleActive } from '../services/bundleService';
import { formatProductDisplayName, formatCurrency } from '../utils/productFormatters';
import './BundleLanding.css';

export default function BundleLanding() {
  const { bundleId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addBundleToCart } = useCart();
  const { language } = useLanguage();

  const [copiedLink, setCopiedLink] = useState(false);
  const [bundles] = useState(() => getStoredBundles());

  // Capture UTM parameters for analytics / ad attribution
  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');
  const utmContent = searchParams.get('utm_content');

  // Find targeted bundle
  const rawBundle = useMemo(() => {
    return (bundles || []).find(b => b.id === bundleId || b.slug === bundleId) || bundles[0];
  }, [bundles, bundleId]);

  // Enrich with dynamic pricing
  const bundle = useMemo(() => {
    if (!rawBundle) return null;
    const pricing = calculateBundlePricing(rawBundle.items, products, rawBundle.offerPrice);
    return {
      ...rawBundle,
      regularTotal: pricing.regularTotal,
      offerPrice: pricing.offerPrice,
      savings: pricing.savings,
      discountPercent: pricing.discountPercent,
      enrichedItems: pricing.items
    };
  }, [rawBundle, products]);

  const active = useMemo(() => isBundleActive(rawBundle), [rawBundle]);

  useEffect(() => {
    if (utmSource || utmCampaign) {
      // Store ad campaign attribution in sessionStorage for order tracking
      try {
        sessionStorage.setItem('dharani_ad_attribution', JSON.stringify({
          source: utmSource,
          medium: utmMedium,
          campaign: utmCampaign,
          content: utmContent,
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        // ignore
      }
    }

    // Safely fire standard ViewContent event if Meta Pixel / Google Analytics is installed on site
    if (bundle) {
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
          content_name: bundle.name,
          content_ids: [bundle.id || bundle.slug],
          content_type: 'product_group',
          value: bundle.offerPrice,
          currency: 'INR'
        });
      }
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'view_item', {
          items: [{ item_id: bundle.id || bundle.slug, item_name: bundle.name, price: bundle.offerPrice }]
        });
      }
    }
  }, [utmSource, utmMedium, utmCampaign, utmContent, bundle?.id]);

  if (!bundle) {
    return (
      <div className="bundle-landing-page">
        <div className="bundle-not-found">
          <AlertCircle size={48} color="#ef4444" />
          <h2>Bundle Not Found</h2>
          <p>The requested promotional bundle is unavailable or has ended.</p>
          <Link to="/shop" className="btn-return-shop">Browse All Products</Link>
        </div>
      </div>
    );
  }

  const campaign = bundle.campaign || {};
  const heroTitle = campaign.title || bundle.name;
  const promoText = campaign.promoText || bundle.description;
  const ctaLabel = campaign.ctaLabel || 'Claim This Combo Offer';

  const handleAddToCart = () => {
    addBundleToCart(bundle, 1);
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'AddToCart', {
        content_name: bundle.name,
        content_ids: [bundle.id || bundle.slug],
        content_type: 'product_group',
        value: bundle.offerPrice,
        currency: 'INR'
      });
    }
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'add_to_cart', {
        items: [{ item_id: bundle.id || bundle.slug, item_name: bundle.name, price: bundle.offerPrice }]
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showAppToast('Campaign URL copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const bundleSeo = useMemo(() => {
    if (!bundle) return null;
    const cleanBundleName = formatProductDisplayName(bundle.name);
    const title = `${cleanBundleName} - ${formatCurrency(bundle.offerPrice)} Special Combo | Dharani Herbals`;
    const description = `Get the ${cleanBundleName} for ${formatCurrency(bundle.offerPrice)} (Save ${formatCurrency(bundle.savings)}). Includes ${bundle.enrichedItems?.map(i => `${i.quantity}x ${formatProductDisplayName(i.name)}`).join(', ')}. 100% authentic Siddha formulation.`;
    const canonicalUrl = `https://www.dharaniherbbals.in/combo/${bundle.id || bundle.slug}`;
    const primaryImg = bundle.image || (bundle.enrichedItems && bundle.enrichedItems[0]?.image) || 'https://www.dharaniherbbals.in/logo.png';

    return {
      title,
      description,
      canonicalUrl,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        image: primaryImg,
        type: 'product',
        priceAmount: String(bundle.offerPrice),
        priceCurrency: 'INR'
      },
      keywords: ['herbal combo', 'ayurvedic bundle', bundle.name.toLowerCase(), 'dharani herbals offer']
    };
  }, [bundle]);

  return (
    <div className="bundle-landing-page">
      {bundleSeo && <SeoHead {...bundleSeo} />}
      <div className="bundle-landing-container">
        
        {/* Top Back Nav & Share */}
        <div className="bundle-nav-bar">
          <button onClick={() => navigate(-1)} className="bundle-back-btn">
            <ArrowLeft size={18} /> Back
          </button>

          <button onClick={handleShare} className="bundle-share-btn">
            <Share2 size={16} />
            <span>{copiedLink ? 'Link Copied!' : 'Share Offer'}</span>
          </button>
        </div>

        {/* Inactive / Expired Banner */}
        {!active && (
          <div className="bundle-inactive-alert">
            <AlertCircle size={18} />
            <span>This promotional offer is currently inactive or scheduled for a different date.</span>
          </div>
        )}

        {/* Ad Campaign Header Banner */}
        <div className="bundle-campaign-banner">
          <div className="bundle-campaign-badge">
            <Sparkles size={14} />
            <span>{bundle.badge || 'PROMOTIONAL OFFER'}</span>
            {bundle.discountPercent > 0 && <span>• {bundle.discountPercent}% OFF</span>}
          </div>

          <h1 className="bundle-campaign-headline">{heroTitle}</h1>
          <p className="bundle-campaign-subtext">{promoText}</p>

          {bundle.endDate && (
            <div className="bundle-validity-countdown">
              <Clock size={14} />
              <span>Offer Valid Through: <strong>{bundle.endDate}</strong></span>
            </div>
          )}
        </div>

        {/* Main Grid: Visuals & Purchase Panel */}
        <div className="bundle-grid-layout">
          
          {/* Left Column: Bundled Products Detailed Breakdown */}
          <div className="bundle-showcase-column">
            <div className="bundle-products-card">
              <h2 className="bundle-products-heading">
                What's Inside This Combo ({bundle.enrichedItems?.length || 0} Full-Size Products)
              </h2>
              <p className="bundle-products-subheading">
                Each product is formulated with pure botanical extracts, herbs, and oils following traditional Siddha principles.
              </p>

              <div className="bundle-items-detailed-list">
                {bundle.enrichedItems?.map((item, idx) => (
                  <div key={idx} className="bundle-detailed-item">
                    <div className="bundle-item-avatar-wrap">
                      <img
                        src={item.image || '/logo.png'}
                        alt={item.name}
                        onError={(e) => { e.target.src = '/logo.png'; }}
                      />
                      <span className="bundle-item-seq-badge">#{idx + 1}</span>
                    </div>

                    <div className="bundle-item-text-info">
                      <div className="bundle-item-header-row">
                        <h3 className="bundle-item-name">{formatProductDisplayName(item.name)}</h3>
                        <span className="bundle-item-mrp">{formatCurrency(item.unitPrice)} each</span>
                      </div>
                      {item.tamil_name && item.tamil_name !== item.name && (
                        <p className="bundle-item-tamil">{formatProductDisplayName(item.tamil_name)}</p>
                      )}
                      <p className="bundle-item-qty-tag">Quantity in pack: <strong>{item.quantity} Unit(s)</strong></p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formula Equation Visual */}
              <div className="bundle-formula-visual">
                <div className="formula-label">Bundle Synergy Formula:</div>
                <div className="formula-chips">
                  {bundle.enrichedItems?.map((it, i) => (
                    <span key={i} className="formula-chip">
                      {it.quantity}x {formatProductDisplayName(it.name)}
                      {i < bundle.enrichedItems.length - 1 && <span className="formula-plus">+</span>}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Pricing, Value proposition & Checkout CTA */}
          <div className="bundle-checkout-column">
            <div className="bundle-sticky-box">
              <div className="bundle-pricing-hero-card">
                
                <div className="bundle-card-header">
                  <span className="card-mini-title">SPECIAL COMBO PRICE</span>
                  {bundle.discountPercent > 0 && (
                    <span className="card-badge-save">{bundle.discountPercent}% SAVINGS</span>
                  )}
                </div>

                <div className="bundle-price-display">
                  <span className="bundle-price-now">{formatCurrency(bundle.offerPrice)}</span>
                  {bundle.regularTotal > bundle.offerPrice && (
                    <span className="bundle-price-was">{formatCurrency(bundle.regularTotal)}</span>
                  )}
                </div>

                {bundle.savings > 0 && (
                  <div className="bundle-savings-highlight">
                    <Check size={16} />
                    <span>Total Net Savings: <strong>{formatCurrency(bundle.savings)}</strong></span>
                  </div>
                )}

                <div className="bundle-meta-perks">
                  <div className="perk-item">
                    <Check size={15} color="#16a34a" />
                    <span>Free Shipping on orders above ₹500</span>
                  </div>
                  <div className="perk-item">
                    <Check size={15} color="#16a34a" />
                    <span>Direct Factory Fresh Dispatch</span>
                  </div>
                  <div className="perk-item">
                    <Check size={15} color="#16a34a" />
                    <span>100% Authentic Siddha & Ayurvedic herbs</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-bundle-order"
                  onClick={handleAddToCart}
                  disabled={!active}
                >
                  <ShoppingBag size={20} />
                  <span>{ctaLabel}</span>
                </button>

                <div className="bundle-security-guarantee">
                  <ShieldCheck size={18} color="#059669" />
                  <div>
                    <strong>Secure Checkout Guarantee</strong>
                    <p>UPI, Credit/Debit Cards, Net Banking & Cash on Delivery accepted</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
