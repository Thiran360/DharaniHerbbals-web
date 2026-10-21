import React from 'react';

const LOGO_ANIMATED = '/logo_animated.webp';
const LOGO_STATIC = '/logo_3d_bright.png';

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
        overflow: 'hidden'
      }}
    >
      <img
        src={LOGO_ANIMATED}
        alt={ariaLabel}
        className="brand-logo-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          pointerEvents: 'none'
        }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = LOGO_STATIC;
        }}
      />
    </span>
  );
}
