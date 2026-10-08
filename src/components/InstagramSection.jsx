import { useEffect, useRef, useState, memo } from 'react';
import { ChevronLeft, ChevronRight, Play, ExternalLink, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import BrandLogoVideo from './BrandLogoVideo';
import './InstagramSection.css';

// Reel product thumbnails
import p1 from '../assets/1.png';
import p2 from '../assets/2.png';
import p3 from '../assets/3.png';
import p4 from '../assets/6.png';
import p5 from '../assets/5.png';

// Promotional posters
import s1 from '../assets/S1.jpeg';
import s2 from '../assets/S2.jpeg';
import s3 from '../assets/S3.jpeg';
import s4 from '../assets/S4.jpeg';
import s5 from '../assets/S5.jpeg';
import s6 from '../assets/S6.jpeg';

const INSTAGRAM_PROFILE = 'https://www.instagram.com/dharani_herbbals?igsh=NG9sbTFidTdodzN2';

// Combined Instagram feed: Reels + Posters
const SOCIAL_POSTS = [
  {
    id: 'post-1',
    type: 'reel',
    title: 'Carrot Malt Drink',
    subtitle: 'Nourishing herbal recipe',
    videoUrl: '/videos/Carrot%20Malt(JAR).mp4',
    thumbnail: p1,
    productId: 1260,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-2',
    type: 'poster',
    title: 'Hair Growth Care',
    subtitle: 'Pure Katralai Shampoo',
    image: s1,
    productId: 1260,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-3',
    type: 'reel',
    title: 'Beetroot Malt Daily',
    subtitle: 'Glowing skin nutrition',
    videoUrl: '/videos/Beetroot%20Malt(JAR).mp4',
    thumbnail: p2,
    productId: 1142,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-4',
    type: 'poster',
    title: 'Pure Skin Glow',
    subtitle: '100% natural formulation',
    image: s2,
    productId: 1142,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-5',
    type: 'reel',
    title: 'Multani Mitti Pack',
    subtitle: 'Deep skin cleansing clay',
    videoUrl: '/videos/MULTANI%20MITTI.mp4',
    thumbnail: p3,
    productId: 1243,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-6',
    type: 'poster',
    title: 'Traditional Health',
    subtitle: 'Time-tested herbal remedies',
    image: s3,
    productId: 1243,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-7',
    type: 'reel',
    title: 'Paasi Payir Powder',
    subtitle: 'Ancient herbal body wash',
    videoUrl: '/videos/PAASI%20PAYIR.mp4',
    thumbnail: p4,
    productId: 1138,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-8',
    type: 'poster',
    title: 'Herbal Wellness',
    subtitle: 'Daily pure living',
    image: s4,
    productId: 1138,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-9',
    type: 'reel',
    title: 'Wild Turmeric Glow',
    subtitle: 'Authentic Kasturi Manjal',
    videoUrl: '/videos/Wild%20Turmeric.mp4',
    thumbnail: p5,
    productId: 1248,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-10',
    type: 'poster',
    title: 'Siddha Wisdom',
    subtitle: 'Holistic healing care',
    image: s5,
    productId: 1248,
    instagramUrl: INSTAGRAM_PROFILE,
  },
  {
    id: 'post-11',
    type: 'poster',
    title: 'Daily Essentials',
    subtitle: 'Pure farm to home',
    image: s6,
    productId: 1249,
    instagramUrl: INSTAGRAM_PROFILE,
  }
];

const InstagramLogoSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const SocialCard = memo(({ item, onProductClick, onAddToCart }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (item.type !== 'reel') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [item.type]);

  const handleCardClick = (e) => {
    // If user clicked inside action buttons, let them handle it
    if (e.target.closest('button')) return;
    window.open(item.instagramUrl || INSTAGRAM_PROFILE, '_blank', 'noopener,noreferrer');
  };

  const handleMouseEnter = () => {
    if (item.type === 'reel' && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (item.type === 'reel' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`ig-card ${item.type}`}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Instagram ${item.type}: ${item.title}`}
    >
      {/* Background Media */}
      <div className="ig-card-media">
        {item.type === 'reel' ? (
          <>
            {isIntersecting ? (
              <video
                ref={videoRef}
                src={item.videoUrl}
                poster={item.thumbnail}
                muted
                loop
                playsInline
                preload="metadata"
                className="ig-video-el"
              />
            ) : (
              <img src={item.thumbnail} alt={item.title} className="ig-poster-img" loading="lazy" />
            )}
            <div className={`ig-play-badge ${isPlaying ? 'playing' : ''}`}>
              <Play size={14} fill="currentColor" />
            </div>
          </>
        ) : (
          <img src={item.image} alt={item.title} className="ig-poster-img" loading="lazy" decoding="async" />
        )}
      </div>

      {/* Top Header Badge */}
      <div className="ig-card-top">
        <span className={`ig-type-badge ${item.type}`}>
          <InstagramLogoSvg />
          <span>{item.type === 'reel' ? 'Reel' : 'Post'}</span>
        </span>
      </div>

      {/* Gradient Overlay */}
      <div className="ig-card-gradient"></div>

      {/* Bottom Info & Actions */}
      <div className="ig-card-bottom">
        <div className="ig-card-text">
          <h4 className="ig-card-title">{item.title}</h4>
          <p className="ig-card-sub">{item.subtitle}</p>
        </div>

        <div className="ig-card-actions">
          <a
            href={item.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-view-link"
            onClick={(e) => e.stopPropagation()}
            title="View on Instagram"
          >
            <span>@dharani_herbbals</span>
            <ExternalLink size={12} />
          </a>
          {item.productId && (
            <button
              type="button"
              className="ig-shop-btn"
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(item.productId);
              }}
              title="Shop Product"
              aria-label="Shop Product"
            >
              <ShoppingBag size={13} />
              <span>Shop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default function InstagramSection() {
  const trackRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { language } = useLanguage();

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const cardWidth = 210; // width + gap
    const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (productId) => {
    const p = products?.find((prod) => prod.id === productId);
    if (p) addToCart(p);
    else navigate(`/product/${productId}`);
  };

  return (
    <section className="ig-section-root" aria-label="Instagram Community Feed">
      <div className="ig-header-bar">
        <div className="ig-header-left">
          <div className="ig-brand-pill">
            <InstagramLogoSvg />
            <span>@dharani_herbbals</span>
          </div>
          <h2 className="ig-section-title">
            {language === 'ta' ? 'எங்கள் சமூக ஊடகங்கள் & ரீல்ஸ்' : 'Community & Social Highlights'}
          </h2>
          <p className="ig-section-desc">
            {language === 'ta'
              ? 'அன்றாட மூலிகைப் பயன்பாடுகள், குறிப்புகள் மற்றும் புதிய தகவல்கள்'
              : 'Real formulations, wellness tips & authentic Ayurvedic lifestyle updates'}
          </p>
        </div>

        <div className="ig-header-right">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-follow-btn"
          >
            <InstagramLogoSvg />
            <span>{language === 'ta' ? 'இன்ஸ்டாகிராமில் பின்தொடரவும்' : 'Follow on Instagram'}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Carousel Wrapper */}
      <div className="ig-carousel-wrapper">
        <button
          type="button"
          className="ig-nav-arrow left"
          onClick={() => handleScroll('left')}
          aria-label="Scroll Instagram posts left"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="ig-carousel-track" ref={trackRef}>
          {SOCIAL_POSTS.map((item) => (
            <SocialCard
              key={item.id}
              item={item}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        <button
          type="button"
          className="ig-nav-arrow right"
          onClick={() => handleScroll('right')}
          aria-label="Scroll Instagram posts right"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
