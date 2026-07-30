import { useRef, useEffect, useState } from 'react';
import logoVideo from '../assets/logo.mp4';

const cacheBustStr = Math.random().toString(36).substring(7);

export default function BrandLogoVideo({ className = '', variant = 'title', ariaLabel = 'Dharani Herbbals logo' }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;

    let lastFrameTime = 0;
    const targetFPS = 24;
    const frameInterval = 1000 / targetFPS;

    const renderFrame = (timestamp) => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(renderFrame);
        return;
      }
      
      // Throttle framerate for performance
      if (timestamp - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(renderFrame);
        return;
      }
      lastFrameTime = timestamp;
      
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        // Downscale internal resolution massively for performance while preserving aspect ratio
        const targetWidth = variant === 'nav' || variant === 'mobile-nav' ? 64 : 120;
        const aspectRatio = video.videoHeight / video.videoWidth;
        const targetHeight = Math.floor(targetWidth * aspectRatio);
        
        if (canvas.width !== targetWidth) canvas.width = targetWidth;
        if (canvas.height !== targetHeight) canvas.height = targetHeight;
        
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
        
        const frame = ctx.getImageData(0, 0, targetWidth, targetHeight);
        // Use 32-bit integer array for 4x faster loop processing
        const data32 = new Uint32Array(frame.data.buffer);
        
        for (let i = 0; i < data32.length; i++) {
          const pixel = data32[i];
          // Little-endian format: ABGR
          const r = pixel & 0xFF;
          const g = (pixel >> 8) & 0xFF;
          const b = (pixel >> 16) & 0xFF;
          
          const maxVal = Math.max(r, g, b);
          
          // Remove black background
          if (maxVal < 25) {
            data32[i] = 0; // fully transparent
          } else if (maxVal < 65) {
            // Smooth edge blending (anti-aliasing)
            const alpha = Math.floor((maxVal - 25) * (255 / 40));
            data32[i] = (pixel & 0x00FFFFFF) | (alpha << 24);
          }
        }
        
        ctx.putImageData(frame, 0, 0);
      }
      
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          animationFrameId = requestAnimationFrame(renderFrame);
        } else {
          video.pause();
          cancelAnimationFrame(animationFrameId);
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(canvas);
    
    video.addEventListener('play', () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(renderFrame);
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <span
      className={`brand-logo-video-wrap brand-logo-video-wrap--${variant} ${className}`}
      aria-label={ariaLabel}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      <video
        ref={videoRef}
        src={`${logoVideo}?cb=${cacheBustStr}`}
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        className="brand-logo-video"
        style={{ 
          width: '100%', 
          height: 'auto',
          display: 'block'
        }}
      />
    </span>
  );
}
