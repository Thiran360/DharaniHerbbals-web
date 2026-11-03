import React, { useRef, useEffect, useState } from 'react';

export default function BrandLogoVideo({ className = '', variant = 'nav', ariaLabel = 'Dharani Herbbals logo' }) {
  const videoRef = useRef(null);
  const [canUseWebM, setCanUseWebM] = useState(true);

  useEffect(() => {
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
        p.catch(() => {});
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
  }, []);

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
            src="/videos/logo_transparent.webp"
            alt={ariaLabel}
            className="brand-logo-video"
            width="48"
            height="48"
            loading="eager"
            decoding="async"
          />
        </video>
      ) : (
        <img
          src="/videos/logo_transparent.webp"
          alt={ariaLabel}
          className="brand-logo-video"
          width="48"
          height="48"
          loading="eager"
          decoding="async"
        />
      )}
    </span>
  );
}
