import React, { useRef, useEffect } from 'react';

export default function SmartVideo({ src, className, style, poster }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play when in view
            if (videoRef.current) {
              videoRef.current.play().catch(e => {
                // Ignore DOMException for interrupted play
              });
            }
          } else {
            // Pause when out of view to save CPU/GPU!
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      className={className}
      style={{ ...style, transform: 'translateZ(0)', willChange: 'transform' }} 
      preload="metadata"
      poster={poster}
    />
  );
}
