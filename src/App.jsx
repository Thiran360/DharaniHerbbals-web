import { useEffect, useState, lazy, Suspense, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import { useCart } from './context/CartContext';
import { useProducts } from './context/ProductsContext';
import { useLanguage } from './context/LanguageContext';
import { useWishlist } from './context/WishlistContext';
import ImageSlider from './components/ImageSlider';
import { Heart } from 'lucide-react';

// Critical components loaded synchronously
import Shop, { ProductCard } from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';

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

import './App.css';
import './pages/Shop.css'; // Reuse shop styles for grid

import CategoryStrip from './components/CategoryStrip';
import BrandsSlider from './components/BrandsSlider';
import FloatingSocials from './components/FloatingSocials';
import BrandLogoVideo from './components/BrandLogoVideo';

const ShoppableVideos = lazy(() => import('./components/ShoppableVideos'));
const GoogleReviews = lazy(() => import('./components/GoogleReviews'));
const HandpickedDeals = lazy(() => import('./components/HandpickedDeals'));
import OurJourney from './components/OurJourney';
import Footer from './components/Footer';
const TrustBadges = lazy(() => import('./components/TrustBadges'));

import s1 from './assets/S1.jpeg';
import s2 from './assets/S2.jpeg';
import s3 from './assets/S3.jpeg';
import s4 from './assets/S4.jpeg';
import s5 from './assets/S5.jpeg';
import s6 from './assets/S6.jpeg';
import GlobalOrderPopup from './components/GlobalOrderPopup';
// Using dynamic products now from ProductsContext

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
    let timeoutId = null;
    let intervalId = null;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        const container = promoSliderRef.current;
        if (!container || isInteracting) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        const cardWidth = 296; // 280px card width + 16px gap

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
      if (container) {
        container.removeEventListener('touchstart', handleInteraction);
        container.removeEventListener('mousedown', handleInteraction);
      }
    };
  }, [isMobile]);

<<<<<<< HEAD
  const [mostLovedIds, setMostLovedIds] = useState([]);

  useEffect(() => {
    fetch('https://api.codingboss.in/herbal/most-loved/', {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMostLovedIds(data.map(p => p.id));
        }
      })
      .catch(err => console.error("Error fetching most loved:", err));
  }, []);

  let featuredProducts = [];
  if (mostLovedIds.length > 0) {
    // Preserve order from API
    mostLovedIds.forEach(id => {
      const p = products.find(prod => prod.id === id);
      if (p) featuredProducts.push(p);
    });
  }

=======
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/most-loved/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => setFeaturedProducts(data))
      .catch(err => console.error("Error fetching most loved products:", err));
  }, []);

>>>>>>> master
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
      {/* Full-width Image Slider */}
      <ImageSlider />

      <CategoryStrip />

      <BrandsSlider />

      <div className="page-container" style={{ paddingTop: '20px' }}>

        {/* Featured Products Section (Ultra UI Bestsellers) */}
        <div className="reveal bento-header" style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(34,197,94,0.1) 100%)', borderColor: 'rgba(74,222,128,0.3)' }}>
          {/* Decorative background blob */}
          <div className="bento-header-blob left"></div>

          <div className="bento-title-col">
            <h2 className="bento-title-text">
              <BrandLogoVideo />
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
          {/* Handpicked Deals Section */}
          <div className="reveal" style={{ marginTop: '40px' }}>
            <HandpickedDeals />
          </div>

          {/* Shoppable Videos Section */}
          <div className="reveal">
            <ShoppableVideos />
          </div>

          {/* Bento Grid Ads Section */}
          <div className="reveal bento-header with-margin-top" style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(34,197,94,0.1) 100%)', borderColor: 'rgba(74,222,128,0.3)' }}>
            {/* Decorative background blob */}
            <div className="bento-header-blob left"></div>

            <div className="bento-title-col">
              <h2 className="bento-title-text">
                <BrandLogoVideo />
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

          {/* Google Reviews Marquee Section */}
          <div className="reveal">
            <GoogleReviews />
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
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPoliciesRoute = location.pathname === '/policies';

  return (
    <div className="app-container">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && !isPoliciesRoute && <FloatingSocials />}
      {!isAdminRoute && !isPoliciesRoute && <GlobalOrderPopup />}
      {!isAdminRoute && <Login />}
      <main className="main-content" style={isAdminRoute ? { padding: 0 } : {}}>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#15803d' }}>Loading...</div>}>
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
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/policies" element={<PrivacyPolicy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>

  );
}

function WishlistToastNotification() {
  const { recentWishlistAction } = useWishlist();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { language } = useLanguage();
  let timerRef = useRef(null);

  useEffect(() => {
    if (recentWishlistAction && recentWishlistAction.type === 'added') {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 3000);
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
      <Heart size={20} fill="#22c55e" color="#22c55e" />
      <span>{language === 'ta' ? 'விருப்பப்பட்டியலில் சேர்க்கப்பட்டது' : 'Added to Wishlist'}</span>
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
