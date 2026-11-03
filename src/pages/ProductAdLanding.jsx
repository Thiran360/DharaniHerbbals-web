import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ShieldCheck, 
  Leaf, 
  Truck, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Sparkles, 
  Star, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle,
  Award,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { showAppToast } from '../components/GlobalToast';
import SeoHead from '../components/SeoHead';
import { generateProductSeo } from '../utils/productSeo';
import { getProductDescription, getProductIngredients, getProductDirections } from '../data/productCatalogData';
import { formatProductPackSize, formatVariationLabel, formatProductDisplayName, formatCurrency } from '../utils/productFormatters';
import { getDefaultVariation } from '../data/productVariationsData';
import { getProductReviewsAndSummary } from '../utils/productReviews';
import { API_BASE_URL } from '../services/api';
import './ProductAdLanding.css';

export default function ProductAdLanding() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, loading: productsLoading } = useProducts();
  const { addToCart, cartItems } = useCart();
  const { language, t } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [crmGalleryImages, setCrmGalleryImages] = useState([]);
  const [fetchedVariations, setFetchedVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [crmKeyBenefits, setCrmKeyBenefits] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmittingBuyNow, setIsSubmittingBuyNow] = useState(false);

  // 1. Capture UTM Campaign Attribution
  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');
  const utmContent = searchParams.get('utm_content');
  const utmTerm = searchParams.get('utm_term');

  // Find targeted product dynamically from the catalog
  const product = useMemo(() => {
    if (!products || products.length === 0 || !productId) return null;
    return products.find(p => String(p.id) === String(productId));
  }, [products, productId]);

  // Persist UTM parameters to sessionStorage for order attribution
  useEffect(() => {
    if (utmSource || utmCampaign) {
      try {
        sessionStorage.setItem('dharani_ad_attribution', JSON.stringify({
          source: utmSource || '',
          medium: utmMedium || '',
          campaign: utmCampaign || '',
          content: utmContent || '',
          term: utmTerm || '',
          productId: productId || '',
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        // Safe fallback
      }
    }
  }, [utmSource, utmMedium, utmCampaign, utmContent, utmTerm, productId]);

  // 2. Fetch CRM variations, gallery images, key points, and verified reviews
  useEffect(() => {
    if (!productId) return;
    let isMounted = true;

    // Reset local states for this product
    setCurrentImgIndex(0);
    setQuantity(1);
    setCrmGalleryImages([]);
    setFetchedVariations([]);
    setSelectedVariation(null);
    setCrmKeyBenefits([]);
    setReviews([]);
    setReviewSummary(null);

    // Fetch CRM images
    fetch(`${API_BASE_URL}/product-images/${productId}/`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!isMounted || !data) return;
        let imagesArray = [];
        if (Array.isArray(data)) imagesArray = data;
        else if (data.data && Array.isArray(data.data)) imagesArray = data.data;
        else if (data.images && Array.isArray(data.images)) imagesArray = data.images;
        setCrmGalleryImages(imagesArray);
      })
      .catch(() => {});

    // Fetch CRM variations
    fetch(`${API_BASE_URL}/products/${productId}/variations/`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!isMounted || !data || !Array.isArray(data)) return;
        const formatted = data.map(v => {
          const activePrice = parseFloat(v.customer_price) || parseFloat(v.price) || parseFloat(v.sale_price) || parseFloat(v.mrp) || 0;
          const originalPrice = parseFloat(v.mrp) || parseFloat(v.original_price) || activePrice;
          let discount = '';
          if (originalPrice > activePrice) {
            discount = `${Math.round(((originalPrice - activePrice) / originalPrice) * 100)}% OFF`;
          }
          return {
            ...v,
            price: formatCurrency(activePrice),
            originalPrice: originalPrice > activePrice ? formatCurrency(originalPrice) : '',
            discount: discount
          };
        });
        setFetchedVariations(formatted);
        if (formatted.length > 0) {
          setSelectedVariation(prev => {
            if (prev) {
              const match = formatted.find(fv => String(fv.id || fv.variation_id) === String(prev.id || prev.variation_id));
              if (match) return match;
            }
            return getDefaultVariation(product, formatted) || formatted[0];
          });
        }
      })
      .catch(() => {});

    // Fetch CRM key benefits
    fetch(`${API_BASE_URL}/products/${productId}/key-points/`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!isMounted || !data) return;
        let points = [];
        if (Array.isArray(data)) points = data;
        else if (data.data && Array.isArray(data.data)) points = data.data;
        else if (data.key_points && Array.isArray(data.key_points)) points = data.key_points;

        const validPoints = points
          .map(p => typeof p === 'object' ? (p.point || p.text || p.title || p.benefit || p.name || null) : p)
          .filter(p => p !== null && p !== undefined && String(p).trim() !== '');

        setCrmKeyBenefits(validPoints);
      })
      .catch(() => {});

    // Fetch genuine reviews
    const pName = product ? product.name : '';
    getProductReviewsAndSummary(productId, pName).then(res => {
      if (!isMounted) return;
      if (res.reviews) setReviews(res.reviews);
      if (res.summary) setReviewSummary(res.summary);
    });

    return () => {
      isMounted = false;
    };
  }, [productId, product?.name]);

  // Fallback variation selector when CRM variations are empty
  useEffect(() => {
    if (fetchedVariations.length === 0) {
      if (product && product.variations && product.variations.length > 0) {
        setSelectedVariation(prev => {
          if (prev) {
            const match = product.variations.find(v => String(v.id || v.variation_id) === String(prev.id || prev.variation_id));
            if (match) return match;
          }
          return product.default_variation || getDefaultVariation(product, product.variations) || product.variations[0];
        });
      } else {
        setSelectedVariation(null);
      }
    }
  }, [product?.id, product?.variations, product?.default_variation, fetchedVariations.length]);

  // Safe analytics event on page view (ViewContent)
  useEffect(() => {
    if (product) {
      const numericPrice = parseFloat(String(selectedVariation?.price || product.price || '0').replace(/[^0-9.]/g, '')) || 0;
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
          content_name: product.name,
          content_ids: [String(product.id)],
          content_type: 'product',
          value: numericPrice,
          currency: 'INR'
        });
      }
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'view_item', {
          items: [{ item_id: String(product.id), item_name: product.name, price: numericPrice }]
        });
      }
    }
  }, [product?.id, selectedVariation?.price]);

  // Handle Loading State
  if (productsLoading) {
    return (
      <div className="ad-landing-loading">
        <div className="ad-loading-spinner" />
        <p>Loading authentic product details...</p>
      </div>
    );
  }

  // Handle Invalid / Non-existent Product ID
  if (!product) {
    return (
      <div className="ad-landing-notfound-page">
        <div className="ad-notfound-card">
          <AlertCircle size={48} className="ad-notfound-icon" />
          <h2>Product Not Found</h2>
          <p>
            We could not find a product matching ID #{productId}. The promotional link may have expired or is unavailable.
          </p>
          <Link to="/shop" className="ad-btn-return-shop">
            Explore All Authentic Herbal Products
          </Link>
        </div>
      </div>
    );
  }

  // 3. Data Processing & Real Price Calculation
  const productIngredients = getProductIngredients(product);
  const productDirections = getProductDirections(product);
  const verifiedDescription = getProductDescription(product) || product.description || '';

  // Calculate pricing & genuine discounts
  const activePriceStr = selectedVariation ? selectedVariation.price : product.price;
  const originalPriceStr = selectedVariation ? selectedVariation.originalPrice : product.originalPrice;

  const numericActivePrice = parseFloat(String(activePriceStr || '0').replace(/[^0-9.]/g, '')) || 0;
  const numericOriginalPrice = parseFloat(String(originalPriceStr || '0').replace(/[^0-9.]/g, '')) || 0;

  const hasGenuineOffer = numericOriginalPrice > numericActivePrice && numericActivePrice > 0;
  const savingsAmount = hasGenuineOffer ? (numericOriginalPrice - numericActivePrice) : 0;
  const savingsPercent = hasGenuineOffer ? Math.round((savingsAmount / numericOriginalPrice) * 100) : 0;

  // Pack size / weight label
  const packSizeLabel = selectedVariation 
    ? formatVariationLabel(selectedVariation, product)
    : (formatProductPackSize(product) || product.pack_size || '');

  // Media gallery items
  const mediaItems = [];
  if (product.image) {
    if (typeof product.image === 'string' && product.image.includes(',')) {
      product.image.split(',').forEach(img => {
        const trimmed = img.trim();
        if (trimmed) mediaItems.push({ src: trimmed });
      });
    } else {
      mediaItems.push({ src: product.image });
    }
  }
  if (crmGalleryImages.length > 0) {
    crmGalleryImages.forEach(imgObj => {
      if (imgObj.image && !mediaItems.some(m => m.src === imgObj.image)) {
        mediaItems.push({ src: imgObj.image });
      }
    });
  }
  if (mediaItems.length === 0) {
    mediaItems.push({ src: '/logo.png' });
  }

  const currentMedia = mediaItems[currentImgIndex] || mediaItems[0];

  // Ratings calculation strictly based on genuine reviews
  const totalReviews = (reviewSummary && typeof reviewSummary.total_reviews === 'number')
    ? reviewSummary.total_reviews
    : (Array.isArray(reviews) && reviews.length > 0
        ? reviews.length
        : (product.reviews && Number(product.reviews) > 0 ? Number(product.reviews) : 0));

  const rawAvg = (reviewSummary && reviewSummary.average_rating !== undefined && Number(reviewSummary.average_rating) > 0)
    ? Number(reviewSummary.average_rating)
    : (Array.isArray(reviews) && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length
        : (product.rating && Number(product.rating) > 0 ? Number(product.rating) : 0));

  const avgRating = (!isNaN(rawAvg) && rawAvg > 0) ? rawAvg : 0;
  const hasValidReviews = Boolean(totalReviews > 0 && avgRating > 0);

  // Available variations list
  const availableVariations = fetchedVariations.length > 0 ? fetchedVariations : (product.variations || []);

  // Product enriched with variations for accurate CartContext price matching
  const productWithVariations = {
    ...product,
    variations: availableVariations
  };

  // 4. Conversion Actions: Buy Now & Add to Cart
  const handleAddToCart = () => {
    const variationId = selectedVariation?.id || selectedVariation?.variation_id;
    addToCart(productWithVariations, quantity, variationId);

    // Safe event tracking
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_ids: [String(product.id)],
        content_type: 'product',
        value: numericActivePrice * quantity,
        currency: 'INR'
      });
    }
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'add_to_cart', {
        items: [{ item_id: String(product.id), item_name: product.name, price: numericActivePrice, quantity }]
      });
    }

    showAppToast(`Added ${quantity} × ${product.name} to cart`);
  };

  const handleBuyNow = async () => {
    if (isSubmittingBuyNow) return;
    setIsSubmittingBuyNow(true);

    try {
      const variationId = selectedVariation?.id || selectedVariation?.variation_id;
      // Add silently to cart to preserve existing cart items without drawer popup
      await addToCart(productWithVariations, quantity, variationId, true);

      // Safe event tracking for InitiateCheckout
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          content_name: product.name,
          content_ids: [String(product.id)],
          content_type: 'product',
          value: numericActivePrice * quantity,
          currency: 'INR'
        });
      }
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'begin_checkout', {
          items: [{ item_id: String(product.id), item_name: product.name, price: numericActivePrice, quantity }]
        });
      }

      // Seamless direct transition to checkout preserving campaign UTM parameters
      const searchSuffix = location.search ? location.search : '';
      navigate(`/checkout${searchSuffix}`);
    } catch (err) {
      console.error('Buy Now failed:', err);
      setIsSubmittingBuyNow(false);
      showAppToast('Could not proceed to checkout. Please try again.');
    }
  };

  // Copy campaign share link
  const handleShareCampaign = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        showAppToast('Promotion link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2500);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedLink(true);
        showAppToast('Promotion link copied!');
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      showAppToast('Unable to copy link.');
    }
  };

  // SEO metadata generation
  const productSeo = generateProductSeo(product, {
    language,
    selectedVariation,
    reviewSummary,
    verifiedReviews: reviews
  });

  // Calculate cart count for top bar
  const totalCartCount = (cartItems || []).reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Derived key points
  const displayBenefits = crmKeyBenefits.length > 0
    ? crmKeyBenefits
    : (productIngredients && productIngredients.length > 0
        ? [
            `Formulated with pure botanical extracts (${productIngredients.slice(0, 3).join(', ')})`,
            'Crafted following authentic traditional Siddha & Ayurvedic methods',
            '100% Free from synthetic parabens, harsh sulfates, and toxic fillers',
            'Safe, gentle, and designed for holistic everyday personal wellness'
          ]
        : [
            '100% Authentic herbal formulation directly prepared by Dharani Herbals',
            'Gentle on skin and hair with zero harmful chemicals',
            'Lab tested and quality inspected fresh batches',
            'Sustainably sourced traditional South Indian botanical ingredients'
          ]);

  return (
    <div className="ad-landing-page">
      {/* Dynamic SEO Metadata */}
      {productSeo && <SeoHead {...productSeo} />}

      {/* ─── Streamlined Conversion Header ─── */}
      <header className="ad-landing-header">
        <div className="ad-header-container">
          <Link to="/" className="ad-brand-identity" title="Dharani Herbals Official Store">
            <img 
              src="/logo_3d_bright.png" 
              alt="Dharani Herbals" 
              className="ad-brand-logo"
              onError={(e) => { e.target.src = '/logo.png'; }}
            />
            <div className="ad-brand-text">
              <span className="ad-brand-title">DHARANI HERBALS</span>
              <span className="ad-brand-tagline">100% Authentic Herbal Care</span>
            </div>
          </Link>

          <div className="ad-header-actions">
            <button 
              type="button" 
              onClick={handleShareCampaign} 
              className="ad-btn-share"
              title="Share Promotion"
            >
              <Share2 size={16} />
              <span className="ad-share-text">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <Link 
              to={`/cart${location.search || ''}`} 
              className="ad-header-cart-btn" 
              title="View Cart"
            >
              <ShoppingCart size={18} />
              {totalCartCount > 0 && <span className="ad-cart-badge">{totalCartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Main Hero Ad Creative ─── */}
      <main className="ad-main-content">
        <div className="ad-hero-container">
          
          {/* Left Column: Product Visual Showcase */}
          <div className="ad-gallery-column">
            <div className="ad-gallery-card">
              <div className="ad-main-image-wrap">
                <img
                  src={currentMedia.src}
                  alt={product.name}
                  className="ad-main-image"
                  onError={(e) => { e.target.src = '/logo.png'; }}
                />
                <div className="ad-botanical-tag">
                  <Leaf size={14} />
                  <span>100% Herbal</span>
                </div>
                {hasGenuineOffer && (
                  <div className="ad-savings-flag">
                    {savingsPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {mediaItems.length > 1 && (
                <div className="ad-thumbnails-strip">
                  {mediaItems.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`ad-thumbnail-btn ${idx === currentImgIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImgIndex(idx)}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img src={item.src} alt="" onError={(e) => { e.target.src = '/logo.png'; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Assurance Badges */}
            <div className="ad-assurance-grid">
              <div className="ad-assurance-card">
                <ShieldCheck size={20} className="text-emerald" />
                <div>
                  <h4>Pure Botanical</h4>
                  <p>No synthetic chemicals</p>
                </div>
              </div>
              <div className="ad-assurance-card">
                <Truck size={20} className="text-amber" />
                <div>
                  <h4>Express Dispatch</h4>
                  <p>Within 24-48 business hours</p>
                </div>
              </div>
              <div className="ad-assurance-card">
                <Award size={20} className="text-blue" />
                <div>
                  <h4>Direct Maker</h4>
                  <p>Authentic quality guarantee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Purchase Creative */}
          <div className="ad-purchase-column">
            <div className="ad-product-card">
              
              {/* Category & Badge */}
              <div className="ad-eyebrow-row">
                <span className="ad-category-badge">
                  {product.category_name || 'Traditional Herbal Care'}
                </span>
                {utmCampaign && (
                  <span className="ad-campaign-pill">
                    <Sparkles size={12} /> Special Ad Offer
                  </span>
                )}
              </div>

              {/* Product Headline */}
              <h1 className="ad-product-title">{formatProductDisplayName(product.name)}</h1>
              {language === 'ta' && product.tamil_name && (
                <p className="ad-product-tamil-title">{formatProductDisplayName(product.tamil_name)}</p>
              )}

              {/* Genuine Customer Ratings (Only when genuine data exists) */}
              {hasValidReviews && (
                <div className="ad-rating-row">
                  <div className="ad-stars-badge">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span className="ad-rating-score">{avgRating.toFixed(1)}</span>
                  </div>
                  <span className="ad-review-count">
                    Based on {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              )}

              {/* Pricing Box */}
              <div className="ad-pricing-panel">
                <div className="ad-price-display">
                  <span className="ad-active-price">{formatCurrency(activePriceStr)}</span>
                  {hasGenuineOffer && (
                    <span className="ad-mrp-strike">{formatCurrency(originalPriceStr)}</span>
                  )}
                  {packSizeLabel && (
                    <span className="ad-pack-label">({packSizeLabel})</span>
                  )}
                </div>

                {hasGenuineOffer && (
                  <div className="ad-savings-banner">
                    <CheckCircle size={14} />
                    <span>Real Savings: <strong>Save {formatCurrency(savingsAmount)} ({savingsPercent}% OFF)</strong></span>
                  </div>
                )}

                <p className="ad-tax-inclusive">Inclusive of all taxes • Fresh direct manufacturer batch</p>
              </div>

              {/* Pack Sizes / Variations Selector */}
              {availableVariations.length > 0 && (
                <div className="ad-variations-section">
                  <label className="ad-variations-label">Select Pack Size / Quantity:</label>
                  <div className="ad-variations-grid">
                    {availableVariations.map((v, idx) => {
                      const isSelected = selectedVariation === v || (selectedVariation?.id && selectedVariation.id === v.id);
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`ad-variation-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedVariation(v)}
                        >
                          <div className="ad-variation-radio">
                            {isSelected && <span className="ad-radio-dot" />}
                          </div>
                          <div className="ad-variation-info">
                            <span className="ad-variation-title">{formatVariationLabel(v, product)}</span>
                            <span className="ad-variation-price">{formatCurrency(v.price)}</span>
                          </div>
                          {v.originalPrice && v.discount && (
                            <span className="ad-variation-discount">{v.discount}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="ad-quantity-row">
                <span className="ad-quantity-label">Quantity:</span>
                <div className="ad-stepper">
                  <button 
                    type="button" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="ad-quantity-value">{quantity}</span>
                  <button 
                    type="button" 
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="ad-subtotal-hint">
                  Subtotal: {formatCurrency(numericActivePrice * quantity)}
                </span>
              </div>

              {/* CTAs: Direct Buy Now & Add To Cart */}
              <div className="ad-cta-buttons-wrapper">
                <button
                  type="button"
                  className="ad-btn-buy-now"
                  onClick={handleBuyNow}
                  disabled={isSubmittingBuyNow}
                >
                  <span className="ad-btn-icon-pulse">⚡</span>
                  <span>{isSubmittingBuyNow ? 'Securing Order...' : 'Buy Now — Direct Checkout'}</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="ad-btn-add-cart"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Trust Micro-Bullets */}
              <div className="ad-micro-trust">
                <span><Check size={14} color="#10b981" /> No forced login required</span>
                <span><Check size={14} color="#10b981" /> Secure encrypted payment</span>
                <span><Check size={14} color="#10b981" /> Genuine herbal formulation</span>
              </div>

            </div>
          </div>

        </div>

        {/* ─── Detailed Product Credentials & Content ─── */}
        <div className="ad-details-grid">
          
          {/* Key Product Benefits */}
          <section className="ad-section-box">
            <div className="ad-section-header">
              <Sparkles size={20} className="text-emerald" />
              <h2>Key Botanical Benefits</h2>
            </div>
            <div className="ad-benefits-list">
              {displayBenefits.map((point, idx) => (
                <div key={idx} className="ad-benefit-item">
                  <div className="ad-benefit-icon-wrap">
                    <CheckCircle size={18} />
                  </div>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Verified Ingredients Section */}
          <section className="ad-section-box">
            <div className="ad-section-header">
              <Leaf size={20} className="text-emerald" />
              <h2>Verified Botanical Ingredients</h2>
            </div>
            {productIngredients && productIngredients.length > 0 ? (
              <div className="ad-ingredients-pill-list">
                {productIngredients.map((item, idx) => (
                  <div key={idx} className="ad-ingredient-chip">
                    <Leaf size={14} className="text-emerald" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ad-empty-info-note">
                <HelpCircle size={18} />
                <span>Ingredients information not available for this specific catalog item.</span>
              </div>
            )}
            <p className="ad-ingredient-footnote">
              Pure botanical ingredients selected according to traditional heritage principles. Free from artificial fillers.
            </p>
          </section>

          {/* Directions for Use */}
          {productDirections && (
            <section className="ad-section-box">
              <div className="ad-section-header">
                <Clock size={20} className="text-amber" />
                <h2>Directions for Use</h2>
              </div>
              <div className="ad-directions-content">
                <p>{productDirections}</p>
              </div>
            </section>
          )}

          {/* Product Story & Description */}
          {verifiedDescription && (
            <section className="ad-section-box">
              <div className="ad-section-header">
                <Award size={20} className="text-blue" />
                <h2>About This Formulation</h2>
              </div>
              <div className="ad-description-text">
                {verifiedDescription.split(/\n\n+/).map((para, idx) => (
                  <p key={idx}>{para.trim()}</p>
                ))}
              </div>
            </section>
          )}

          {/* Verified Shipping & Policies */}
          <section className="ad-section-box ad-policy-box">
            <div className="ad-section-header">
              <Truck size={20} className="text-emerald" />
              <h2>Shipping & Order Delivery</h2>
            </div>
            <div className="ad-policy-timeline">
              <div className="ad-timeline-step">
                <span className="ad-step-number">1</span>
                <div>
                  <h4>Direct Order Processing</h4>
                  <p>Hand-packed and dispatched directly from our herbal manufacturing unit within 24–48 business hours.</p>
                </div>
              </div>
              <div className="ad-timeline-step">
                <span className="ad-step-number">2</span>
                <div>
                  <h4>Reliable Courier Delivery</h4>
                  <p>Standard delivery within 5–7 business days across India with active live shipment tracking.</p>
                </div>
              </div>
              <div className="ad-timeline-step">
                <span className="ad-step-number">3</span>
                <div>
                  <h4>100% Genuine Care</h4>
                  <p>Direct customer assistance available via phone and WhatsApp support for any order questions.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Genuine Reviews Section (Only if authentic reviews exist) */}
          {hasValidReviews && reviews.length > 0 && (
            <section className="ad-section-box ad-reviews-box">
              <div className="ad-section-header">
                <Star size={20} fill="#f59e0b" color="#f59e0b" />
                <h2>Verified Customer Experiences ({reviews.length})</h2>
              </div>
              <div className="ad-reviews-grid">
                {reviews.map((rev) => (
                  <div key={rev.id} className="ad-review-card">
                    <div className="ad-review-header">
                      <div className="ad-avatar" style={{ backgroundColor: rev.color || '#10b981' }}>
                        {rev.initial || rev.name.charAt(0)}
                      </div>
                      <div className="ad-reviewer-info">
                        <span className="ad-reviewer-name">{rev.name}</span>
                        <span className="ad-review-date">{rev.date}</span>
                      </div>
                      <div className="ad-review-stars">
                        {'★'.repeat(Math.round(rev.rating))}
                      </div>
                    </div>
                    <p className="ad-review-text">"{rev.text}"</p>
                    <span className="ad-verified-tag">
                      <CheckCircle size={12} /> Verified Buyer
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* ─── Mobile Sticky Bottom Purchase Bar ─── */}
      <div className="ad-mobile-sticky-bar">
        <div className="ad-sticky-container">
          <div className="ad-sticky-product-meta">
            <img 
              src={currentMedia.src} 
              alt="" 
              className="ad-sticky-thumb"
              onError={(e) => { e.target.src = '/logo.png'; }}
            />
            <div className="ad-sticky-pricing">
              <div className="ad-sticky-price-row">
                <span className="ad-sticky-active-price">{activePriceStr}</span>
                {hasGenuineOffer && (
                  <span className="ad-sticky-mrp">{originalPriceStr}</span>
                )}
              </div>
              <span className="ad-sticky-pack-name">
                {packSizeLabel ? packSizeLabel : 'Qty: ' + quantity}
              </span>
            </div>
          </div>

          <div className="ad-sticky-actions">
            <button
              type="button"
              className="ad-sticky-buy-btn"
              onClick={handleBuyNow}
              disabled={isSubmittingBuyNow}
            >
              <span>{isSubmittingBuyNow ? 'Processing...' : 'Buy Now'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Minimal Ad Footer ─── */}
      <footer className="ad-landing-footer">
        <p>© {new Date().getFullYear()} Dharani Herbals. All Rights Reserved. Traditional botanical formulations.</p>
        <div className="ad-footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="separator">•</span>
          <Link to="/terms">Terms & Conditions</Link>
          <span className="separator">•</span>
          <Link to="/contact">Support</Link>
          <span className="separator">•</span>
          <Link to="/shop">View Full Catalog</Link>
        </div>
      </footer>
    </div>
  );
}
