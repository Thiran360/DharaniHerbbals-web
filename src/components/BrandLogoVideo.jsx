import React, { useRef, useEffect } from 'react';
import logoVideo from '../assets/logo.mp4';
import './BrandLogoVideo.css';

export default function BrandLogoVideo({ className = '', variant = 'nav', ariaLabel = 'Dharani Herbbals logo' }) {
  const videoRef = useRef(null);

  useEffect(() => {
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

    // Auto resume if tab becomes visible or user interacts
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
      <video
        ref={videoRef}
        src={logoVideo}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        aria-hidden="true"
        className="brand-logo-video brand-logo-video--mp4"
      >
        <source src={logoVideo} type="video/mp4" />
        <source src="/videos/logo.mp4" type="video/mp4" />
        <img
          src="/favicon.png"
          alt={ariaLabel}
          className="brand-logo-video"
          width="48"
          height="48"
          loading="eager"
        />
      </video>
    </span>
  );
}
