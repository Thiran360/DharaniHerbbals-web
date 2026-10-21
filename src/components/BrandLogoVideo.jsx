import React from 'react';
import './BrandLogoVideo.css';

const LOGO_SRC = '/favicon.png';

export default function BrandLogoVideo({ className = '', variant = 'title', ariaLabel = 'Dharani Herbbals logo' }) {
  return (
    <span
      className={`brand-logo-video-wrap brand-logo-3d-wrap brand-logo-3d-wrap--${variant} ${className}`}
      aria-label={ariaLabel}
    >
      <span className="brand-logo-3d-spinner">
        <img
          src={LOGO_SRC}
          alt={ariaLabel}
          className="brand-logo-3d-face front"
          draggable="false"
        />
        <img
          src={LOGO_SRC}
          alt={ariaLabel}
          className="brand-logo-3d-face back"
          draggable="false"
        />
      </span>
    </span>
  );
}
