import { useEffect, useState, lazy, Suspense, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import { useCart } from './context/CartContext';
import { useProducts } from './context/ProductsContext';
import { useLanguage } from './context/LanguageContext';
import { useWishlist } from './context/WishlistContext';
import ImageSlider from './components/ImageSlider';
import { Heart, Leaf, Shield, CheckCircle, Package } from 'lucide-react';
import { API_BASE_URL } from './services/api';
import ShoppableVideos from './components/ShoppableVideos';

// Critical components loaded synchronously
import Shop, { ProductCard } from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';

// Lazy loaded routes for better performance on less frequent pages
import Login from './pages/Login';

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

  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/most-loved/`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map(p => {
            const n = p.name ? p.name.toLowerCase().trim() : '';
            let injectedRating = p.rating || "0.0";
            let injectedReviews = p.reviews || 0;

            if (n === 'chemparuthi herbal shampoo') injectedRating = 5.0;
            if (n === 'onion shampoo') injectedRating = 5.0;
            if (n === 'rice kanji shampoo') injectedRating = 5.0;
            if (n === 'avarampoo pusu manjal jar') injectedRating = 4.0;
            if (n === 'multhani metti jar') injectedRating = 5.0;
            if (n === 'wild turmeric') injectedRating = 4.0;
            if (n === 'aloe vera facepack powder jar (for men)') injectedRating = 5.0;
            if (n === 'facepack powder(jar)') injectedRating = 5.0;
            if (n === 'nalangu powder jar') injectedRating = 4.5;
            if (n === 'multhani metti soap') injectedRating = 5.0;
            if (n === 'aloe vera soap') injectedRating = 5.0;
            if (n === 'balloon plant oil') injectedRating = 4.0;
            if (n === 'amutham nattu charkkarai') injectedRating = 5.0;
            if (n === 'karuppu kavuni rice') injectedRating = 5.0;
            if (n === 'kodo - moringa millet pongal mix 250g') injectedRating = 3.0;
            if (n === 'abc malt (jar)') injectedRating = 5.0;
            if (n === 'pirandai pickle') injectedRating = 5.0;
            if (n === 'ooty varkey') injectedRating = 5.0;

            if (n === 'chemparuthi herbal shampoo') injectedReviews = 4;
            if (n === 'onion shampoo') injectedReviews = 1;
            if (n === 'rice kanji shampoo') injectedReviews = 2;
            if (n === 'avarampoo pusu manjal jar') injectedReviews = 1;
            if (n === 'multhani metti jar') injectedReviews = 2;
            if (n === 'wild turmeric') injectedReviews = 1;
            if (n === 'aloe vera facepack powder jar (for men)') injectedReviews = 1;
            if (n === 'facepack powder(jar)') injectedReviews = 3;
            if (n === 'nalangu powder jar') injectedReviews = 2;
            if (n === 'multhani metti soap') injectedReviews = 1;
            if (n === 'aloe vera soap') injectedReviews = 1;
            if (n === 'balloon plant oil') injectedReviews = 1;
            if (n === 'amutham nattu charkkarai') injectedReviews = 1;
            if (n === 'karuppu kavuni rice') injectedReviews = 1;
            if (n === 'kodo - moringa millet pongal mix 250g') injectedReviews = 1;
            if (n === 'abc malt (jar)') injectedReviews = 1;
            if (n === 'pirandai pickle') injectedReviews = 1;
            if (n === 'ooty varkey') injectedReviews = 1;

            if (injectedRating === "0.0" || injectedRating == 0) injectedReviews = 0;

            return { ...p, rating: injectedRating, reviews: injectedReviews };
        });
        setFeaturedProducts(mappedData);
      })
      .catch(err => console.error("Error fetching most loved products:", err));
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
    <div style={{ width: '100%', paddingTop: '140px', background: '#fff' }}>
      
      {/* 1. Shop by Category (Moved to top as requested) */}
      <section style={{ padding: '20px 5% 40px 5%', textAlign: 'center', background: '#fff' }}>
        <CategoryStrip />
      </section>

      {/* 2. Full Image Hero Section */}
      <section style={{ 
        position: 'relative', 
        width: 'calc(100% - 40px)', 
        margin: '0 auto',
        height: 'calc(100vh - 140px)',
        background: 'url(/hero-mockup.jpg) center/cover no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        borderRadius: '30px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <Link to="/shop" style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
           {/* Invisible clickable overlay over the whole image so they can click the button in the image */}
        </Link>
      </section>

      {/* 3. Trending Products Section */}
      <section style={{ padding: '60px 5%', background: '#fff' }}>
        {/* Shopify-style Header Banner */}
        <div style={{ 
          background: '#e8f3ec', 
          borderRadius: '16px', 
          padding: '30px 40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 400px' }}>
            <Leaf size={48} color="#166534" />
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '3rem', color: '#0f172a', margin: 0, fontStyle: 'italic' }}>Our Most Loved Picks.</h2>
          </div>
          <div style={{ flex: '1 1 400px', borderLeft: '2px solid #cbd5e1', paddingLeft: '30px' }}>
            <p style={{ color: '#334155', fontSize: '1.2rem', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
              Immerse yourself in our quintessential collection of highly sought after botanical remedies, meticulously crafted to deliver an uncompromised standard of holistic nourishment and transformative wellness.
            </p>
          </div>
        </div>

        {/* Vilvah-style Product Cards */}
        <div style={{ flex: 1, overflowX: 'auto', paddingBottom: '40px' }}>
          <div className="shop-grid" style={{ display: 'flex', gap: '24px', minWidth: 'max-content', padding: '10px 0' }}>
            {featuredProducts.slice(0, 6).map((product) => (
              <div key={product.id} style={{ width: '280px', height: 'auto', display: 'flex' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 4.5 Shoppable Videos (Insta Reels) */}
      <ShoppableVideos />


      <Suspense fallback={<div style={{ height: '50vh' }}></div>}>
        {/* Remaining original sections (Reviews, Trust Badges, etc) */}
        <div className="reveal">
          <GoogleReviews />
        </div>
        <div className="reveal">
          <OurJourney />
        </div>
        <div className="reveal">
          <TrustBadges />
        </div>
      </Suspense>


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
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPoliciesRoute = location.pathname === '/policies';

  return (
    <div className="app-container">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      {/* Direct /cart navigation is now active */}
      {!isAdminRoute && !isPoliciesRoute && <FloatingSocials />}
      {!isAdminRoute && !isPoliciesRoute && <GlobalOrderPopup />}
      <Suspense fallback={null}>
        {!isAdminRoute && <Login />}
      </Suspense>
      <WishlistToastNotification />
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
