import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import BrandLogoVideo from './BrandLogoVideo';
import './ShoppableVideos.css';

// Product images
import p1 from '../assets/1.png';
import p2 from '../assets/2.png';
import p3 from '../assets/3.png';
import p4 from '../assets/6.png';
import p5 from '../assets/5.png';

const baseVideoData = [
  { id: 1, videoUrl: '/videos/Carrot%20Malt(JAR).mp4', productImg: p1, title: 'CARROT MALT', price: '₹249' },
  { id: 2, videoUrl: '/videos/Beetroot%20Malt(JAR).mp4', productImg: p2, title: 'BEETROOT MALT', price: '₹249' },
  { id: 3, videoUrl: '/videos/MULTANI%20MITTI.mp4', productImg: p3, title: 'MULTANI MITTI', price: '₹120' },
  { id: 4, videoUrl: '/videos/PAASI%20PAYIR.mp4', productImg: p4, title: 'PAASI PAYIR', price: '₹180' },
  { id: 5, videoUrl: '/videos/Wild%20Turmeric.mp4', productImg: p5, title: 'WILD TURMERIC', price: '₹140' }
];

function LazyVideoCard({ item, addToCart, navigate, actualProduct }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    // Defer attaching the observer to allow critical assets to load first on mobile data
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            if (cardRef.current) {
              observer.unobserve(cardRef.current);
            }
          }
        },
        { rootMargin: '0px' }
      );
      if (cardRef.current) observer.observe(cardRef.current);
      
      // Store observer in ref to disconnect later if needed
      cardRef.current._observer = observer;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cardRef.current && cardRef.current._observer) {
        cardRef.current._observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="sv-card ultra" ref={cardRef}>
      <div className="sv-video-bg">
        {isIntersecting && (
          <video
            className="sv-iframe" // Keep class for dimensions
            src={item.videoUrl}
            title={item.title}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
              zIndex: 1
            }}
          />
        )}
      </div>
      
      <div className="sv-gradient-overlay"></div>

      <div className="sv-glass-panel">
        <div 
          className="sv-product-img-wrapper" 
          onClick={() => actualProduct && navigate(`/product/${actualProduct.id}`)}
          style={{ cursor: actualProduct ? 'pointer' : 'default' }}
        >
          {item.productImg && <img src={item.productImg} alt={actualProduct?.name || item.title} className="sv-product-img" loading="lazy" />}
        </div>
        <div 
          className="sv-product-details"
          onClick={() => actualProduct && navigate(`/product/${actualProduct.id}`)}
          style={{ cursor: actualProduct ? 'pointer' : 'default' }}
        >
          <h4 className="sv-product-title">{actualProduct?.name || item.title}</h4>
          <div className="sv-product-price">{actualProduct?.price || item.price}</div>
        </div>
        <button 
          className="sv-buy-btn" 
          onClick={() => addToCart(actualProduct || { id: item.id, name: item.title, price: item.price, image: item.productImg })}
        >
          <ShoppingBag size={18} />
        </button>
      </div>
    </div>
  );
}

export default function ShoppableVideos() {
  const sliderRef = useRef(null);
  const { addToCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const videoData = baseVideoData;

  const scrollLeft = () => sliderRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  const scrollRight = () => sliderRef.current?.scrollBy({ left: 320, behavior: 'smooth' });

  return (
    <div className="shoppable-videos-container">
      <div className="reveal bento-header" style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(34,197,94,0.1) 100%)', borderColor: 'rgba(74,222,128,0.3)' }}>
          {/* Decorative background blob */}
          <div className="bento-header-blob right"></div>
          
          <div className="bento-title-col">
            <h2 className="bento-title-text">
              <BrandLogoVideo />
              {(() => {
                const words = t('shopReelsTitle').split(' ');
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
              {t('shopReelsDesc')}
            </p>
          </div>
        </div>

      <div className="sv-wrapper reveal">
        <button className="sv-nav-btn left" onClick={scrollLeft} aria-label="Scroll left">
          <ChevronLeft size={24} />
        </button>

        <div className="sv-track" ref={sliderRef}>
          {videoData.map((item) => {
            // Find the actual product by matching the title/name
            const actualProduct = products?.find(
              (p) => p.name.toUpperCase().includes(item.title.toUpperCase()) || item.title.toUpperCase().includes(p.name.toUpperCase())
            );
            return (
              <LazyVideoCard 
                key={item.id} 
                item={item} 
                addToCart={addToCart} 
                navigate={navigate}
                actualProduct={actualProduct}
              />
            );
          })}
        </div>

        <button className="sv-nav-btn right" onClick={scrollRight} aria-label="Scroll right">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
