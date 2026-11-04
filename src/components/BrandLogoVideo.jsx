import React, { useRef, useEffect, useState, useCallback } from 'react';
import './BrandLogoVideo.css';

export default function BrandLogoVideo({ className = '', variant = 'nav', ariaLabel = 'Dharani Herbbals logo' }) {
  const videoRef = useRef(null);
  const [logoSrc, setLogoSrc] = useState('/videos/logo_transparent.webp');

  const checkIsMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return (
      variant === 'mobile-nav' ||
      window.innerWidth <= 768 ||
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '')
    );
  }, [variant]);

  const [isMobile, setIsMobile] = useState(checkIsMobile);
  const [canUseWebM, setCanUseWebM] = useState(() => !checkIsMobile());

  // Listen for window resize (e.g. rotating device, or toggling device toolbar in DevTools)
  useEffect(() => {
    const handleResize = () => {
      const mobile = checkIsMobile();
      setIsMobile(mobile);
      if (mobile) {
        setCanUseWebM(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkIsMobile]);

  useEffect(() => {
    if (isMobile) {
      setCanUseWebM(false);
      return;
    }

    // Detect if browser natively supports VP9 WebM video playback
    const testVideo = document.createElement('video');
    const supportsWebM = testVideo.canPlayType('video/webm; codecs="vp9"') !== '';
    if (!supportsWebM) {
      setCanUseWebM(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const playVideo = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          setCanUseWebM(false);
        });
      }
    };

    playVideo();

    const handleVisibility = () => {
      if (!document.hidden && video.paused) {
        playVideo();
      }
    };

    const handleInteraction = () => {
      if (video.paused) {
        playVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('touchstart', handleInteraction, { passive: true, once: true });
    window.addEventListener('click', handleInteraction, { passive: true, once: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [isMobile]);

  return (
    <span
      className={`brand-logo-video-wrap brand-logo-video-wrap--${variant} ${className}`}
      aria-label={ariaLabel}
    >
      {canUseWebM ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          className="brand-logo-video"
          aria-hidden="true"
          onError={() => setCanUseWebM(false)}
        >
          <source src="/videos/logo_transparent.webm" type="video/webm; codecs=vp9" />
          <img
            src={logoSrc}
            alt={ariaLabel}
            className="brand-logo-video"
            width="48"
            height="48"
            loading="eager"
            decoding="async"
            onError={() => setLogoSrc('/favicon.png')}
          />
        </video>
      ) : (
        <img
          src={logoSrc}
          alt={ariaLabel}
          className="brand-logo-video"
          width="48"
          height="48"
          loading="eager"
          decoding="async"
          onError={() => setLogoSrc('/favicon.png')}
        />
      )}
    </span>
  );
}
