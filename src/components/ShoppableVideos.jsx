import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import './ShoppableVideos.css';

// Reel Thumbs / Posters
import p1 from '../assets/1.png';
import p2 from '../assets/2.png';
import p3 from '../assets/3.png';
import p4 from '../assets/6.png';
import p5 from '../assets/5.png';
import post1 from '../assets/4.png';
import post2 from '../assets/7.png';
import post3 from '../assets/8.png';
import s1 from '../assets/S1.jpeg';
import s2 from '../assets/S2.jpeg';
import s3 from '../assets/S3.jpeg';
import s4 from '../assets/S4.jpeg';
import s5 from '../assets/S5.jpeg';
import s6 from '../assets/S6.jpeg';

const socialMediaData = [
  { id: 1, type: 'reel', videoUrl: '/videos/Carrot%20Malt(JAR).mp4', productImg: p1, title: 'Carrot Malt Drink', subtitle: 'Nourishing herbal recipe', price: '₹249' },
  { id: 3, type: 'reel', videoUrl: '/videos/Beetroot%20Malt(JAR).mp4', productImg: p2, title: 'Beetroot Malt Daily', subtitle: 'Glowing skin nutrition', price: '₹249' },
  { id: 5, type: 'reel', videoUrl: '/videos/MULTANI%20MITTI.mp4', productImg: p3, title: 'Multani Mitti Pack', subtitle: 'Deep skin cleansing clay', price: '₹120' },
  { id: 7, type: 'reel', videoUrl: '/videos/PAASI%20PAYIR.mp4', productImg: p4, title: 'Paasi Payir Powder', subtitle: 'Ancient herbal body wash', price: '₹180' },
  { id: 9, type: 'reel', videoUrl: '/videos/Wild%20Turmeric.mp4', productImg: p5, title: 'Wild Turmeric Glow', subtitle: 'Authentic Kasturi Manjal', price: '₹140' },
  { id: 10, type: 'post', imgUrl: s5, title: 'Siddha Wisdom', subtitle: 'Holistic healing care', price: '₹200' },
  { id: 11, type: 'post', imgUrl: s6, title: 'Daily Essentials', subtitle: 'Pure farm to home', price: '₹150' },
  { id: 2, type: 'post', imgUrl: post1, title: 'Hair Growth Care', subtitle: 'Pure Katralai Shampoo', price: '₹140' },
  { id: 8, type: 'post', imgUrl: s4, title: 'Herbal Wellness', subtitle: 'Daily pure living', price: '₹350' }
];

function InstaIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

function SocialCard({ item, addToCart }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (cardRef.current) observer.unobserve(cardRef.current);
        }
      }, { rootMargin: '0px' });
      if (cardRef.current) observer.observe(cardRef.current);
      cardRef.current._observer = observer;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`social-card ${item.type}`} ref={cardRef}>
      {/* Background Media */}
      <div className="social-media-bg">
        {item.type === 'reel' ? (
          isIntersecting && (
            <video
              src={item.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )
        ) : (
          <img src={item.imgUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>

      {/* Top Left Badge */}
      <div className={`social-badge ${item.type}`}>
        <InstaIcon size={14} color="#fff" />
        <span>{item.type === 'reel' ? 'Reel' : 'Post'}</span>
      </div>

      {/* Play Icon for Reels */}
      {item.type === 'reel' && (
        <div className="social-play-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(0,0,0,0.5)" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" fill="#fff" />
          </svg>
        </div>
      )}

      {item.type === 'reel' ? (
        <>
          {/* Title Overlay in Video */}
          <div className="social-gradient"></div>
          <div className="social-video-title">
            {item.title}
          </div>

          {/* Bottom Product Strip (Vilvah Style) */}
          <div className="social-product-strip">
            <div className="social-product-img">
              <img src={item.productImg || item.imgUrl} alt={item.title} />
            </div>
            <div className="social-product-prices">
              <span className="social-product-price">{item.price}</span>
              <span className="social-product-old-price">₹{parseInt(item.price.replace(/[^0-9]/g, '')) + 100}</span>
            </div>
            <button className="social-product-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart({ id: item.id, name: item.title, price: item.price, image: item.productImg || item.imgUrl }); }}>
              Cart
            </button>
          </div>
        </>
      ) : (
        /* Post Style (Square with Arrow Button) */
        <div className="social-post-overlay">
          <a href="https://www.instagram.com/dharani_herbbals" target="_blank" rel="noopener noreferrer" className="social-post-arrow-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

export default function ShoppableVideos() {
  const { t } = useLanguage();
  const sliderRef = useRef(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const scrollLeft = () => sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  return (
    <div className="shoppable-videos-container">
      {/* Header Section */}
      <div className="social-header-section">
        <div className="social-header-left">
          <div className="social-handle-pill">
            <InstaIcon size={16} /> @dharani_herbbals
          </div>
          <h2 className="social-section-title">{t('communityHighlights')}</h2>
          <p className="social-section-subtitle">{t('communitySub')}</p>
        </div>
        <div className="social-header-right">
          <a href="https://www.instagram.com/dharani_herbbals" target="_blank" rel="noopener noreferrer" className="social-follow-btn">
            <InstaIcon size={18} /> {t('followOnInstagram')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 4}}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>

      <div className="sv-wrapper reveal">
        <button className="sv-nav-btn left" onClick={scrollLeft} aria-label="Scroll left">
          <ChevronLeft size={24} />
        </button>

        <div className="sv-track" ref={sliderRef}>
          {socialMediaData.map((item) => (
            <SocialCard key={item.id} item={item} addToCart={addToCart} navigate={navigate} />
          ))}
        </div>

        <button className="sv-nav-btn right" onClick={scrollRight} aria-label="Scroll right">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
