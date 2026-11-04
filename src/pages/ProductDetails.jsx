import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ShoppingCart, ShieldCheck, Leaf, Truck, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Share2, MessageCircle, Camera, Copy, Check, Package, Plus, Star, MessageSquare, FileText, CheckCircle, ArrowLeft, Sparkles, Compass, Info, X, Edit3, Send } from 'lucide-react';
import imgLifestyle from '../assets/herbal_lifestyle.webp';
import imgIngredients from '../assets/herbal_ingredients.webp';
import imgTexture from '../assets/herbal_texture.webp';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL, resolveMediaUrl } from '../services/api';
import { formatProductPackSize, formatVariationLabel, formatProductDisplayName, formatCurrency, getProductFallbackImage } from '../utils/productFormatters';
import { getDefaultVariation } from '../data/productVariationsData';
import { getProductDescription, getProductIngredients, getProductDirections } from '../data/productCatalogData';
import SeoHead from '../components/SeoHead';
import { generateProductSeo } from '../utils/productSeo';
import { checkDeliveryPincode, isValidIndianPin } from '../utils/deliveryChecker';
import { getVerifiedReviewData, getProductReviewsAndSummary } from '../utils/productReviews';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, getProductById } = useProducts();
  const { language, translateText, translateProduct, bulkProductNames, t } = useLanguage();
  const product = (getProductById ? getProductById(id) : null) || products.find(p => p.id === parseInt(id));
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRefs = useRef([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDesktopBuyBar, setShowDesktopBuyBar] = useState(false);

  // Customer write review modal & form state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newReviewerName, setNewReviewerName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u.name || u.full_name || u.first_name || (u.user && (u.user.name || u.user.full_name)) || '';
    } catch {
      return '';
    }
  });
  const [newReviewText, setNewReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      setShowDesktopBuyBar(window.scrollY > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Open review modal if directed via ?writeReview=true
  useEffect(() => {
    if (searchParams.get('writeReview') === 'true') {
      setShowReviewModal(true);
      setTimeout(() => {
        document.getElementById('customer-reviews')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    if (product?.has_3d || product?.model_3d) {
      if (!document.getElementById('model-viewer-script')) {
        const script = document.createElement('script');
        script.id = 'model-viewer-script';
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
        document.head.appendChild(script);
      }
    }
  }, [product]);

  // Load locally saved customer reviews from browser storage
  const getLocalCustomerReviews = (prodId) => {
    try {
      const raw = localStorage.getItem(`customer_reviews_${prodId}`);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const handleDeleteReview = (reviewId) => {
    const existingLocal = getLocalCustomerReviews(id);
    const updatedLocal = existingLocal.filter(r => r.id !== reviewId);
    try {
      localStorage.setItem(`customer_reviews_${id}`, JSON.stringify(updatedLocal));
    } catch (e) { }
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };


  useEffect(() => {
    const fetchReviewsAndSummary = async () => {
      if (!id) return;
      setReviews([]);
      setReviewSummary(null);

      const currentProduct = (getProductById ? getProductById(id) : null) || products.find(p => p.id === parseInt(id));
      const local = getLocalCustomerReviews(id);

      try {
        const res = await getProductReviewsAndSummary(id, currentProduct?.name || '');
        const combined = [...local, ...((res && res.reviews) || [])];
        setReviews(combined);
        setReviewSummary(res && res.summary ? res.summary : null);
      } catch (err) {
        console.error("Failed to fetch product reviews or summary", err);
        setReviews(local);
        setReviewSummary(null);
      }
      };
    fetchReviewsAndSummary();
  }, [id, products]);

  const handleCustomerReviewSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setReviewError('');
    setIsSubmittingReview(true);

    const finalRating = Number(newRating) || 5;
    const finalName = newReviewerName.trim() || 'Customer';
    const finalText = newReviewText.trim() || 'Great herbal product!';

    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
    const assignedColor = colors[Math.floor(Math.random() * colors.length)];

    const newRev = {
      id: `rev_${Date.now()}`,
      name: finalName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rating: finalRating,
      text: finalText,
      initial: (finalName.charAt(0) || 'C').toUpperCase(),
      color: assignedColor,
      verified: true,
      isLocal: true
    };

    // 1. Save locally to localStorage so it permanently stays for this product
    try {
      const existing = getLocalCustomerReviews(id);
      const updated = [newRev, ...existing.filter(r => r.id !== newRev.id)];
      localStorage.setItem(`customer_reviews_${id}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save review locally:', err);
    }

    // 2. Prepend to state so it appears below immediately
    setReviews(prev => [newRev, ...prev]);

    // 3. Attempt API submission to backend in background
    try {
      const storedUser = localStorage.getItem('user');
      let userId = null;
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const u = parsed.user || parsed;
        userId = u.id || u.user_id;
      }

      const payload = {
        rating: finalRating,
        review_text: finalText,
        product_id: parseInt(id)
      };
      if (userId) payload.user_id = userId;

      fetch(`${API_BASE_URL}/reviews/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      }).catch(() => { });
    } catch (apiErr) {
      // Handled gracefully
    }

    setIsSubmittingReview(false);
    setReviewSuccessMsg(true);

    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSuccessMsg(false);
      setNewReviewText('');
      setNewRating(5);
      // Smoothly scroll down to reviews below
      setTimeout(() => {
        const el = document.getElementById('customer-reviews-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }, 900);
  };

  // Auto-scroll logic for the slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || reviews.length <= 2) return;

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


  const verifiedReviewData = getVerifiedReviewData(product);

  const baseCount = (reviewSummary && typeof reviewSummary.total_reviews === 'number' && reviewSummary.total_reviews > 0)
    ? reviewSummary.total_reviews
    : (verifiedReviewData ? verifiedReviewData.reviews : (product && product.reviews && Number(product.reviews) > 0 ? Number(product.reviews) : 0));

  const totalReviews = Math.max(baseCount, Array.isArray(reviews) ? reviews.length : 0);

  const rawAvg = (Array.isArray(reviews) && reviews.length > 0)
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length)
    : (reviewSummary && Number(reviewSummary.average_rating) > 0
      ? Number(reviewSummary.average_rating)
      : (verifiedReviewData ? verifiedReviewData.rating : (product && product.rating && Number(product.rating) > 0 ? Number(product.rating) : 5)));

  const avgRating = (!isNaN(rawAvg) && rawAvg > 0) ? rawAvg : 5;

  const hasValidReviews = totalReviews > 0;

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
  const [pinCode, setPinCode] = useState(() => {
    try {
      return localStorage.getItem('dharani_delivery_pincode') || '';
    } catch {
      return '';
    }
  });
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [pinError, setPinError] = useState('');

  // Auto-check if previously verified PIN exists
  useEffect(() => {
    if (pinCode && pinCode.length === 6 && isValidIndianPin(pinCode)) {
      checkDeliveryPincode(pinCode).then(res => {
        if (res.success && res.deliverable) {
          setDeliveryInfo(res);
        }
      }).catch(() => { });
    }
  }, []);

  const handleVerifyPincode = async () => {
    const cleanPin = pinCode.trim();
    if (!cleanPin || cleanPin.length !== 6 || !isValidIndianPin(cleanPin)) {
      setPinError('Enter a valid 6-digit Indian PIN code (e.g. 641001)');
      setDeliveryInfo(null);
      return;
    }
    setPinError('');
    setIsCheckingPin(true);
    try {
      const res = await checkDeliveryPincode(cleanPin);
      if (res.success && res.deliverable) {
        setDeliveryInfo(res);
        setPinError('');
        try {
          localStorage.setItem('dharani_delivery_pincode', cleanPin);
        } catch (e) { }
      } else {
        setPinError(res.message || 'PIN code could not be verified for courier serviceability');
        setDeliveryInfo(null);
      }
    } catch (e) {
      setPinError('Could not verify PIN code. Please try again.');
      setDeliveryInfo(null);
    } finally {
      setIsCheckingPin(false);
    }
  };

  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [benefitsExpanded, setBenefitsExpanded] = useState(true);
  const [ingredientsExpanded, setIngredientsExpanded] = useState(true);
  const [ingredientsTab, setIngredientsTab] = useState('key');
  const { addToCart } = useCart();

  const defaultDesc = "Experience the incredible benefits of our completely natural, 100% organic herbal formulation. Carefully crafted using traditional methods and sustainably sourced ingredients to ensure the highest quality for your holistic wellness journey. Free from harmful chemicals, parabens, and artificial preservatives.";

  // Translation states
  const [translatedName, setTranslatedName] = useState(product ? formatProductDisplayName(product.name) : '');
  const [translatedSubtitle, setTranslatedSubtitle] = useState(product ? product.subtitle : '');
  const [translatedDesc, setTranslatedDesc] = useState(product ? (getProductDescription(product) || product.description || defaultDesc) : '');

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImgIndex(0);
    setQuantity(1);
    setActiveTab('description'); setCrmGalleryImages([]); setFetchedVariations([]); setFetchedKeyBenefits([]);
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
                price: formatCurrency(activePrice),
                originalPrice: originalPrice > activePrice ? formatCurrency(originalPrice) : '',
                discount: discount
              };
            });
            setFetchedVariations(formattedVariations);
            if (formattedVariations.length > 0) {
              setSelectedVariation(prev => {
                if (prev) {
                  const match = formattedVariations.find(fv => String(fv.id || fv.variation_id) === String(prev.id || prev.variation_id));
                  if (match) return match;
                }
                return getDefaultVariation(product, formattedVariations) || formattedVariations[0];
              });
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
  }, [id, product]);

  useEffect(() => {
    if (fetchedVariations.length === 0) {
      if (product && product.variations && product.variations.length > 0) {
        setSelectedVariation(prev => {
          if (prev) {
            const match = product.variations.find(v => String(v.id || v.variation_id) === String(prev.id || prev.variation_id));
            if (match) return match;
          }
          return product.selected_variation || product.default_variation || getDefaultVariation(product, product.variations) || product.variations[0];
        });
      } else {
        setSelectedVariation(null);
      }
    }
  }, [product?.id, product?.variations, product?.default_variation, product?.selected_variation, fetchedVariations.length]);

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
    setTranslatedName(formatProductDisplayName(language === 'ta' && product.tamil_name ? product.tamil_name : product.name));

    setTranslatedSubtitle(product.subtitle);
    const activeBaseDesc = getProductDescription(product) || product.description || defaultDesc;
    setTranslatedDesc(activeBaseDesc);

    if (language === 'ta') {
      // 2. Subtitle (single call, not per-card)
      if (product.subtitle) {
        translateText(product.subtitle).then(res => {
          if (active && res) setTranslatedSubtitle(res);
        });
      }

      // 3. Description (single call)
      translateText(activeBaseDesc).then(res => {
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

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const productIngredients = product ? getProductIngredients(product) : [];
  const productDirections = product ? getProductDirections(product) : [];

  const productSeo = useMemo(() => {
    if (!product) return null;
    return generateProductSeo(product, {
      language,
      selectedVariation,
      reviewSummary,
      verifiedReviews: reviews
    });
  }, [product, language, selectedVariation, reviewSummary, reviews]);

  // Smart, relevance-ranked related products from existing product catalog
  const relatedProducts = useMemo(() => {
    if (!product || !products || products.length === 0) return [];

    const currentCat = (product.category_name || '').toLowerCase();
    const currentName = (product.name || '').toLowerCase();
    const currentIngs = (productIngredients || []).join(' ').toLowerCase();

    const candidates = products.filter(p => p.id !== product.id);

    // Score candidates based on relevance
    const scored = candidates.map(p => {
      let score = 0;
      const pCat = (p.category_name || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      const pDesc = (p.description || '').toLowerCase();

      // Same category gets strong relevance
      if (pCat && currentCat && pCat === currentCat) {
        score += 15;
      }

      // Shared key botanical ingredients or keywords
      const keyHerbs = ['hibiscus', 'onion', 'amla', 'aloe', 'turmeric', 'neem', 'shikakai', 'vetiver', 'ginger', 'pepper', 'nalangu', 'pickle'];
      keyHerbs.forEach(herb => {
        if ((currentName.includes(herb) || currentIngs.includes(herb)) && (pName.includes(herb) || pDesc.includes(herb))) {
          score += 10;
        }
      });

      // Products with valid image get slight priority
      if (p.image && p.image.trim()) {
        score += 2;
      }

      return { product: p, score };
    });

    // Sort descending by relevance score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 6).map(s => s.product);
  }, [product, products, productIngredients]);

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
  const isChemparuthiShampoo = Number(product.id) === 1255 || (product.name && product.name.toLowerCase().includes('chemparuthi herbal shampoo'));
  const isArappuShampoo = Number(product.id) === 1246 || (product.name && product.name.toLowerCase().includes('arappu shampoo'));
  const fallbackImg = getProductFallbackImage(product.raw_name || product.name, product.id) || getProductFallbackImage(product.name, product.id);

  // 1. Primary product image (the EXACT image shown on the card outside) MUST ALWAYS be first!
  if (isChemparuthiShampoo) {
    mediaItems.push({ type: 'image', src: '/images/chemparuthi_herbal_shampoo.jpg', thumb: '/images/chemparuthi_herbal_shampoo.jpg' });
  } else if (isArappuShampoo) {
    mediaItems.push({ type: 'image', src: '/images/arappu_shampoo.jpg', thumb: '/images/arappu_shampoo.jpg' });
  } else if (product.image && !product.image.includes('Vaishnavi.jpeg') && !product.image.endsWith('/logo.png')) {
    const rawImages = typeof product.image === 'string' && product.image.includes(',')
      ? product.image.split(',').map(s => s.trim()).filter(Boolean)
      : [product.image];

    for (const img of rawImages) {
      if (img.includes('Vaishnavi.jpeg') || img.endsWith('/logo.png')) continue;
      const pSrc = resolveMediaUrl(img);
      if (pSrc && !mediaItems.some(m => m.src === pSrc)) {
        mediaItems.push({ type: 'image', src: pSrc, thumb: pSrc });
      }
    }
  }

  // If primary image was missing/broken, use authentic fallback
  if (mediaItems.length === 0 && fallbackImg) {
    mediaItems.push({ type: 'image', src: fallbackImg, thumb: fallbackImg });
  }

  // 2. Extra gallery images from CRM come AFTER the primary product image
  if (crmGalleryImages.length > 0) {
    crmGalleryImages.forEach(imgObj => {
      const raw = imgObj.image || imgObj.url;
      if (raw && (raw.includes('Vaishnavi.jpeg') || raw.endsWith('/logo.png'))) return;
      const src = resolveMediaUrl(raw);
      if (src && !mediaItems.some(m => m.src === src)) {
        // Exclude double-bottle legacy image for Chemparuthi shampoo
        if (isChemparuthiShampoo && (src.includes('Hibiscus') || src.includes('Shampoo.jpg'))) {
          return;
        }
        mediaItems.push({ type: 'image', src, thumb: src });
      }
    });
  }

  // 3. 3D Model if available
  if (product.model_3d) {
    mediaItems.push({
      type: '3d',
      src: resolveMediaUrl(product.model_3d),
      thumb: mediaItems[0]?.src || fallbackImg || 'https://vedanmart.com/images/Food/WILD%20HONEYJAR(NR).jpg'
    });
  }

  // 4. Fallback if no images found
  if (mediaItems.length === 0) {
    const safeImg = fallbackImg || 'https://vedanmart.com/images/Food/WILD%20HONEYJAR(NR).jpg';
    mediaItems.push({ type: 'image', src: safeImg, thumb: safeImg });
  }

  const currentMedia = mediaItems[currentImgIndex];
  const getProductShareUrl = () => {
    if (typeof window === 'undefined') return `https://www.dharaniherbbals.in/product/${product.id}`;
    return `${window.location.origin}/product/${product.id}`;
  };

  const getShareText = () => {
    const price = selectedVariation?.price || product.price;
    const formattedPrice = price ? ` - ₹${parseFloat(String(price).replace(/[^0-9.]/g, '')).toFixed(0)}` : '';
    const packSize = selectedVariation ? formatVariationLabel(selectedVariation) : (product.pack_size || formatProductPackSize(product));
    const sizeText = packSize ? ` (${packSize})` : '';
    const shareUrl = getProductShareUrl();

    let text = `🌿 Check out *${translatedName}*${sizeText}${formattedPrice} on Dharani Herbals!\n`;
    text += `✨ 100% Authentic South Indian Botanical Care\n\n`;
    text += `👉 View product details & order online:\n${shareUrl}`;
    return text;
  };

  const copyShareLink = async () => {
    const shareUrl = getProductShareUrl();
    if (!shareUrl) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        throw new Error('Clipboard API unavailable');
      }
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
    window.setTimeout(() => setShareCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank', 'noopener,noreferrer');
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
      {productSeo && <SeoHead {...productSeo} />}
      {/* Breadcrumbs & Back Button */}
      <div className="pd-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#334155', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flexShrink: 0 }}
          title="Go Back"
          aria-label="Go Back"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/">{t('home')}</Link>
          <span className="separator" style={{ margin: '0 8px' }}>/</span>
          {product.category_name && (
            <>
              <Link to={`/shop?category=${encodeURIComponent(product.category_name)}`}>{product.category_name}</Link>
              <span className="separator" style={{ margin: '0 8px' }}>/</span>
            </>
          )}
          <span className="current">{translatedName}</span>
        </div>
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
                  <ChevronLeft size={22} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`pd-gallery-arrow pd-gallery-arrow-next ${isLastSlide ? 'disabled' : ''}`}
                  onClick={handleNextSlide}
                  disabled={isLastSlide}
                  aria-label="Next Image"
                >
                  <ChevronRight size={22} aria-hidden="true" />
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
                      alt={`${translatedName} - ${product.category_name || 'Herbal Product'} by Dharani Herbals (View ${idx + 1})`}
                      className={`pd-pro-main-image ${media.src && (media.src.includes('/4.jpeg') || media.src.endsWith('4.jpeg') || product?.id === 1301 || (product?.name && product.name.toLowerCase().includes('keelanelli')))
                          ? 'pd-img-zoom-fit'
                          : ''
                        }`}
                      fetchPriority={idx === 0 ? "high" : "auto"}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (fallbackImg && e.target.src !== fallbackImg) {
                          e.target.src = fallbackImg;
                          return;
                        }
                        const safeProductImg = 'https://vedanmart.com/images/Food/WILD%20HONEYJAR(NR).jpg';
                        if (e.target.src !== safeProductImg) {
                          e.target.src = safeProductImg;
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
                aria-label="Share product on WhatsApp"
              >
                <Share2 size={20} aria-hidden="true" />
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
                    alt={`${translatedName} thumbnail view ${idx + 1}`}
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

          {hasValidReviews ? (
            <div className="pd-pro-rating">
              <div className="pro-stars">
                <span className="star">★</span>
                <span className="score">{avgRating.toFixed(1)}</span>
              </div>
              <button
                type="button"
                className="pd-inline-add-review-btn"
                onClick={() => setShowReviewModal(true)}
              >
                + Write a Review
              </button>
            </div>
          ) : (
            <div className="pd-pro-rating no-reviews">
              <button
                type="button"
                className="pd-inline-add-review-btn"
                onClick={() => setShowReviewModal(true)}
              >
                + Add Review
              </button>
            </div>
          )}

          {/* Unified Purchase Section: Price, Variations, Add to Cart / Buy Now & Delivery Check */}
          <div className="pd-purchase-section">
            <div className="pd-pro-price-block">
              <span className="pro-current-price">{formatCurrency(selectedVariation ? selectedVariation.price : product.price)}</span>
              {(() => {
                const currentVar = selectedVariation || product.default_variation;
                const packSize = currentVar ? formatVariationLabel(currentVar, product) : (product.pack_size || formatProductPackSize(product));
                return packSize ? (
                  <span style={{ fontSize: '1.2rem', color: '#6b7280', marginLeft: '10px', fontWeight: '500' }}>
                    ({packSize})
                  </span>
                ) : null;
              })()}
              <p className="tax-inclusive">{t('taxInclusive') || 'Inclusive of all taxes'}</p>
            </div>

            {((fetchedVariations && fetchedVariations.length > 0) || (product.variations && product.variations.length > 0)) && (
              <div className="pd-premium-variations-wrapper">
                <h4 className="variations-title">{product.variationLabel || 'Available Size / Pack'}</h4>
                <div className="premium-variations-grid">
                  {(fetchedVariations && fetchedVariations.length > 0 ? fetchedVariations : product.variations).map((v, idx) => {
                    const isSelected = selectedVariation
                      ? String(selectedVariation.id || selectedVariation.variation_id) === String(v.id || v.variation_id)
                      : (product.default_variation_id && String(product.default_variation_id) === String(v.id || v.variation_id));
                    return (
                      <div
                        key={idx}
                        className={`premium-variation-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedVariation(v)}
                      >
                        {isSelected && (
                          <div className="premium-variation-check">
                            <CheckCircle size={16} weight="fill" />
                          </div>
                        )}
                        <span className="premium-variation-name">{formatVariationLabel(v, product)}</span>
                        <span className="premium-variation-price">{formatCurrency(v.price)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pd-pro-divider"></div>

            {/* Add to Cart Actions */}
            <div className="pd-premium-actions-wrapper">
              <div className="premium-qty-selector">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">-</button>
                <input type="text" value={quantity} readOnly aria-label="Selected quantity" />
                <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button>
              </div>
              <div className="pd-action-buttons-row">
                <button type="button" className="premium-add-btn" onClick={() => addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id || product.default_variation_id)}>
                  <ShoppingCart size={20} strokeWidth={2.5} />
                  <span>{t('addToCart') || 'Add to Cart'}</span>
                </button>
                <button
                  type="button"
                  className="premium-buy-now-btn"
                  onClick={async () => {
                    await addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id || product.default_variation_id, true);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                    navigate('/checkout');
                  }}
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* WhatsApp Share & Direct Link Sharing */}
              <div className="pd-share-block">
                <span className="pd-share-label">Share Product:</span>
                <div className="pd-share-actions">
                  <button
                    type="button"
                    className="pd-share-btn pd-share-whatsapp"
                    onClick={shareToWhatsApp}
                    aria-label="Share product on WhatsApp"
                    title="Share product on WhatsApp"
                  >
                    <MessageCircle size={18} className="pd-wa-icon" />
                    <span>Share on WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    className={`pd-share-btn pd-share-copy ${shareCopied ? 'copied' : ''}`}
                    onClick={copyShareLink}
                    aria-label="Copy direct product link"
                    title="Copy direct product link"
                  >
                    {shareCopied ? (
                      <>
                        <Check size={16} />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* In-Section PIN-Code Delivery Check */}
            <div className="pd-pincode-check-card">
              <div className="pd-pincode-header">
                <Truck size={18} className="text-emerald" />
                <span className="pd-pincode-title">Delivery & Pincode Availability</span>
              </div>
              <div className="pd-pincode-input-row">
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN"
                  value={pinCode}
                  maxLength={6}
                  onChange={(e) => {
                    setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (pinError) setPinError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleVerifyPincode();
                    }
                  }}
                  className="pd-pincode-input"
                />
                <button
                  type="button"
                  className="pd-pincode-check-btn"
                  onClick={handleVerifyPincode}
                  disabled={isCheckingPin || pinCode.length !== 6}
                >
                  {isCheckingPin ? 'Checking...' : 'Check'}
                </button>
              </div>

              {deliveryInfo && (
                <div className="pd-delivery-status-box success">
                  <CheckCircle size={16} className="status-icon text-emerald" />
                  <div>
                    <p className="delivery-location">
                      <strong>Deliverable</strong> {deliveryInfo.location ? `to ${deliveryInfo.location}` : `to PIN ${deliveryInfo.pin}`}
                    </p>
                    <p className="delivery-estimate">
                      Estimated delivery in <strong>{deliveryInfo.timeline}</strong> (Standard courier with live tracking)
                    </p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#16a34a', fontWeight: '500' }}>
                      ✓ Free Shipping on orders of ₹500 or more
                    </p>
                  </div>
                </div>
              )}

              {pinError && (
                <div className="pd-delivery-status-box error">
                  <Info size={16} className="status-icon text-rose" />
                  <p className="delivery-error-text">{pinError}</p>
                </div>
              )}

              <div className="pd-delivery-badges-row">
                <span>✓ Standard Courier</span>
                <span>✓ Fast Dispatch</span>
                <span>✓ Cash on Delivery Available</span>
              </div>
            </div>
          </div>

          {/* Ultra-Modern Bento Section */}
          <div className="pd-bento-grid">
            {/* Bento Box 1: Description */}
            <div className="pd-bento-cell bento-desc">
              <div className="pd-bento-header">
                <FileText size={18} className="pd-bento-icon text-indigo" />
                <h3>{t('descriptionLabel') || 'Description'}</h3>
              </div>
              <div className="pd-bento-text">
                {(translatedDesc || '').split(/\n\n+/).map((para, idx) => (
                  <p key={idx} style={{ marginBottom: idx < (translatedDesc || '').split(/\n\n+/).length - 1 ? '12px' : '0', lineHeight: '1.65' }}>
                    {para.trim()}
                  </p>
                ))}
              </div>
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

            {/* Bento Box 3: Dedicated Ingredients Section */}
            <div className="pd-bento-cell bento-ingredients">
              <div className="pd-bento-header">
                <Sparkles size={18} className="pd-bento-icon text-emerald" />
                <h3>{t('ingredientsLabel') || 'Ingredients'}</h3>
              </div>
              {productIngredients && productIngredients.length > 0 ? (
                <div className="bento-ingredients-list">
                  {productIngredients.map((item, idx) => (
                    <span key={idx} className="bento-ingredient-tag">
                      <Leaf size={12} className="text-emerald" />
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="bento-info-unavailable">
                  <Info size={16} className="text-muted" />
                  <p>{t('ingredientsNotAvailable') || 'Ingredients information not available'}</p>
                </div>
              )}
            </div>

            {/* Bento Box 4: Dedicated Directions for Use Section */}
            <div className="pd-bento-cell bento-directions">
              <div className="pd-bento-header">
                <Compass size={18} className="pd-bento-icon text-amber" />
                <h3>{t('directionsLabel') || 'Directions for Use'}</h3>
              </div>
              {productDirections ? (
                <div className="bento-directions-content">
                  <p className="pd-bento-text" style={{ lineHeight: '1.65' }}>{productDirections}</p>
                </div>
              ) : (
                <div className="bento-info-unavailable">
                  <Info size={16} className="text-muted" />
                  <p>{t('usageNotAvailable') || 'Usage instructions not available'}</p>
                </div>
              )}
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
                <h3>{t('deliveryCheck') || 'Delivery Check'}</h3>
              </div>
              <div className="bento-pincode-wrapper">
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN"
                  value={pinCode}
                  maxLength={6}
                  onChange={(e) => {
                    setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (pinError) setPinError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleVerifyPincode();
                    }
                  }}
                  className="bento-input"
                />
                <button
                  type="button"
                  className="bento-btn"
                  onClick={handleVerifyPincode}
                  disabled={isCheckingPin || pinCode.length !== 6}
                >
                  {isCheckingPin ? '...' : 'Verify'}
                </button>
              </div>
              {deliveryInfo && (
                <p className="bento-delivery-msg success">
                  ✓ Deliverable to {deliveryInfo.location || pinCode} ({deliveryInfo.timeline})
                </p>
              )}
              {pinError && (
                <p className="bento-delivery-msg error">
                  {pinError}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>



      {/* Customer Write Review Modal */}
      {showReviewModal && (
        <div className="pd-review-modal-backdrop" onClick={() => !isSubmittingReview && setShowReviewModal(false)}>
          <div className="pd-review-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pd-review-modal-close"
              onClick={() => setShowReviewModal(false)}
              disabled={isSubmittingReview}
              aria-label="Close review modal"
            >
              ×
            </button>

            <div className="pd-review-modal-header">
              <div className="pd-review-modal-product">
                <img src={mediaItems[0]?.src || product?.image} alt={translatedName} />
                <div>
                  <h3>Write a Customer Review</h3>
                  <p className="pd-review-modal-product-name">{translatedName}</p>
                </div>
              </div>
            </div>

            {reviewSuccessMsg ? (
              <div className="pd-review-success-state">
                <div className="pd-success-icon-wrap">
                  <CheckCircle size={52} color="#16a34a" />
                </div>
                <h4>Thank you for your feedback!</h4>
                <p>Your review has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleCustomerReviewSubmit} className="pd-review-form" noValidate>
                {/* Interactive Star Rating */}
                <div className="pd-form-group">
                  <label className="pd-form-label">
                    Your Rating
                  </label>
                  <div className="pd-interactive-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className="pd-star-btn"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewRating(star)}
                        title={`${star} Star`}
                      >
                        <Star
                          size={32}
                          fill={(hoverRating || newRating) >= star ? "#fbbf24" : "transparent"}
                          color={(hoverRating || newRating) >= star ? "#fbbf24" : "#d1d5db"}
                        />
                      </button>
                    ))}
                    <span className="pd-rating-text-label">
                      {{
                        1: '⭐ Poor - Not satisfied',
                        2: '⭐⭐ Fair - Needs improvement',
                        3: '⭐⭐⭐ Good - Met expectations',
                        4: '⭐⭐⭐⭐ Very Good - Satisfied',
                        5: '⭐⭐⭐⭐⭐ Excellent - Loved it!'
                      }[hoverRating || newRating] || 'Select Rating'}
                    </span>
                  </div>
                </div>

                {/* Your Name */}
                <div className="pd-form-group">
                  <label className="pd-form-label">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="pd-form-input"
                    placeholder="e.g. Karthik, Priya (optional)"
                    value={newReviewerName}
                    onChange={(e) => setNewReviewerName(e.target.value)}
                  />
                </div>

                {/* Review Message */}
                <div className="pd-form-group">
                  <label className="pd-form-label">
                    Your Review / Feedback
                  </label>
                  <textarea
                    className="pd-form-textarea"
                    rows={2}
                    placeholder="Share your genuine experience with this herbal product (optional)"
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                  />
                </div>

                {reviewError && (
                  <p className="pd-review-error-msg">{reviewError}</p>
                )}

                {/* Modal Buttons */}
                <div className="pd-review-modal-actions">
                  <button
                    type="button"
                    className="pd-btn-secondary"
                    onClick={() => setShowReviewModal(false)}
                    disabled={isSubmittingReview}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="pd-btn-submit-review"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? 'Posting Review...' : 'Post Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Customer Reviews Section (Rendered below on the page when reviews exist) */}
      {reviews && reviews.length > 0 && (
        <div id="customer-reviews-section" className="pd-customer-reviews-section" style={{ maxWidth: '1200px', margin: '40px auto 20px', padding: '0 20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Customer Reviews
            </h3>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.88rem' }}>
              Real experiences and feedback from genuine herbal customers
            </p>
          </div>

          <div className="pd-reviews-list-grid">
            {reviews.map((rev) => (
              <div key={rev.id} className="pd-single-review-card">
                <div className="pd-single-review-header">
                  <div className="pd-single-review-avatar" style={{ backgroundColor: rev.color || '#10b981' }}>
                    {rev.initial || (rev.name ? rev.name.charAt(0).toUpperCase() : 'C')}
                  </div>
                  <div className="pd-single-review-info">
                    <div className="pd-single-review-name-row">
                      <span className="pd-single-review-name">{rev.name}</span>
                      <span className="pd-single-review-badge">Verified Buyer</span>
                      {rev.isLocal && (
                        <button
                          type="button"
                          className="pd-delete-review-chip"
                          onClick={() => handleDeleteReview(rev.id)}
                          title="Delete review"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <span className="pd-single-review-date">{rev.date}</span>
                  </div>
                </div>

                <div className="pd-single-review-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{ color: s <= (rev.rating || 5) ? '#fbbf24' : '#d1d5db', fontSize: '1.1rem' }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="pd-single-review-text">"{rev.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pd-pro-divider" style={{ marginTop: '60px', marginBottom: '20px' }}></div>

      <div className="related-products-section" style={{ maxWidth: '1200px', margin: '40px auto 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 800, marginBottom: 'clamp(20px, 4vw, 40px)', color: '#111827' }}>{t('relatedProducts')}</h2>
        <div className="shop-grid">
          {relatedProducts.map(p => (
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

      {/* Universal Fixed Bottom Buy Bar (Desktop & Mobile) */}
      <div
        className={`pd-fixed-buy-bar ${showDesktopBuyBar ? 'desktop-visible' : ''}`}
        role="region"
        aria-label="Product purchase action bar"
      >
        <div className="pd-fixed-buy-bar-container">
          {/* Desktop Left: Product thumbnail & clean title */}
          <div className="pd-fixed-bar-product-info">
            <img
              src={mediaItems[0]?.src || product.image}
              alt={translatedName || formatProductDisplayName(product.name)}
              className="pd-fixed-bar-thumb"
            />
            <div className="pd-fixed-bar-meta">
              <span className="pd-fixed-bar-title">{translatedName || formatProductDisplayName(product.name)}</span>
              <span className="pd-fixed-bar-variant">
                {selectedVariation ? formatVariationLabel(selectedVariation, product) : (product.pack_size || formatProductPackSize(product) || 'Standard')}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="pd-sticky-price-box">
            <div className="pd-sticky-prices">
              <span className="pd-sticky-active-price">
                {formatCurrency(selectedVariation?.price || product.price)}
              </span>
              {selectedVariation?.originalPrice && (
                <span className="pd-sticky-original-price">{formatCurrency(selectedVariation.originalPrice)}</span>
              )}
            </div>
            <span className="pd-sticky-pack-label mobile-only">
              {selectedVariation ? formatVariationLabel(selectedVariation, product) : (product.pack_size || formatProductPackSize(product) || 'Standard')}
            </span>
          </div>

          {/* Buttons: Add to Cart & Buy Now */}
          <div className="pd-sticky-btn-group">
            <button
              type="button"
              className="pd-sticky-btn pd-sticky-add-btn"
              onClick={() => addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id || product.default_variation_id)}
              aria-label="Add to Cart"
            >
              <ShoppingCart size={18} strokeWidth={2.4} aria-hidden="true" />
              <span>{t('addToCart') || 'Add to Cart'}</span>
            </button>
            <button
              type="button"
              className="pd-sticky-btn pd-sticky-buy-btn"
              onClick={async () => {
                await addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id || product.default_variation_id, true);
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate('/checkout');
              }}
              aria-label="Buy Now"
            >
              <span>Buy Now</span>
            </button>
            <button
              type="button"
              className="pd-sticky-btn pd-sticky-wa-btn"
              onClick={shareToWhatsApp}
              title="Share on WhatsApp"
              aria-label="Share on WhatsApp"
            >
              <MessageCircle size={18} />
              <span className="desktop-only">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
