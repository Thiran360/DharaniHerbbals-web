import React, { useRef, useEffect } from 'react';
import logoVideo from '../assets/logo.mp4';

export default function BrandLogoVideo({ className = '', variant = 'title', ariaLabel = 'Dharani Herbbals logo' }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);

  return (
    <span
      className={`brand-logo-video-wrap brand-logo-video-wrap--${variant} ${className}`}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        overflow: 'hidden'
      }}
    >
      <video
        ref={videoRef}
        src={logoVideo}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.45) translateY(13%)',
          pointerEvents: 'none',
          display: 'block'
        }}
      />
    </span>
  );
}
