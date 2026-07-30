import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './ImageSlider.css';

import p1 from '../assets/4.png';
import p2 from '../assets/2.png';
import p4 from '../assets/heart.png';

const SLIDE_DURATION_MS = 10000;
const MIN_SWIPE_DISTANCE = 50;

const baseSlidesTemplate = [
  {
    id: 3, // Fallback
    mainTitle: "Rooted in Tradition, Crafted with Care from Handpicked Herbs for Pure and Timeless Wellness.",
    offer: 'PREMIUM QUALITY',
    productImg: p4,
    bgGradient: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)',
    link: '/shop'
  },
  {
    id: 2,
    productName: 'Makil Beetroot Malt',
    mainTitle: "Craving the Goodness of Beetroot Without the Extra Effort ?",
    offer: 'LIMITED TIME DEAL',
    originalPrice: '₹350',
    discountPrice: '₹249',
    productImg: p2,
    bgGradient: 'linear-gradient(135deg, #4A1B28 0%, #8E3547 50%, #4A1B28 100%)',
    link: '/shop'
  },
  {
    id: 1,
    productName: 'Nalangu maavu',
    mainTitle: "A Heritage of Purity in Every Bath.",
    offer: 'FLAT 20% OFF',
    originalPrice: '₹300',
    discountPrice: '₹249',
    productImg: p1,
    bgGradient: 'linear-gradient(135deg, #4A2E1B 0%, #8E5A35 50%, #4A2E1B 100%)',
    link: '/shop'
  }
];

const SliderVideo = memo(function SliderVideo({ slide, isActive }) {
  const videoRef = useRef(null);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const clipStartTime = slide.clipStartTime ?? 0;
  const hasClipRange = Number.isFinite(slide.clipEndTime);

  let baseVideoUrl = slide.bgVideo || '';
  if (baseVideoUrl && baseVideoUrl.includes('ngrok-free.dev')) {
    baseVideoUrl += (baseVideoUrl.includes('?') ? '&' : '?') + 'ngrok-skip-browser-warning=true';
  }
  const videoSrc = baseVideoUrl ? `${baseVideoUrl}${clipStartTime > 0 || hasClipRange ? '#t=' + clipStartTime + (hasClipRange ? ',' + slide.clipEndTime : '') : ''}` : '';

  useEffect(() => {
    setHasVideoError(false);
    setIsVideoReady(false);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasVideoError || !videoSrc) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log('Autoplay prevented:', e));
      }
    } else {
      video.pause();
    }
  }, [hasVideoError, videoSrc, isActive]);

  const handleTimeUpdate = (e) => {
    if (!hasClipRange) return;
    const video = e.target;
    // Native looping for clipped videos
    if (video.currentTime >= slide.clipEndTime) {
      video.currentTime = clipStartTime;
      video.play().catch(() => {});
    }
  };

  if (!videoSrc) return null;

  return (
    <video 
      key={videoSrc}
      ref={videoRef}
      loop={!hasClipRange}
      muted 
      playsInline 
      autoPlay={isActive}
      preload="auto"
      className={`slide-bg-video ${isActive ? 'active' : ''}`}
      onTimeUpdate={handleTimeUpdate}
      onError={() => setHasVideoError(true)}
      onCanPlay={() => setIsVideoReady(true)}
      style={{ 
        display: hasVideoError ? 'none' : 'block',
        visibility: isActive && isVideoReady ? 'visible' : 'hidden',
        opacity: isActive && isVideoReady ? 1 : 0, 
        transition: 'opacity 0.8s ease, visibility 0.8s ease',
        transform: 'translateZ(0)',
        willChange: 'opacity, visibility',
        backgroundColor: 'transparent'
      }}
      src={videoSrc}
    />
  );
});

const ImageSlider = function() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(baseSlidesTemplate.length - 1);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  const slides = baseSlidesTemplate.map((slide, index) => {
    let titleKey, offerKey;
    if (slide.id === 3) { titleKey = 'sliderTitle1'; offerKey = 'sliderOffer1'; }
    else if (slide.id === 2) { titleKey = 'sliderTitle2'; offerKey = 'sliderOffer2'; }
    else if (slide.id === 1) { titleKey = 'sliderTitle3'; offerKey = 'sliderOffer3'; }
    
    let bgVideoUrl = '';
    if (index === 0) bgVideoUrl = '/videos/video_1.mp4';
    else if (index === 1) bgVideoUrl = '/videos/video_2.mp4';
    else if (index === 2) bgVideoUrl = '/videos/video_3.mp4';

    return {
      ...slide,
      bgVideo: bgVideoUrl,
      mainTitle: t(titleKey),
      offer: t(offerKey)
    };
  });

  const nextSlide = useCallback(() => {
    setPrevIndex(currentIndex);
    setCurrentIndex((currentIndex + 1) % slides.length);
  }, [currentIndex, slides.length]);

  const prevSlide = useCallback(() => {
    setPrevIndex(currentIndex);
    setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  }, [currentIndex, slides.length]);

  const goToSlide = useCallback((index) => {
    if (index === currentIndex) return;
    setPrevIndex(currentIndex);
    setCurrentIndex(index);
  }, [currentIndex]);

  const handleTouchStart = useCallback((e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const touchStart = touchStartRef.current;
    const touchEnd = touchEndRef.current;
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (distance > MIN_SWIPE_DISTANCE) nextSlide();
    if (distance < -MIN_SWIPE_DISTANCE) prevSlide();
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    const timerId = window.setTimeout(nextSlide, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timerId);
  }, [nextSlide]);

  return (
    <div 
      className="slider-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        let className = 'promo-slide';
        if (index === currentIndex) className += ' active';
        else if (index === prevIndex) className += ' previous';
        if (slide.bgVideo) className += ' has-video';

        return (
          <div key={slide.id} className={className} style={{ backgroundImage: slide.bgGradient }}>
            {/* Background Video: Kept mounted but paused to ensure instant playback without delay */}
            {slide.bgVideo && (
              <SliderVideo slide={slide} isActive={index === currentIndex} />
            )}
            
            <div className="promo-layout" style={{ position: 'relative', zIndex: 2 }}>
              {/* Left Content */}
              <div className="promo-text-col">
                <h3 className="promo-small-title">{slide.productName}</h3>
                <h1 className="promo-main-title">{slide.mainTitle}</h1>
                <button className="promo-shop-btn" onClick={() => navigate(slide.link)}>{t('shopNow')}</button>
              </div>

              {/* Center Content (Product) */}
              <div className="promo-product-col">
                {slide.productImg && (
                  <div className="promo-product-animator">
                    <img 
                      src={slide.productImg} 
                      alt={slide.productName} 
                      className={`promo-product-img ${slide.id === 3 ? 'zoomed-product' : ''}`} 
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                )}
                <button className="promo-shop-btn promo-shop-btn-mobile" onClick={() => navigate(slide.link)}>{t('shopNow')}</button>
              </div>

            </div>
          </div>
        );
      })}

      {/* Navigation Arrows (Hidden on Mobile) */}
      <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous Slide">
        <ChevronLeft size={32} />
      </button>
      <button className="slider-arrow next" onClick={nextSlide} aria-label="Next Slide">
        <ChevronRight size={32} />
      </button>

      {/* Slider Dots */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          >
            <div className="dot-fill"></div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ImageSlider;
