import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from './Shop';
import { ShoppingCart, ShieldCheck, Leaf, Truck, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Share2, MessageCircle, Camera, Copy, Check, Package, Plus, Star, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import imgLifestyle from '../assets/herbal_lifestyle.png';
import imgIngredients from '../assets/herbal_ingredients.png';
import imgTexture from '../assets/herbal_texture.png';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../services/api';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRefs = useRef([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);


  useEffect(() => {
    const fetchReviewsAndSummary = async () => {
      if (!id) return;
      try {
        const [revRes, sumRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products/${id}/reviews/`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          }),
          fetch(`${API_BASE_URL}/products/${id}/review-summary/`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          })
        ]);

        if (revRes.ok) {
          const data = await revRes.json();
          if (data && data.reviews) {
            const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
            const mapped = data.reviews.map((r, i) => ({
              id: r.id || Date.now() + i,
              name: r.user_name || r.customer_name || `Customer ${r.user_id || ''}`.trim(),
              date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently',
              rating: r.rating || 5,
              text: r.review_text || r.text || '',
              initial: (r.user_name || r.customer_name || 'C').charAt(0).toUpperCase(),
              color: colors[i % colors.length]
            }));
            setReviews(mapped);
          }
        }

        if (sumRes.ok) {
          const sumData = await sumRes.json();
          setReviewSummary(sumData);
        }
      } catch (err) {
        console.error("Failed to fetch product reviews or summary", err);
      }
    };
    fetchReviewsAndSummary();
  }, [id]);

  const handleReviewSubmit = () => {
    if (!reviewText.trim()) return;
    const newReview = {
      id: Date.now(),
      name: 'You',
      date: 'Just now',
      rating: reviewRating,
      text: reviewText,
      initial: 'Y',
      color: '#10b981'
    };
    setReviews([newReview, ...reviews]);
    setReviewText('');
    setReviewRating(5);
    setCurrentSlide(0);
  };

  // Auto-scroll logic for the slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isPaused = false;
    let animationId;

    const handleMouseEnter = () => isPaused = true;
    const handleMouseLeave = () => isPaused = false;

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('touchstart', handleMouseEnter, { passive: true });
    slider.addEventListener('touchend', handleMouseLeave);

    const scroll = () => {
      if (!isPaused) {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft += 0.5; // Decreased Speed adjustment
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
      if (slider) {
        slider.removeEventListener('mouseenter', handleMouseEnter);
        slider.removeEventListener('mouseleave', handleMouseLeave);
        slider.removeEventListener('touchstart', handleMouseEnter);
        slider.removeEventListener('touchend', handleMouseLeave);
      }
    };
  }, [reviews]);

  const { language, translateText, translateProduct, bulkProductNames, t } = useLanguage();

  const product = products.find(p => p.id === parseInt(id));

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (thumbRefs.current && thumbRefs.current[currentImgIndex]) {
      thumbRefs.current[currentImgIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentImgIndex]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [crmGalleryImages, setCrmGalleryImages] = useState([]);
  const [fetchedVariations, setFetchedVariations] = useState([]);
  const [fetchedKeyBenefits, setFetchedKeyBenefits] = useState([]);
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [pinCode, setPinCode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [benefitsExpanded, setBenefitsExpanded] = useState(true);
  const [ingredientsExpanded, setIngredientsExpanded] = useState(true);
  const [ingredientsTab, setIngredientsTab] = useState('key');
  const { addToCart } = useCart();

  const defaultDesc = "Experience the incredible benefits of our completely natural, 100% organic herbal formulation. Carefully crafted using traditional methods and sustainably sourced ingredients to ensure the highest quality for your holistic wellness journey. Free from harmful chemicals, parabens, and artificial preservatives.";

  // Translation states
  const [translatedName, setTranslatedName] = useState(product ? product.name : '');
  const [translatedSubtitle, setTranslatedSubtitle] = useState(product ? product.subtitle : '');
  const [translatedDesc, setTranslatedDesc] = useState(product ? (product.description || defaultDesc) : '');

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImgIndex(0);
    setQuantity(1);
    setActiveTab('description');
    let active = true;

    if (id) {
      // Fetch CRM product images for Product Gallery section
      fetch(`${API_BASE_URL}/product-images/${id}/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => {
          if (!res.ok) {
            // Silently ignore 404s as it just means no extra images exist
            if (res.status === 404) return null;
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (active && data) {
            // Check if the response itself is an array, or if it's wrapped in data/success
            let imagesArray = [];
            if (Array.isArray(data)) {
              imagesArray = data;
            } else if (data.data && Array.isArray(data.data)) {
              imagesArray = data.data;
            } else if (data.images && Array.isArray(data.images)) {
              imagesArray = data.images;
            }

            setCrmGalleryImages(imagesArray);
          }
        })
        .catch(err => {
          if (active) console.warn("Failed to fetch CRM product images:", err.message);
        });

      // Fetch CRM product key benefits
      fetch(`${API_BASE_URL}/products/${id}/key-points/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => {
          if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (active && data) {
            // Check if it's an array of strings, or array of objects, or object with data array
            let points = [];
            if (Array.isArray(data)) {
              points = data;
            } else if (data.data && Array.isArray(data.data)) {
              points = data.data;
            } else if (data.key_points && Array.isArray(data.key_points)) {
              points = data.key_points;
            }
            // Map objects to strings if needed. Do not fallback to JSON.stringify if all fields are null.
            points = points.map(p => typeof p === 'object' ? (p.point || p.text || p.title || p.benefit || p.name || null) : p);

            // Filter out null or empty strings
            const validPoints = points.filter(p => p !== null && p !== undefined && p !== '');
            setFetchedKeyBenefits(validPoints);
          }
        })
        .catch(err => {
          if (active) console.warn("Failed to fetch CRM product key benefits:", err.message);
        });

      // Fetch CRM product variations
      fetch(`${API_BASE_URL}/products/${id}/variations/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => {
          if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (active && data && Array.isArray(data)) {
            const formattedVariations = data.map(v => {
              // Check if the user is a store member
              let isStoreMember = false;
              try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                  const userData = JSON.parse(storedUser);
                  isStoreMember = userData.is_store_login ||
                    userData.user?.role === 'staff' ||
                    userData.is_store_member ||
                    userData.role === 'store' ||
                    userData.role === 'store_member' ||
                    userData.user_type === 'store' ||
                    userData.user?.role === 'store' ||
                    userData.user?.role === 'store_member' ||
                    userData.user?.user_type === 'store' ||
                    userData.user?.is_store_member ||
                    userData.is_store;
                }
              } catch (e) { }

              let activePrice = 0;
              let originalPrice = 0;

              if (isStoreMember) {
                activePrice = parseFloat(v.store_price) || parseFloat(v.customer_price) || parseFloat(v.price) || parseFloat(v.sale_price) || parseFloat(v.mrp) || 0;
                originalPrice = parseFloat(v.mrp) || parseFloat(v.original_price) || activePrice;
              } else {
                activePrice = parseFloat(v.customer_price) || parseFloat(v.price) || parseFloat(v.sale_price) || parseFloat(v.mrp) || 0;
                originalPrice = parseFloat(v.mrp) || parseFloat(v.original_price) || activePrice;
              }

              let discount = '';
              if (originalPrice > activePrice) {
                discount = `${Math.round(((originalPrice - activePrice) / originalPrice) * 100)}% OFF`;
              }
              return {
                ...v,
                price: `₹${activePrice.toFixed(0)}`,
                originalPrice: originalPrice > activePrice ? `₹${originalPrice.toFixed(0)}` : '',
                discount: discount
              };
            });
            setFetchedVariations(formattedVariations);
            if (formattedVariations.length > 0) {
              setSelectedVariation(formattedVariations[0]);
            }
          }
        })
        .catch(err => {
          if (active) console.warn("Failed to fetch CRM product variations:", err.message);
        });
    }

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (fetchedVariations.length === 0) {
      if (product && product.variations && product.variations.length > 0) {
        setSelectedVariation(product.variations[0]);
      } else {
        setSelectedVariation(null);
      }
    }
  }, [product?.id, product?.variations, fetchedVariations.length]);

  const translatedRef = useRef(null); // tracks "productId:lang" already translated
  const shareMenuRef = useRef(null);

  useEffect(() => {
    if (!product) return;

    const key = `${product.id}:${language}`;
    // Skip if we already ran translation for this exact product+language combo
    if (translatedRef.current === key) return;
    translatedRef.current = key;

    let active = true;

    // Direct assignment for product name
    setTranslatedName(language === 'ta' && product.tamil_name ? product.tamil_name : product.name);

    setTranslatedSubtitle(product.subtitle);
    setTranslatedDesc(product.description || defaultDesc);

    if (language === 'ta') {
      // 2. Subtitle (single call, not per-card)
      if (product.subtitle) {
        translateText(product.subtitle).then(res => {
          if (active && res) setTranslatedSubtitle(res);
        });
      }

      // 3. Description (single call)
      const descText = product.description || defaultDesc;
      translateText(descText).then(res => {
        if (active && res) setTranslatedDesc(res);
      });
    }

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, product?.id, bulkProductNames]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return <div className="pd-pro-wrapper"><div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div></div>;
  }

  if (!product) {
    return (
      <div className="pd-pro-wrapper empty">
        <h2>Product not found!</h2>
        <Link to="/shop" className="btn-pro-primary mt-4" style={{ width: 'auto', textDecoration: 'none', padding: '16px 32px' }}>Return to Shop</Link>
      </div>
    );
  }

  const mediaItems = [];

  if (product.image) {
    mediaItems.push({ type: 'image', src: product.image, thumb: product.image });
  }

  if (crmGalleryImages.length > 0) {
    mediaItems.push(...crmGalleryImages.map(imgObj => ({ type: 'image', src: imgObj.image, thumb: imgObj.image })));
  }

  const currentMedia = mediaItems[currentImgIndex];
  const getProductShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return `https://www.vedanmart.com/product/${product.id}`;
  };

  const getShareText = () => {
    return `*${translatedName}* | Vedan Mart\nwww.vedanmart.com\n\nShop now on Vedan Mart!\n${getProductShareUrl()}`;
  };

  const copyShareLink = async () => {
    const shareUrl = getProductShareUrl();
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1800);
  };

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const shareToInstagram = async () => {
    await copyShareLink();
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const shareNative = async () => {
    const shareUrl = getProductShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: translatedName,
          text: translatedSubtitle || translatedName,
          url: shareUrl
        });
      } catch {
        // User cancelled the native share sheet.
      }
    } else {
      await copyShareLink();
    }
    setShowShareMenu(false);
  };

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (diff > threshold) {
      // Swiped left -> Next image
      const nextIdx = (currentImgIndex + 1) % mediaItems.length;
      setCurrentImgIndex(nextIdx);
    } else if (diff < -threshold) {
      // Swiped right -> Previous image
      const nextIdx = (currentImgIndex - 1 + mediaItems.length) % mediaItems.length;
      setCurrentImgIndex(nextIdx);
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const isFirstSlide = currentImgIndex === 0;
  const isLastSlide = currentImgIndex === mediaItems.length - 1;

  const handlePrevSlide = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isFirstSlide) return;
    setCurrentImgIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isLastSlide) return;
    setCurrentImgIndex((prev) => Math.min(mediaItems.length - 1, prev + 1));
  };

  return (
    <div className="pd-pro-wrapper">
      {/* Breadcrumbs */}
      <div className="pd-breadcrumbs">
        <Link to="/">{t('home')}</Link>
        <span className="separator">/</span>
        <span className="current">{translatedName}</span>
      </div>

      <div className="pd-pro-container">
        {/* Left Column: Gallery (Professional Layout) */}
        <div className="pd-pro-gallery">

          {/* Main Media Container */}
          <div 
            className="pd-pro-main-image-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {mediaItems.length > 1 && (
              <>
                <button
                  type="button"
                  className={`pd-gallery-arrow pd-gallery-arrow-prev ${isFirstSlide ? 'disabled' : ''}`}
                  onClick={handlePrevSlide}
                  disabled={isFirstSlide}
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className={`pd-gallery-arrow pd-gallery-arrow-next ${isLastSlide ? 'disabled' : ''}`}
                  onClick={handleNextSlide}
                  disabled={isLastSlide}
                  aria-label="Next Image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <div
              className="pd-pro-image-track"
              ref={trackRef}
            >
              {mediaItems.map((media, idx) => (
                <div 
                  key={idx} 
                  className={`pd-pro-main-image-wrapper ${currentImgIndex === idx ? 'active' : ''}`}
                >
                  {media.type === '3d' ? (
                    <model-viewer
                      src={media.src}
                      alt={translatedName}
                      auto-rotate
                      camera-controls
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#f9fafb', borderRadius: '4px' }}
                    ></model-viewer>
                  ) : (
                    <img
                      src={media.src || '/logo.png'}
                      alt={`${translatedName} - Image ${idx + 1}`}
                      className="pd-pro-main-image"
                      fetchPriority={idx === 0 ? "high" : "auto"}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (e.target.src !== window.location.origin + '/logo.png') {
                          e.target.src = '/logo.png';
                          e.target.style.objectFit = 'contain';
                          e.target.style.padding = '2rem';
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {product.badge && currentMedia && currentMedia.type !== '3d' && (
              <div className={`pro-badge badge-${product.badgeColor}`}>
                {product.badge}
              </div>
            )}

            <div className="pd-pro-image-share">
              <button
                type="button"
                className="pd-image-share-trigger"
                onClick={shareToWhatsApp}
                aria-label="Share on WhatsApp"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Horizontal Thumbnails - ONLY SHOW IF CRM IMAGES EXIST */}
          {crmGalleryImages.length > 0 && (
            <div className="pd-pro-thumbnails-horizontal">
              {mediaItems.map((media, idx) => (
                <div
                  key={idx}
                  ref={(el) => (thumbRefs.current[idx] = el)}
                  className={`pd-pro-thumb ${currentImgIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentImgIndex(idx)}
                >
                  <img
                    src={media.thumb}
                    alt={`Gallery ${idx + 1}`}
                    onError={(e) => {
                      if (!e.target.dataset.retried) {
                        e.target.dataset.retried = 'true';
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information */}
        <div className="pd-pro-info">
          <h1 className="pd-pro-title">{translatedName}</h1>

          <div className="pd-pro-rating">
            <div className="pro-stars">
              <span className="star">★</span>
              <span className="score">{product.rating}</span>
            </div>
            <span className="reviews-link">{product.reviews} Reviews</span>
          </div>

          <div className="pd-pro-price-block">
            <span className="pro-current-price">{selectedVariation ? selectedVariation.price : product.price}</span>
            {product.weight_volume && !selectedVariation && (
              <span style={{ fontSize: '1.2rem', color: '#6b7280', marginLeft: '10px', fontWeight: '500' }}>
                ({String(product.weight_volume).includes('.') ? parseFloat(product.weight_volume) * 1000 : product.weight_volume} {product.unit && product.unit.toUpperCase() === 'GM' ? 'g' : (product.unit ? product.unit.toLowerCase() : '')})
              </span>
            )}
            <p className="tax-inclusive">{t('taxInclusive')}</p>
          </div>

          {fetchedVariations && fetchedVariations.length > 0 && (
            <div className="pd-premium-variations-wrapper">
              <h4 className="variations-title">{product.variationLabel || 'Weight / Size'}</h4>
              <div className="premium-variations-grid">
                {fetchedVariations.map((v, idx) => (
                  <div
                    key={idx}
                    className={`premium-variation-card ${selectedVariation === v ? 'active' : ''}`}
                    onClick={() => setSelectedVariation(v)}
                  >
                    {selectedVariation === v && (
                      <div className="premium-variation-check">
                        <CheckCircle size={16} weight="fill" />
                      </div>
                    )}
                    <span className="premium-variation-name">{v.name || v.variation_name || v.weight || 'Variant'}</span>
                    <span className="premium-variation-price">{v.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pd-pro-divider"></div>

          {/* Add to Cart Actions */}
          <div className="pd-premium-actions-wrapper">
            <div className="premium-qty-selector">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="text" value={quantity} readOnly />
              <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button type="button" className="premium-add-btn" onClick={() => addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id)}>
              <ShoppingCart size={20} strokeWidth={2.5} />
              <span>{t('addToCart')}</span>
            </button>
          </div>

          {/* Ultra-Modern Bento Section */}
          <div className="pd-bento-grid">
            {/* Bento Box 1: Description */}
            <div className="pd-bento-cell bento-desc">
              <div className="pd-bento-header">
                <FileText size={18} className="pd-bento-icon text-indigo" />
                <h3>{t('descriptionLabel')}</h3>
              </div>
              <p className="pd-bento-text">
                {translatedDesc}
              </p>
            </div>

            {/* Bento Box 2: Trust Badges (Compact) */}
            <div className="pd-bento-cell bento-trust">
              <div className="bento-trust-item">
                <Leaf size={16} className="text-emerald" />
                <span>{t('naturalTag')}</span>
              </div>
              <div className="bento-trust-item">
                <ShieldCheck size={16} className="text-blue" />
                <span>{t('labTested')}</span>
              </div>
              <div className="bento-trust-item">
                <Truck size={16} className="text-amber" />
                <span>{t('freeDelivery')}</span>
              </div>
            </div>

            {/* Bento Box 3: Quick Benefits */}
            <div className="pd-bento-cell bento-benefits">
              <div className="pd-bento-header">
                <Star size={18} className="pd-bento-icon text-pink" />
                <h3>Key Benefits</h3>
              </div>
              <div className="bento-tags-wrapper">
                {(() => {
                  if (fetchedKeyBenefits && fetchedKeyBenefits.length > 0) {
                    return fetchedKeyBenefits.map((benefit, index) => (
                      <span key={index} className="bento-tag">
                        <CheckCircle size={12} weight="fill" />
                        {benefit}
                      </span>
                    ));
                  }

                  const name = (product.name || '').toLowerCase();
                  const category = (product.category_name || '').toLowerCase();
                  const idHash = product.id ? product.id : (product.name ? product.name.length : 1);

                  let pool = [];

                  if (name.includes('black tea')) {
                    pool = [
                      "Refreshing Daily Brew", "Natural Antioxidant Support", "Boosts Focus & Alertness", "Smooth Energy Lift"
                    ];
                  } else if (name.includes('jaggery')) {
                    pool = [
                      "Natural Sweetener", "Rich in Minerals", "Made from Pure Sugarcane", "Better Than Refined Sugar"
                    ];
                  } else if (name.includes('rose gel') || name.includes('rose')) {
                    pool = [
                      "Rose-Infused Hydration", "Oil-Free Freshness", "Soothes Sensitive Skin", "Helps Reduce Blackheads"
                    ];
                  } else if (name.includes('green gram')) {
                    pool = [
                      "Gentle Skin Exfoliation", "Unclogs Pores", "Brightens Skin", "Natural Face Pack Base"
                    ];
                  } else if (name.includes('herbal tea')) {
                    pool = [
                      "Immune Shield", "Respiratory Care", "Throat Comfort", "Liver Wellness"
                    ];
                  } else if (name.includes('ginger') && name.includes('coffee')) {
                    pool = [
                      "Herbal Cold Relief ( Seasonal Wellness )", "Natural Body Warmth", "Respiratory Comfort", "Digestive Support"
                    ];
                  } else if (name.includes('aavaram')) {
                    pool = [
                      "Inner Body Cooling", "Radiant Skin Support", "Natural Body Cleanse", "Herbal Rejuvenation"
                    ];
                  } else if (name.includes('guava')) {
                    pool = [
                      "Polyphenol-Rich Goodness", "Supports Glucose Balance", "Heart-Friendly Botanicals", "Metabolic Balance Support"
                    ];
                  } else if (name.includes('coconut') || name.includes('soap')) {
                    pool = [
                      "Deeply Moisturizes Skin", "Gently Cleanses Without Drying",
                      "Leaves Skin Soft & Smooth", "Suitable for Daily Use"
                    ];
                  } else if (name.includes('karisalankanni') || name.includes('karisalankanni shampoo')) {
                    pool = [
                      "Supports Natural Hair Darkening", "Root-to-Tip Nourishment", "Herbal Scalp Rejuvenation", "Botanical Hair Revival"
                    ];
                  } else if (name.includes('hair') || category.includes('hair') || name.includes('shampoo') || name.includes('oil')) {
                    pool = [
                      "Strengthens Roots", "Reduces Hair Fall", "Adds Natural Shine", "Improves Scalp Health",
                      "Controls Dandruff", "Repairs Split Ends", "Nourishes Hair Follicles", "Promotes Hair Growth",
                      "Adds Volume", "Prevents Greying", "Softens Hair Texture", "Detangles Frizz"
                    ];
                  } else if (name.includes('face') || name.includes('skin') || name.includes('glow') || category.includes('skin') || name.includes('maavu') || name.includes('gel')) {
                    pool = [
                      "Brightens Skin Tone", "Clears Blemishes", "Deep Hydration", "Anti-aging Properties",
                      "Reduces Pigmentation", "Tightens Pores", "Soothes Sunburns", "Calms Irritated Skin",
                      "Removes Tan", "Fights Acne", "Improves Skin Texture", "Provides Radiant Glow", "Exfoliates Dead Cells"
                    ];
                  } else {
                    pool = [
                      "Boosts Immunity", "Improves Digestion", "Rich in Iron", "Increases Energy",
                      "Enhances Stamina", "Purifies Blood", "Supports Bone Health", "Improves Metabolism",
                      "Rich in Antioxidants", "Relieves Stress", "Promotes Overall Wellness", "100% Natural Ingredients"
                    ];
                  }

                  let benefits = [];
                  if (pool.length <= 4) {
                    benefits = [...pool];
                  } else {
                    const maxStartIndex = Math.max(1, pool.length - 4);
                    const startIndex = idHash % maxStartIndex;
                    const step = (idHash % 3) + 1;

                    for (let i = 0; i < 4; i++) {
                      benefits.push(pool[(startIndex + (i * step)) % pool.length]);
                    }
                  }

                  return benefits.map((benefit, index) => (
                    <span key={index} className="bento-tag">
                      <CheckCircle size={12} weight="fill" />
                      {benefit}
                    </span>
                  ));
                })()}
              </div>
            </div>

            {/* Bento Box 4: Delivery */}
            <div className="pd-bento-cell bento-delivery">
              <div className="pd-bento-header">
                <Truck size={18} className="pd-bento-icon text-indigo" />
                <h3>Delivery Check</h3>
              </div>
              <div className="bento-pincode-wrapper">
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bento-input"
                />
                <button
                  type="button"
                  className="bento-btn"
                  onClick={() => {
                    if (pinCode.length === 6) {
                      const firstDigit = pinCode.charAt(0);
                      if (firstDigit === '6') {
                        setDeliveryMessage('Delivery in 2-3 working days.');
                      } else if (firstDigit === '5') {
                        setDeliveryMessage('Delivery in 3-4 working days.');
                      } else if (['1', '2', '3', '4', '7', '8', '9'].includes(firstDigit)) {
                        setDeliveryMessage('Delivery in 5-7 working days.');
                      } else {
                        setDeliveryMessage('Delivery in 3-5 working days.');
                      }
                    }
                    else setDeliveryMessage('Enter a valid 6-digit PIN.');
                  }}
                >
                  Verify
                </button>
              </div>
              {deliveryMessage && (
                <p className={`bento-delivery-msg ${deliveryMessage.includes('Enter') ? 'error' : 'success'}`}>
                  {deliveryMessage}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="pd-pro-divider" style={{ marginTop: '20px', marginBottom: '20px' }}></div>

      {/* Modern Customer Reviews Section */}
      <div className="pd-reviews-section">
        <h2 className="pd-reviews-main-title" style={{ marginBottom: '25px', textAlign: 'center' }}>Customer Reviews</h2>

        <div className="pd-reviews-layout" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'center' }}>
          {/* Left Side: Rating Summary Card */}
          <div className="pd-summary-card-left" style={{ flex: '1 1 300px', maxWidth: '350px', width: '100%', background: '#ffffff', padding: '35px 25px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)' }}>
            <span className="pd-big-rating" style={{ fontSize: '4.5rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>{reviewSummary ? Number(reviewSummary.average_rating).toFixed(1) : "0.0"}</span>
            <div className="pd-overall-stars" style={{ display: 'flex', gap: '6px', margin: '15px 0 10px' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const avg = reviewSummary ? Number(reviewSummary.average_rating) : 0;
                const fill = star <= avg ? "#16a34a" : "transparent";
                return <Star key={star} size={28} fill={fill} color="#16a34a" />;
              })}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e293b', margin: '10px 0 25px' }}>
              {(reviewSummary && reviewSummary.average_rating >= 4) ? 'Excellent' : (reviewSummary && reviewSummary.average_rating >= 3) ? 'Good' : 'Average'}
            </div>
            <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '0 0 20px' }}></div>
            <p className="pd-summary-count" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Based on <strong style={{ color: '#16a34a' }}>{reviewSummary ? reviewSummary.total_reviews : 0}</strong> reviews
            </p>
          </div>

          {/* Right Side: Rating Bars */}
          <div className="pd-rating-bars-right" style={{ flex: '1 1 300px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[5, 4, 3, 2, 1].map(stars => {
              const count = reviewSummary && reviewSummary.rating_count ? reviewSummary.rating_count[stars] : 0;
              const total = reviewSummary ? reviewSummary.total_reviews : 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={stars} className="pd-bar-row" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span className="pd-bar-label" style={{ fontWeight: '700', color: '#334155', minWidth: '55px', fontSize: '1rem' }}>{stars} Star</span>
                  <div className="pd-bar-track" style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div className="pd-bar-fill" style={{ width: `${percent}%`, height: '100%', background: '#16a34a', borderRadius: '10px' }}></div>
                  </div>
                  <span className="pd-bar-percent" style={{ minWidth: '40px', textAlign: 'right', color: '#475569', fontSize: '0.95rem', fontWeight: '600' }}>{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Review Slider */}
        <div className="pd-reviews-bottom-slider">
          {reviews.length === 0 ? (
            <div className="pd-empty-reviews-card">
              <div className="pd-empty-icon-wrapper">
                <MessageSquare size={36} className="empty-icon" />
              </div>
              <h4>No reviews yet</h4>
              <p>Be the first to share your experience with this product!</p>
            </div>
          ) : (
            <div className="pd-reviews-grid-slider" ref={sliderRef}>
              {[...reviews, ...reviews, ...reviews, ...reviews].map((review, i) => (
                <div key={`${review.id}-${i}`} className="pd-review-slide-card">
                  <div className="pd-reviewer-header">
                    <div className="pd-reviewer-avatar" style={{ backgroundColor: review.color }}>
                      {review.initial}
                    </div>
                    <div className="pd-reviewer-info">
                      <h5>{review.name}</h5>
                      <span>{review.date}</span>
                    </div>
                    <div className="pd-google-icon-wrapper">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="pd-google-icon" />
                    </div>
                  </div>
                  <div className="pd-review-stars-display">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill={star <= review.rating ? "#fbbf24" : "transparent"} color={star <= review.rating ? "#fbbf24" : "#cbd5e1"} />
                    ))}
                  </div>
                  <p className="pd-review-text-display">"{review.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pd-pro-divider" style={{ marginTop: '60px', marginBottom: '20px' }}></div>

      <div className="related-products-section" style={{ maxWidth: '1200px', margin: '40px auto 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 800, marginBottom: 'clamp(20px, 4vw, 40px)', color: '#111827' }}>{t('relatedProducts')}</h2>
        <div className="shop-grid">
          {[
            ...products.filter(p => p.id !== product.id && p.category_name === product.category_name),
            ...products.filter(p => p.id !== product.id && p.category_name !== product.category_name)
          ].slice(0, 6).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {isFullscreen && (
        <div className="pd-fullscreen-modal" onClick={() => setIsFullscreen(false)}>
          <button className="pd-fullscreen-close" onClick={() => setIsFullscreen(false)}>×</button>

          <button
            className="pd-fullscreen-prev"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImgIndex(i => (i > 0 ? i - 1 : mediaItems.length - 1));
            }}
          >
            &#10094;
          </button>

          <div className="pd-fullscreen-content" onClick={e => e.stopPropagation()}>
            <img src={currentMedia?.src} alt="Fullscreen product" className="pd-fullscreen-image" />
          </div>

          <button
            className="pd-fullscreen-next"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImgIndex(i => (i < mediaItems.length - 1 ? i + 1 : 0));
            }}
          >
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}
