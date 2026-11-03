import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Clock, Sparkles, MessageCircle, Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductsContext';
import { API_BASE_URL, SLIDERS_API_URL, resolveMediaUrl } from '../services/api';
import sathuMaavuImg from '../assets/sathu_maavu_transparent.png';
import dharaniAvatar from '../assets/dharani_avatar.png';
import wildTurmericBannerImg from '../assets/wild_turmeric_offer_banner.jpg';
import bodySoapImg from '../assets/body_soap_transparent.png';
import chemparuthiShampooImg from '../assets/chemparuthi_shampoo_transparent_v3.png';
import aloeFacePackImg from '../assets/aloe_vera_face_pack_transparent.png';
import nalanguPowderImg from '../assets/nalangu_powder_transparent_v2.png';
import poojaOilImg from '../assets/pooja_oil_transparent_v2.png';
import pirandaiPickleImg from '../assets/pirandai_pickle_transparent_v2.png';
import './SliderPopup.css';

// Curated default featured offers from live products so the widget is ALWAYS visible
const DEFAULT_FEATURED_OFFERS = [
  {
    id: 1243,
    productName: 'Wild Turmeric',
    offerTitle: '✨ Special Herbal Deal',
    subtitle: '100% Pure Kasturi Manjal for Natural Glow',
    image: wildTurmericBannerImg,
    link: '/product/1243',
    originalPrice: 95,
    finalPrice: 65,
    discountPercentage: 31
  },
  {
    id: 1193,
    productName: '75 GM MAHIL ROSE SOAP(RC)',
    offerTitle: '🌹 Pure Herbal Soap Deal',
    subtitle: 'Botanical Herbal Remedy with Natural Rose',
    image: bodySoapImg,
    link: '/product/1193',
    originalPrice: 55,
    finalPrice: 41,
    discountPercentage: 25
  },
  {
    id: 1011,
    productName: 'Facepack Powder',
    offerTitle: '🌟 Glowing Skin Offer',
    subtitle: 'Herbal Radiance & Skin Nourishment',
    image: aloeFacePackImg,
    link: '/product/1011',
    originalPrice: 90,
    finalPrice: 65,
    discountPercentage: 28
  },
  {
    id: 1263,
    productName: 'Cucumber gel',
    offerTitle: '🌿 Hydrating Cooling Gel',
    subtitle: 'Pure Herbal Hydration & Soothing Care',
    image: aloeFacePackImg,
    link: '/product/1263',
    originalPrice: 110,
    finalPrice: 80,
    discountPercentage: 27
  },
  {
    id: 1246,
    productName: 'Arappu Shampoo',
    offerTitle: '🌺 Mega Hair Care Deal',
    subtitle: 'Traditional Natural Herbal Hair Cleanser',
    image: chemparuthiShampooImg,
    link: '/product/1246',
    originalPrice: 130,
    finalPrice: 65,
    discountPercentage: 50
  },
  {
    id: 1272,
    productName: 'Sprouted Multigrain Health Mix',
    offerTitle: '🌾 Pure Nutrition Offer',
    subtitle: 'Traditional Herbal Health Mix for Whole Family',
    image: sathuMaavuImg,
    link: '/product/1272',
    originalPrice: 220,
    finalPrice: 185,
    discountPercentage: 16
  }
];

// Helper to resolve the best high-res studio transparent image for any product
const getProductStudioImage = (item, matchedProd) => {
  const title = (item?.title || item?.offer || item?.text_overlay || '').toLowerCase();
  const prodName = (matchedProd?.name || item?.productName || '').toLowerCase();
  const rawUrl = (item?.image || item?.image_url || item?.url || '').toLowerCase();
  const text = `${title} ${prodName} ${rawUrl}`;
  const idStr = String(item?.product_id || item?.id || matchedProd?.id || '');

  // 1. Wild Turmeric -> full hero banner
  if (idStr === '1243' || text.includes('turmeric') || text.includes('manjal')) {
    return wildTurmericBannerImg;
  }
  // 2. Soap (Mahil Rose Soap, Aloe Vera Soap, etc.) -> transparent studio cutout
  if (idStr === '1193' || idStr === '1225' || text.includes('soap') || text.includes('mahil') || text.includes('rose')) {
    return bodySoapImg;
  }
  // 3. Shampoo -> transparent shampoo bottle
  if (idStr === '1246' || text.includes('shampoo') || text.includes('arappu') || text.includes('chemparuthi')) {
    return chemparuthiShampooImg;
  }
  // 4. Face Pack & Gels
  if (idStr === '1011' || idStr === '1263' || text.includes('face pack') || text.includes('gel') || text.includes('facepack')) {
    return aloeFacePackImg;
  }
  // 5. Powders
  if (idStr === '1012' || text.includes('powder') || text.includes('nalangu')) {
    return nalanguPowderImg;
  }
  // 6. Oils
  if (idStr === '1013' || text.includes('oil')) {
    return poojaOilImg;
  }
  // 7. Health Mix / Sathu Maavu
  if (idStr === '1272' || text.includes('sathu') || text.includes('health mix') || text.includes('multigrain')) {
    return sathuMaavuImg;
  }
  // 8. Pickles
  if (text.includes('pickle') || text.includes('pirandai')) {
    return pirandaiPickleImg;
  }

  // Fallback to direct URL if available
  const origRawUrl = item?.image || item?.image_url || item?.url;
  if (origRawUrl && origRawUrl.match(/\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i)) {
    return resolveMediaUrl(origRawUrl);
  }
  if (matchedProd?.image) {
    return resolveMediaUrl(matchedProd.image);
  }
  return bodySoapImg;
};

export default function SliderPopup() {
  const [offers, setOffers] = useState(DEFAULT_FEATURED_OFFERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mascotDismissed, setMascotDismissed] = useState(false);

  // Live Deal Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: '05', minutes: '45', seconds: '30' });

  const { isTamil } = useLanguage();
  const { products: contextProducts } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  // Hidden on checkout, login, cart, order-success, admin
  const isExcludedRoute =
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/order-success') ||
    location.pathname.startsWith('/admin');

  // Detect if current page is product details
  const isOnProductPage = location.pathname.includes('/product/');

  // Countdown timer: persistent 6-hour synchronized deal countdown
  useEffect(() => {
    const getTargetTime = () => {
      const stored = localStorage.getItem('dharani_deal_deadline');
      const now = Date.now();
      if (stored && Number(stored) > now) {
        return Number(stored);
      }
      const newDeadline = now + 6 * 60 * 60 * 1000 + 35 * 60 * 1000;
      localStorage.setItem('dharani_deal_deadline', String(newDeadline));
      return newDeadline;
    };

    const targetTime = getTargetTime();

    const updateTimer = () => {
      const now = Date.now();
      let diff = targetTime - now;
      if (diff <= 0) {
        const newDeadline = now + 6 * 60 * 60 * 1000;
        localStorage.setItem('dharani_deal_deadline', String(newDeadline));
        diff = 6 * 60 * 60 * 1000;
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Helper to format currency values safely
  const formatPriceValue = (val) => {
    if (val === null || val === undefined || val === '') return '';
    return `₹${val}`;
  };

  // Fetch real offers and products from CRM API
  useEffect(() => {
    let isMounted = true;
    const fetchOffersAndProducts = async () => {
      try {
        const [slidersRes, prodsRes] = await Promise.all([
          fetch(SLIDERS_API_URL, { headers: { 'ngrok-skip-browser-warning': 'true' } }).catch(() => null),
          fetch(`${API_BASE_URL}/products/?role=admin`, { headers: { 'ngrok-skip-browser-warning': 'true' } }).catch(() => null)
        ]);

        let sliderList = [];
        if (slidersRes && slidersRes.ok) {
          const sData = await slidersRes.json();
          sliderList = Array.isArray(sData) ? sData : sData?.value || sData?.results || sData?.data || [];
        }

        let productsList = contextProducts && contextProducts.length > 0 ? [...contextProducts] : [];
        if (prodsRes && prodsRes.ok) {
          const pData = await prodsRes.json();
          const remoteList = Array.isArray(pData) ? pData : pData?.results || pData?.data || [];
          if (remoteList.length > 0) {
            productsList = remoteList;
          }
        }

        const findMatchedProduct = (titleText, imgUrl) => {
          if (!productsList || productsList.length === 0) return null;

          if (imgUrl && imgUrl.match(/\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i)) {
            try {
              const cleanImgFilename = decodeURIComponent(imgUrl.split('/').pop().split('?')[0]).trim().toLowerCase();
              const matchedByImage = productsList.find((p) => {
                if (!p.image) return false;
                const pImgFilename = decodeURIComponent(p.image.split('/').pop().split('?')[0]).trim().toLowerCase();
                return pImgFilename === cleanImgFilename;
              });
              if (matchedByImage) return matchedByImage;
            } catch (e) {
              // ignore
            }
          }

          if (titleText) {
            const clean = titleText.trim().toLowerCase();
            const searchWords = clean
              .replace(/\b(mega offer|offer|deal|special|pack|combo|limited|buy|get)\b/gi, '')
              .trim()
              .split(/\s+/)
              .filter((w) => w.length >= 3);

            let bestMatch = null;
            let highestScore = 0;

            for (const p of productsList) {
              const pName = (p.name || '').toLowerCase();
              let score = 0;
              if (pName === clean) score += 100;
              else if (pName.includes(clean) || clean.includes(pName)) score += 50;

              for (const w of searchWords) {
                if (pName.includes(w)) score += 10;
              }

              if (score > highestScore && score >= 10) {
                highestScore = score;
                bestMatch = p;
              }
            }
            return bestMatch;
          }

          return null;
        };

        const activeOffers = [];

        // 1. Process CRM Sliders FIRST (High Priority)
        if (sliderList.length > 0) {
          sliderList
            .filter((item) => item.is_active !== false)
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
            .forEach((item, index) => {
              let rawUrl = item.image || item.image_url || item.url || (item.subtitle && item.subtitle.startsWith('http') ? item.subtitle : null);
              let title = item.title || item.offer || item.text_overlay || '';
              let subtitle = item.subtitle && !item.subtitle.startsWith('http') ? item.subtitle : '';
              let targetLink = item.link || (item.product_id ? `/product/${item.product_id}` : '');

              let matchedProd = null;
              if (item.product_id) {
                const pId = Number(item.product_id);
                matchedProd = productsList.find((p) => Number(p.id) === pId);
              }
              if (!matchedProd && targetLink) {
                const prodIdMatch = targetLink.match(/\/product\/(\d+)/);
                if (prodIdMatch) {
                  const pId = Number(prodIdMatch[1]);
                  matchedProd = productsList.find((p) => Number(p.id) === pId);
                }
              }
              if (!matchedProd) {
                matchedProd = findMatchedProduct(title, rawUrl);
              }

              let img = getProductStudioImage(item, matchedProd);

              if (matchedProd && !targetLink) {
                targetLink = `/product/${matchedProd.id}`;
              }

              let finalPrice = null;
              let originalPrice = null;
              let discountPct = null;

              if (matchedProd?.price) {
                finalPrice = parseFloat(String(matchedProd.price).replace(/[^0-9.]/g, ''));
              }
              if (matchedProd?.mrp) {
                originalPrice = parseFloat(String(matchedProd.mrp).replace(/[^0-9.]/g, ''));
              }

              if (item.discount_percentage || item.discount) {
                discountPct = parseInt(item.discount_percentage || item.discount, 10);
              } else if (originalPrice && finalPrice && originalPrice > finalPrice) {
                discountPct = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
              }

              if (!discountPct && item.offer) {
                const pctMatch = String(item.offer).match(/(\d+)%/);
                if (pctMatch) discountPct = parseInt(pctMatch[1], 10);
              }

              if (!originalPrice && finalPrice && discountPct && discountPct > 0 && discountPct < 100) {
                originalPrice = Math.round(finalPrice / (1 - discountPct / 100));
              }

              activeOffers.push({
                id: item.id || `crm-${index}`,
                productName: matchedProd?.name || title || (isTamil ? 'இயற்கை மூலிகை தயாரிப்பு' : 'Herbal Wellness Product'),
                offerTitle: item.offer || title || (isTamil ? 'சிறப்பு ஆஃபர்' : 'Special Offer'),
                subtitle: subtitle || matchedProd?.category_name || (isTamil ? 'பாரம்பரிய மூலிகை தயாரிப்பு' : 'Botanical Herbal Remedy'),
                image: img,
                link: targetLink || (matchedProd ? `/product/${matchedProd.id}` : '/shop'),
                originalPrice: originalPrice || (finalPrice ? Math.round(finalPrice * 1.3) : null),
                finalPrice: finalPrice || (originalPrice ? Math.round(originalPrice * 0.75) : null),
                discountPercentage: discountPct || 25,
                isCrmOffer: true
              });
            });
        }

        // 2. Add curated default / live catalog offers so the widget is NEVER empty
        DEFAULT_FEATURED_OFFERS.forEach((def) => {
          const already = activeOffers.some((o) => String(o.id) === String(def.id) || (o.link && o.link === def.link));
          if (!already) {
            const matchedCatalog = productsList.find((p) => String(p.id) === String(def.id));
            let offerImg = getProductStudioImage(def, matchedCatalog) || def.image;
            activeOffers.push({
              ...def,
              image: offerImg,
              finalPrice: matchedCatalog?.price ? parseFloat(String(matchedCatalog.price).replace(/[^0-9.]/g, '')) : def.finalPrice,
              originalPrice: matchedCatalog?.mrp && parseFloat(String(matchedCatalog.mrp)) > 0
                ? parseFloat(String(matchedCatalog.mrp).replace(/[^0-9.]/g, ''))
                : def.originalPrice
            });
          }
        });

        // Ensure all offers use crisp transparent studio cutouts and banners
        const sanitizedOffers = activeOffers.map((offer) => {
          const studioImg = getProductStudioImage(offer, null);
          return {
            ...offer,
            image: studioImg || offer.image
          };
        });

        if (isMounted && sanitizedOffers.length > 0) {
          setOffers(sanitizedOffers);
        }
      } catch (err) {
        console.warn('SliderPopup fetch error:', err);
      }
    };

    fetchOffersAndProducts();
    return () => {
      isMounted = false;
    };
  }, [isTamil, contextProducts]);

  // Entrance visibility on page load
  useEffect(() => {
    if (isExcludedRoute) return;

    const timer = setTimeout(() => {
      setIsCardVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [isExcludedRoute]);

  // Confetti sparks when modal opens
  const triggerSparks = useCallback(() => {
    try {
      confetti({
        particleCount: 28,
        spread: 65,
        origin: { y: 0.52, x: 0.5 },
        colors: ['#ffd700', '#22c55e', '#ff9500', '#10b981'],
        shapes: ['circle'],
        scalar: 0.7,
        startVelocity: 30,
        gravity: 1.1,
        ticks: 80,
        zIndex: 999999
      });
    } catch (err) {
      // ignore
    }
  }, []);

  // Listen for open-dharani-offer-modal from ImageSlider or promo links
  useEffect(() => {
    const handleOpenModal = () => {
      setIsModalOpen(true);
      triggerSparks();
    };
    window.addEventListener('open-dharani-offer-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-dharani-offer-modal', handleOpenModal);
    };
  }, [triggerSparks]);

  const handleOpenOfferModal = (e) => {
    if (e) e.stopPropagation();
    setIsModalOpen(true);
    triggerSparks();
  };

  const handleCloseModal = (e) => {
    if (e) e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleAction = () => {
    const current = offers[currentIndex];
    handleCloseModal();
    if (current?.link) {
      if (current.link.startsWith('http')) {
        window.open(current.link, '_blank');
      } else {
        navigate(current.link);
      }
    } else {
      navigate('/shop');
    }
  };

  const handleTouchStart = (e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current || offers.length <= 1) return;
    const dist = touchStartRef.current - touchEndRef.current;
    if (dist > 45) nextSlide();
    if (dist < -45) prevSlide();
  };

  if (isExcludedRoute) return null;

  const currentOffer = offers[currentIndex] || offers[0] || DEFAULT_FEATURED_OFFERS[0];

  return (
    <>
      {/* 🌿 DHARANI MASCOT SPEECH BUBBLE & OFFER CARD (BOTTOM-LEFT CORNER) */}
      {isCardVisible && !mascotDismissed && (
        <div
          className={`dharani-mascot-card-wrapper ${isOnProductPage ? 'on-product-page' : ''}`}
          onClick={handleOpenOfferModal}
          role="button"
          tabIndex={0}
          aria-label={isTamil ? 'ஆஃபர்களை காண்க' : 'View special offers'}
        >
          {/* Top-Right "Click me! ↘" Pointer + Green Chat/Offer Circle Button */}
          <div className="dharani-mascot-top-hint-row">
            <div className="dharani-mascot-click-hint">
              <span>{isTamil ? 'இங்கே கிளிக் செய்க! ↘' : 'Click me! ↘'}</span>
            </div>
            <button
              type="button"
              className="dharani-mascot-chat-btn"
              onClick={handleOpenOfferModal}
              aria-label="Open Offer"
              title={isTamil ? 'ஆஃபர்களை காண்க' : 'View Offers'}
            >
              <MessageCircle size={18} color="#ffffff" />
            </button>
          </div>

          <div className="dharani-mascot-container">
            {/* Mascot Character on Left */}
            <div className="dharani-mascot-avatar-box">
              <img
                src={dharaniAvatar}
                alt="Dharani Mascot"
                className="dharani-mascot-img"
              />
            </div>

            {/* Speech Bubble Card on Right */}
            <div className="dharani-mascot-speech-bubble">
              <button
                type="button"
                className="dharani-mascot-bubble-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setMascotDismissed(true);
                }}
                aria-label={isTamil ? 'மூடுக' : 'Dismiss'}
                title={isTamil ? 'மூடுக' : 'Dismiss'}
              >
                <X size={14} />
              </button>

              <p className="dharani-mascot-msg">
                {isTamil
                  ? 'உங்களுக்காக பிரத்யேக சலுகைகள் காத்திருக்கின்றன! ஆஃபர்களை காண தட்டவும்.'
                  : 'Special offers are waiting for you! Tap to view the latest deal.'}
              </p>

              <button
                type="button"
                className="dharani-mascot-cta-btn"
                onClick={handleOpenOfferModal}
              >
                <span>🎁 {isTamil ? 'ஆஃபர்களை காண்க →' : 'View Offer →'}</span>
              </button>

              <div className="dharani-mascot-footer">
                <Clock size={11} />
                <span>{isTamil ? 'வரையறுக்கப்பட்ட கால சலுகை ✦' : 'Limited Time Offer ✦'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌿 MINIMIZED FLOATING MASCOT BUTTON (When speech bubble is dismissed) */}
      {isCardVisible && mascotDismissed && (
        <div
          className={`dharani-mascot-minimized-trigger ${isOnProductPage ? 'on-product-page' : ''}`}
          onClick={() => {
            setMascotDismissed(false);
            setIsModalOpen(true);
            triggerSparks();
          }}
          role="button"
          tabIndex={0}
          title={isTamil ? 'சிறப்பு ஆஃபர்கள்' : 'Special Offers'}
          aria-label={isTamil ? 'ஆஃபர்களை காண்க' : 'View special offers'}
        >
          <img src={dharaniAvatar} alt="Dharani Mascot" className="minimized-avatar-img" />
          <span className="minimized-offer-badge">
            <Gift size={10} />
            <span>OFFER</span>
          </span>
        </div>
      )}

      {/* 🌿 BOTANICAL OFFER POPUP MODAL (REVEALED ON CLICK) */}
      {isModalOpen && (
        <div
          className="herbal-offer-modal-overlay"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="offer-modal-title"
        >
          <div
            className="herbal-offer-modal-card"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Card Header with Category/Tag & Close Button */}
            <div className="herbal-offer-mascot-modal-header">
              <div className="herbal-offer-mascot-left">
                <img src={dharaniAvatar} alt="Dharani" className="herbal-modal-avatar-thumb" />
                <div>
                  <h4 className="herbal-modal-avatar-title">{isTamil ? "வணக்கம்! நான் தரணி 🌿" : "Hi! I'm Dharani 🌿"}</h4>
                  <p className="herbal-modal-avatar-sub">{isTamil ? "உங்களுக்கான சிறப்பு சலுகைகள்!" : "Special offers waiting for you!"}</p>
                </div>
              </div>
              <button
                type="button"
                className="herbal-offer-close-btn"
                onClick={handleCloseModal}
                aria-label={isTamil ? 'மூடுக' : 'Close offer'}
                title={isTamil ? 'மூடுக' : 'Close'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Image Frame */}
            {(() => {
              const isHeroBanner =
                currentOffer.image === wildTurmericBannerImg ||
                (currentOffer.productName && currentOffer.productName.toLowerCase().includes('turmeric') && !currentOffer.image?.includes('wp-content'));
              return (
                <div
                  className={`herbal-offer-image-frame ${isHeroBanner ? 'has-hero-banner' : 'has-product-stage'}`}
                  onClick={handleAction}
                  title={isTamil ? 'தயாரிப்பை காண்க' : 'View product details'}
                >
                  <img
                    key={currentOffer.id + (currentOffer.image || '')}
                    src={currentOffer.image || sathuMaavuImg}
                    alt={currentOffer.productName || currentOffer.offerTitle}
                    className={`herbal-offer-img ${isHeroBanner ? 'is-hero-banner' : 'is-product-thumb'}`}
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = sathuMaavuImg;
                    }}
                  />

                  {/* Discount Percentage Badge Over Image */}
                  {currentOffer.discountPercentage && (
                    <div className="herbal-offer-badge">
                      <span>
                        {currentOffer.discountPercentage}% {isTamil ? 'தள்ளுபடி' : 'OFF'}
                      </span>
                    </div>
                  )}

                  {/* Slider Arrows if multiple offers */}
                  {offers.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="herbal-offer-nav-btn left"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevSlide();
                        }}
                        aria-label="Previous Offer"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        className="herbal-offer-nav-btn right"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextSlide();
                        }}
                        aria-label="Next Offer"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>
              );
            })()}

            {/* Content Body: Title, Product Name, Pricing, Live Countdown Timer, Shop Now Button */}
            <div className="herbal-offer-modal-body">
              {currentOffer.offerTitle && (
                <span className="herbal-offer-badge-title">{currentOffer.offerTitle}</span>
              )}

              {currentOffer.productName && (
                <h3 id="offer-modal-title" className="herbal-offer-product-name">
                  {currentOffer.productName}
                </h3>
              )}

              {currentOffer.subtitle && (
                <p className="herbal-offer-subtitle">{currentOffer.subtitle}</p>
              )}

              {/* Real Pricing Block */}
              {(currentOffer.finalPrice !== null || currentOffer.originalPrice !== null) && (
                <div className="herbal-offer-pricing-row">
                  {currentOffer.finalPrice !== null && (
                    <span className="herbal-offer-final-price">
                      {formatPriceValue(currentOffer.finalPrice)}
                    </span>
                  )}
                  {currentOffer.originalPrice !== null &&
                    currentOffer.originalPrice > (currentOffer.finalPrice || 0) && (
                      <span className="herbal-offer-original-price">
                        {formatPriceValue(currentOffer.originalPrice)}
                      </span>
                    )}
                  {currentOffer.discountPercentage && (
                    <span className="herbal-offer-discount-chip">
                      {currentOffer.discountPercentage}% {isTamil ? 'தள்ளுபடி' : 'OFF'}
                    </span>
                  )}
                </div>
              )}

              {/* ⏱️ Live Deal Countdown Urgency Timer Box */}
              <div className="herbal-offer-timer-box">
                <div className="herbal-timer-header">
                  <Clock size={13} className="herbal-timer-clock-icon" />
                  <span>
                    {isTamil ? 'ஆஃபர் முடிவடையும் நேரம்' : 'OFFER ENDS IN'}
                  </span>
                </div>
                <div className="herbal-timer-digits">
                  <div className="herbal-timer-block">
                    <span className="herbal-timer-val">{timeLeft.hours}</span>
                    <span className="herbal-timer-lbl">{isTamil ? 'மணி' : 'HRS'}</span>
                  </div>
                  <span className="herbal-timer-sep">:</span>
                  <div className="herbal-timer-block">
                    <span className="herbal-timer-val">{timeLeft.minutes}</span>
                    <span className="herbal-timer-lbl">{isTamil ? 'நிமி' : 'MIN'}</span>
                  </div>
                  <span className="herbal-timer-sep">:</span>
                  <div className="herbal-timer-block">
                    <span className="herbal-timer-val">{timeLeft.seconds}</span>
                    <span className="herbal-timer-lbl">{isTamil ? 'நொடி' : 'SEC'}</span>
                  </div>
                </div>
              </div>

              {/* Shop Now Action Button */}
              <button
                type="button"
                className="herbal-offer-action-btn"
                onClick={handleAction}
              >
                <ShoppingBag size={17} />
                <span>{isTamil ? 'இப்போதே வாங்க' : 'Shop Now'}</span>
              </button>

              {/* Slide Dots if multiple */}
              {offers.length > 1 && (
                <div className="herbal-offer-dots" role="tablist">
                  {offers.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`herbal-offer-dot ${idx === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to offer ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
