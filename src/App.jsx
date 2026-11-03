import React, { useEffect, useState, lazy, Suspense, useRef, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from './components/Navbar';
import NetworkStatus from './components/NetworkStatus';
import CartDrawer from './components/CartDrawer';
import GlobalToast from './components/GlobalToast';
import { useCart } from './context/CartContext';
import { useProducts } from './context/ProductsContext';
import { useLanguage } from './context/LanguageContext';
import { useWishlist } from './context/WishlistContext';
import { useAuthModal } from './context/AuthModalContext';
import ImageSlider from './components/ImageSlider';
import { Heart } from 'lucide-react';
import { API_BASE_URL } from './services/api';

// Synchronous shared components
import ProductCard from './components/ProductCard';

// Lazy loaded page routes for optimal mobile performance and smaller initial bundle
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Lazy loaded routes for better performance on less frequent pages
const Login = lazy(() => import('./pages/Login'));

const Admin = lazy(() => import('./pages/Admin'));
const Profile = lazy(() => import('./pages/Profile'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const OtpVerification = lazy(() => import('./pages/OtpVerification'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Cart = lazy(() => import('./pages/Cart'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Faq = lazy(() => import('./pages/Faq'));
const BundleLanding = lazy(() => import('./pages/BundleLanding'));
const ProductAdLanding = lazy(() => import('./pages/ProductAdLanding'));
const ComboOffersSection = lazy(() => import('./components/ComboOffersSection'));
import SeoHead from './components/SeoHead';

import './App.css';
import './pages/Shop.css'; // Reuse shop styles for grid

import CategoryStrip from './components/CategoryStrip';
import BrandsSlider from './components/BrandsSlider';
import FloatingSocials from './components/FloatingSocials';

const ShoppableVideos = lazy(() => import('./components/ShoppableVideos'));
const GoogleReviews = lazy(() => import('./components/GoogleReviews'));
const HandpickedDeals = lazy(() => import('./components/HandpickedDeals'));
const OurJourney = lazy(() => import('./components/OurJourney'));
import Footer from './components/Footer';
const TrustBadges = lazy(() => import('./components/TrustBadges'));



import s1 from './assets/S1.webp';
import s2 from './assets/S2.webp';
import s3 from './assets/S3.webp';
import s4 from './assets/S4.webp';
import s5 from './assets/S5.webp';
import s6 from './assets/S6.webp';
import GlobalOrderPopup from './components/GlobalOrderPopup';
import SliderPopup from './components/SliderPopup';
// Using dynamic products now from ProductsContext

// Error Boundary to catch lazy-loaded page crashes
class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Route Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '120px 20px 60px', textAlign: 'center', minHeight: '60vh' }}>
          <h2 style={{ color: '#ef4444' }}>Something went wrong</h2>
          <p style={{ color: '#64748b', margin: '12px 0' }}>{this.state.error?.message || 'Unknown error'}</p>
          <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            style={{ padding: '10px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Home() {
  const { products } = useProducts();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const promoSliderRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    let isInteracting = false;
    let isVisible = false;
    let timeoutId = null;
    let intervalId = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (promoSliderRef.current) observer.observe(promoSliderRef.current);

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        const container = promoSliderRef.current;
        if (!container || isInteracting || !isVisible) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        const cardWidth = 296;

        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }, 3500);
    };

    const handleInteraction = () => {
      isInteracting = true;
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        isInteracting = false;
        startAutoScroll();
      }, 6000);
    };

    const container = promoSliderRef.current;
    if (container) {
      container.addEventListener('touchstart', handleInteraction, { passive: true });
      container.addEventListener('mousedown', handleInteraction);
    }

    startAutoScroll();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
      if (container) {
        container.removeEventListener('touchstart', handleInteraction);
        container.removeEventListener('mousedown', handleInteraction);
      }
    };
  }, [isMobile]);

  const [featuredProducts, setFeaturedProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('dharani_featured_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.map(p => {
            const r = (p.rating !== null && p.rating !== undefined && p.rating !== '') ? Number(p.rating) : null;
            const rev = (p.reviews !== null && p.reviews !== undefined && p.reviews !== '') ? Number(p.reviews) : null;
            const isValid = r !== null && !isNaN(r) && r > 0 && rev !== null && !isNaN(rev) && rev > 0;
            return {
              ...p,
              rating: isValid ? r : null,
              reviews: isValid ? rev : 0
            };
          });
        }
        return parsed;
      }
      return [];
    } catch { return []; }
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetch(`${API_BASE_URL}/most-loved/`, {
      signal: controller.signal,
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const mappedData = data.map(p => {
            const n = p.name ? p.name.toLowerCase().trim() : '';
            const rawRating = (p.rating !== null && p.rating !== undefined && p.rating !== '') ? Number(p.rating) : null;
            let injectedRating = (rawRating !== null && !isNaN(rawRating) && rawRating > 0) ? rawRating : null;
            const rawReviews = (p.reviews !== null && p.reviews !== undefined && p.reviews !== '') ? Number(p.reviews) : null;
            let injectedReviews = (rawReviews !== null && !isNaN(rawReviews) && rawReviews > 0) ? rawReviews : 0;

            if (n === 'chemparuthi herbal shampoo') { injectedRating = 5.0; injectedReviews = 4; }
            else if (n === 'onion shampoo') { injectedRating = 5.0; injectedReviews = 1; }
            else if (n === 'rice kanji shampoo') { injectedRating = 5.0; injectedReviews = 2; }
            else if (n === 'avarampoo pusu manjal jar') { injectedRating = 4.0; injectedReviews = 1; }
            else if (n === 'multhani metti jar') { injectedRating = 5.0; injectedReviews = 2; }
            else if (n === 'wild turmeric') { injectedRating = 4.0; injectedReviews = 1; }
            else if (n === 'aloe vera facepack powder jar (for men)') { injectedRating = 5.0; injectedReviews = 1; }
            else if (n === 'facepack powder(jar)') { injectedRating = 5.0; injectedReviews = 3; }
            else if (n === 'nalangu powder jar') { injectedRating = 4.5; injectedReviews = 2; }
            else if (n === 'multhani metti soap') { injectedRating = 5.0; injectedReviews = 1; }
            else if (n === 'aloe vera soap') { injectedRating = 5.0; injectedReviews = 1; }
            else if (n === 'balloon plant oil') { injectedRating = 4.0; injectedReviews = 1; }
            else if (n === 'amutham nattu charkkarai') { injectedRating = 5.0; injectedReviews = 1; }
            else if (n === 'karuppu kavuni rice') { injectedRating = 5.0; injectedReviews = 1; }
            else if (n === 'kodo - moringa millet pongal mix 250g') { injectedRating = 3.0; injectedReviews = 1; }
            else if (n === 'abc malt (jar)') { injectedRating = 5.0; injectedReviews = 1; }
            else if (n === 'pirandai pickle') { injectedRating = 5.0; injectedReviews = 1; }
            else if (n === 'ooty varkey') { injectedRating = 5.0; injectedReviews = 1; }

            const isValid = injectedRating !== null && !isNaN(injectedRating) && injectedRating > 0 && injectedReviews > 0;

            return {
              ...p,
              rating: isValid ? injectedRating : null,
              reviews: isValid ? injectedReviews : 0
            };
        });
        setFeaturedProducts(mappedData);
        try { localStorage.setItem('dharani_featured_cache', JSON.stringify(mappedData)); } catch(e) {}
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.warn("Unable to fetch fresh most-loved products, using cached data:", err.message);
      });
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const navigate = useNavigate();

  const [promoAds] = useState([
    { img: s1, alt: "Promo 1", productId: 1260 },
    { img: s2, alt: "Promo 2", productId: 1142 },
    { img: s3, alt: "Promo 3", productId: 1243 },
    { img: s4, alt: "Promo 4", productId: 1138 },
    { img: s5, alt: "Promo 5", productId: 1248 },
    { img: s6, alt: "Promo 6", productId: 1249 }
  ]);


  return (
    <div style={{ width: '100%' }}>
      <SeoHead
        title="Dharani Herbals | Authentic Siddha & Herbal Products"
        description="Discover 100% authentic South Indian herbal products, botanical hair care, natural skincare, and traditional wellness formulations from Dharani Herbals."
        canonicalUrl="https://www.dharaniherbbals.in/"
        openGraph={{
          title: "Dharani Herbals | Authentic Siddha & Herbal Products",
          description: "Discover 100% authentic South Indian herbal products, botanical hair care, natural skincare, and traditional wellness formulations from Dharani Herbals.",
          url: "https://www.dharaniherbbals.in/",
          image: "https://www.dharaniherbbals.in/logo.png",
          type: "website"
        }}
        keywords={['dharani herbals', 'herbal products', 'siddha wellness', 'chemparuthi herbal shampoo', 'herbal hair oil', 'ayurvedic skincare']}
      />
      {/* Full-width Image Slider */}
      <ImageSlider />

      <CategoryStrip />

      <div className="page-container" style={{ paddingTop: '20px' }}>

        {/* Featured Products Section (Ultra UI Bestsellers) */}
        <div className="reveal bento-header">
          {/* Decorative background blob */}
          <div className="bento-header-blob left"></div>

          <div className="bento-title-col">
            <div className="bento-title-badge">✦ AYURVEDIC BESTSELLERS ✦</div>
            <h2 className="bento-title-text">
              {(() => {
                const words = t('featuredTitle').split(' ');
                const lastWord = words.pop();
                return (
                  <div style={{ flex: 1, minWidth: 0, wordWrap: 'break-word' }}>
                    {words.join(' ')} <span className="highlight">{lastWord}</span>
                  </div>
                );
              })()}
            </h2>
          </div>

          <div className="bento-desc-col">
            <p className="bento-desc-text">
              {t('featuredSubtitle')}
            </p>
          </div>
        </div>

        {/* Reuse the same ProductCard with full Tamil translation support */}
        <div className="shop-grid reveal-stagger" style={{ marginTop: '8px' }}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="reveal" style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/shop" className="btn-view-more">
            {t('viewAll')} &gt;
          </Link>
        </div>

        <Suspense fallback={<div style={{ height: '50vh' }}></div>}>
          {/* Curated Combo & Value Packs Section */}
          <div className="reveal" style={{ marginTop: '8px' }}>
            <ComboOffersSection />
          </div>

          {/* Handpicked Deals Section */}
          <div className="reveal" style={{ marginTop: '40px' }}>
            <HandpickedDeals />
          </div>

          {/* Shoppable Videos Section */}
          <div className="reveal">
            <ShoppableVideos />
          </div>

          {/* Bento Grid Ads Section */}
          <div className="reveal bento-header with-margin-top">
            {/* Decorative background blob */}
            <div className="bento-header-blob left"></div>

            <div className="bento-title-col">
              <h2 className="bento-title-text">
                <div>{t('apothecaryReserve')}</div>
              </h2>
            </div>

            <div className="bento-desc-col">
              <p className="bento-desc-text">
                {t('apothecaryDesc')}
              </p>
            </div>
          </div>

          {/* Auto-Sliding Promo Train */}
          <div ref={promoSliderRef} className="promo-slider-container reveal-stagger">
            <div className="promo-train-track">
              {(isMobile ? promoAds : [...promoAds, ...promoAds]).map((ad, index) => (
                <div key={index} className="promo-slider-item" onClick={() => navigate(`/product/${ad.productId}`)}>
                  <img src={ad.img} alt={ad.alt} className="promo-slider-img" loading="lazy" decoding="async" />
                  <div className="promo-slider-action">
                    <span className="arrow-icon">↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Journey Section */}
          <div className="reveal">
            <OurJourney />
          </div>

          {/* Trust Badges Section */}
          <div className="reveal">
            <TrustBadges />
          </div>
        </Suspense>

      </div>

      {/* Brands Slider Section */}
      <BrandsSlider />

      {/* Footer Section */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const { isLoginModalOpen } = useAuthModal();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdRoute = location.pathname.startsWith('/ad/');
  const isInfoOrPolicyRoute = [
    '/policies', '/privacy', '/terms', '/terms-and-conditions', 
    '/faqs', '/faq', '/help', '/shipping', '/shipping-policy', 
    '/refund', '/refunds', '/returns', '/return-policy', '/cancellation'
  ].includes(location.pathname);

  return (
    <div className="app-container">
      <ScrollToTop />
      {!isAdminRoute && !isAdRoute && <Navbar />}
      <NetworkStatus />
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && !isInfoOrPolicyRoute && !isAdRoute && <FloatingSocials />}
      {!isAdminRoute && !isInfoOrPolicyRoute && !isAdRoute && <GlobalOrderPopup />}
      {!isAdminRoute && !isInfoOrPolicyRoute && !isAdRoute && <SliderPopup />}
      {!isAdminRoute && isLoginModalOpen && (
        <Suspense fallback={null}>
          <Login />
        </Suspense>
      )}
      <GlobalToast />
      <WishlistToastNotification />
      <main className="main-content" style={isAdminRoute || isAdRoute ? { padding: 0 } : {}}>
        <RouteErrorBoundary>
          <Suspense
            fallback={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '14px', color: '#10b981' }}>
                <div style={{ width: '36px', height: '36px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'routeSpin 0.8s linear infinite' }} />
                <style>{`@keyframes routeSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track/:orderId" element={<OrderTracking />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/verify-otp" element={<OtpVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Navigate to="/profile" state={{ activeTab: 'wishlist' }} replace />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/combo/:bundleId" element={<BundleLanding />} />
              <Route path="/bundle/:bundleId" element={<BundleLanding />} />
              <Route path="/ad/:productId" element={<ProductAdLanding />} />
              <Route path="/privacy" element={<PrivacyPolicy initialTab="privacy" />} />
              <Route path="/policies" element={<PrivacyPolicy />} />
              <Route path="/shipping" element={<PrivacyPolicy initialTab="shipping" />} />
              <Route path="/shipping-policy" element={<PrivacyPolicy initialTab="shipping" />} />
              <Route path="/refund" element={<PrivacyPolicy initialTab="refunds" />} />
              <Route path="/refunds" element={<PrivacyPolicy initialTab="refunds" />} />
              <Route path="/returns" element={<PrivacyPolicy initialTab="refunds" />} />
              <Route path="/return-policy" element={<PrivacyPolicy initialTab="refunds" />} />
              <Route path="/cancellation" element={<PrivacyPolicy initialTab="cancellation" />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/terms-and-conditions" element={<Terms />} />
              <Route path="/faqs" element={<Faq />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/help" element={<Faq />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </main>
    </div>

  );
}

function WishlistToastNotification() {
  const { recentWishlistAction } = useWishlist();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [toastType, setToastType] = useState('added');
  const { language } = useLanguage();
  let timerRef = useRef(null);

  useEffect(() => {
    if (recentWishlistAction) {
      setToastType(recentWishlistAction.type || 'added');
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 2000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [recentWishlistAction]);

  return (
    <div
      className={`wishlist-toast ${visible ? 'visible' : ''}`}
      onClick={() => {
        setVisible(false);
        navigate('/profile', { state: { activeTab: 'wishlist' } });
      }}
    >
      <Heart size={20} fill={toastType === 'added' ? "#22c55e" : "transparent"} color={toastType === 'added' ? "#22c55e" : "#ef4444"} />
      <span>
        {toastType === 'added' 
          ? (language === 'ta' ? 'விருப்பப்பட்டியலில் சேர்க்கப்பட்டது' : 'Added to Wishlist')
          : (language === 'ta' ? 'விருப்பப்பட்டியலில் இருந்து நீக்கப்பட்டது' : 'Removed from Wishlist')}
      </span>
      <span className="wishlist-toast-view">{language === 'ta' ? 'பார்க்க' : 'View'}</span>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
