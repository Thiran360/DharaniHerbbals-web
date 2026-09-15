import { useRef, useEffect } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import BrandLogoVideo from './BrandLogoVideo';
import './GoogleReviews.css';

const reviewsData = [
  {
    id: 1,
    name: 'Rajesh K',
    initial: 'R',
    bgColor: '#5a7bf6',
    time: '1 month ago',
    text: 'Great quality products. Fast delivery and good customer service.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Meera R',
    initial: 'M',
    bgColor: '#8a5af6',
    time: '3 weeks ago',
    text: 'Good herbal medicines. Helped with my health issues. Will order again.',
    rating: 4.5,
  },
  {
    id: 3,
    name: 'Suresh M',
    initial: 'S',
    bgColor: '#5a7bf6',
    time: '2 months ago',
    text: 'Authentic Ayurvedic products. Very satisfied with the results.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Lakshmi V',
    initial: 'L',
    bgColor: '#8a5af6',
    time: '1 week ago',
    text: 'Pure and natural products. Excellent for wellness. Thank you!',
    rating: 5,
  },
  {
    id: 5,
    name: 'Amit S',
    initial: 'A',
    bgColor: '#5a7bf6',
    time: '1 month ago',
    text: 'Amazing supplements and great packaging. Highly recommended for daily use.',
    rating: 5,
  },
];

const videoReels = [
  { id: 'tUsTYO-i0Pk', author: 'Lakshmi V.', quote: '"Absolutely transformative for my skin routine."' },
  { id: 'CP3xRw6y96c', author: 'Buvaneshwari K.', quote: '"Authentic, pure, and incredibly effective."' },
  { id: 'aU6PrM_jce8', author: 'Anitha S.', quote: '"The best herbal products I have ever used."' },
  { id: 'tPKMt4wUwZE', author: 'Priya R.', quote: '"Such an amazing natural remedy."' },
  { id: '9UwEu2GA7uM', author: 'Divya M.', quote: '"Quality is unmatched. Highly recommend."' },
  { id: '4zE6VHhPjq4', author: 'Sowmya T.', quote: '"My family loves these products."' },
];

export default function GoogleReviews() {
  const { t } = useLanguage();
  const textTrackRef = useRef(null);
  const videoTrackRef = useRef(null);

  useEffect(() => {
    const autoScroll = (ref, amount) => {
      if (!ref.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      // If we reach the end, scroll back to the start smoothly
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        ref.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        ref.current.scrollBy({ left: amount, behavior: 'smooth' });
      }
    };

    const textInterval = setInterval(() => autoScroll(textTrackRef, 400), 3000);
    const videoInterval = setInterval(() => autoScroll(videoTrackRef, 369), 4000); // 337px + 32px gap = 369

    return () => {
      clearInterval(textInterval);
      clearInterval(videoInterval);
    };
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i <= rating ? '#fbbf24' : 'transparent'}
          color="#fbbf24"
        />
      );
    }
    return stars;
  };

  return (
    <div className="gr-container">
      {/* Ultra UI Background Orbs */}
      <div className="gr-orb gr-orb-1"></div>
      <div className="gr-orb gr-orb-2"></div>
      
      <div className="reveal bento-header">
          {/* Decorative background blob */}
          <div className="bento-header-blob left"></div>
          
          <div className="bento-title-col">
              <h2 className="bento-title-text">
              <BrandLogoVideo />
              <div>{t('reviewsTitle')}</div>
            </h2>
          </div>
          
          <div className="bento-desc-col">
            <p className="bento-desc-text">
              {t('reviewsDesc')}
            </p>
          </div>
        </div>

      {/* Sliding Text Reviews Marquee */}
      <div className="gr-marquee-container reveal">
        <div className="gr-marquee-track" ref={textTrackRef}>
          {[...reviewsData, ...reviewsData].map((review, i) => (
            <div key={`${review.id}-${i}`} className="gr-text-card">
              <div className="gr-card-header">
                <div className="gr-avatar" style={{ backgroundColor: review.bgColor }}>
                  {review.initial}
                </div>
                <div className="gr-user-info">
                  <h4 className="gr-user-name">{review.name}</h4>
                  <span className="gr-user-time">{review.time}</span>
                </div>
                <div className="gr-google-icon">
                  <svg viewBox="0 0 24 24" width="28" height="28">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>
              <div className="gr-card-stars">
                {renderStars(review.rating)}
              </div>
              <p className="gr-card-text">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof Reels Gallery - Auto Sliding */}
      <div className="reels-marquee-container">
        <div className="reels-marquee-track" ref={videoTrackRef}>
          {[...videoReels, ...videoReels].map((reel, index) => (
            <div className="reel-card" key={`${reel.id}-${index}`}>
              <div className="reel-video-wrapper">
                <iframe 
                  src={`https://www.youtube.com/embed/${reel.id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${reel.id}&controls=0&showinfo=0&rel=0&modestbranding=1`}
                  title={`Customer Experience ${index}`}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                >
                </iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
