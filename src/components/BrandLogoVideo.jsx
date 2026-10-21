import React from 'react';

const LOGO_SRC = '/logo_animated.webp';

export default function BrandLogoVideo({ className = '', variant = 'title', ariaLabel = 'Dharani Herbbals logo' }) {
  return (
    <span
      className={`brand-logo-video-wrap brand-logo-video-wrap--${variant} ${className}`}
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0
      }}
    >
      <img
        src={LOGO_SRC}
        alt={ariaLabel}
        className="brand-logo-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3))'
        }}
      />
    </span>
  );
}
