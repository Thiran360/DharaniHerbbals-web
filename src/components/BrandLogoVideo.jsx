import { useRef, useEffect, useState } from 'react';

const LOGO_SRC = '/videos/logo.mp4';
const LOGO_STATIC = '/favicon.png';

// --- Shared singleton video element ---
let sharedVideo = null;
let sharedVideoReady = false;
const readyCallbacks = [];

function getSharedVideo() {
  if (sharedVideo) return sharedVideo;

  sharedVideo = document.createElement('video');
  sharedVideo.src = LOGO_SRC;
  sharedVideo.loop = true;
  sharedVideo.muted = true;
  sharedVideo.playsInline = true;
  sharedVideo.preload = 'metadata';
  sharedVideo.crossOrigin = 'anonymous';
  sharedVideo.style.display = 'none';
  document.body.appendChild(sharedVideo);

  const onReady = () => {
    if (sharedVideoReady) return;
    sharedVideoReady = true;
    sharedVideo.play().catch(() => {});
    readyCallbacks.forEach(cb => cb());
    readyCallbacks.length = 0;
  };

  if (sharedVideo.readyState >= 3) {
    onReady();
  } else {
    sharedVideo.addEventListener('loadeddata', onReady, { once: true });
    sharedVideo.addEventListener('canplay', onReady, { once: true });
  }
  
  sharedVideo.load();

  return sharedVideo;
}

function onVideoReady(cb) {
  if (sharedVideoReady) {
    cb();
  } else {
    readyCallbacks.push(cb);
  }
}

export default function BrandLogoVideo({ className = '', variant = 'title', ariaLabel = 'Dharani Herbbals logo' }) {
  const canvasRef = useRef(null);
  const [videoStarted, setVideoStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;
    let running = true;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 2, 2.5) : 2;
    const baseDimension = variant === 'nav' || variant === 'mobile-nav' ? 64 : 120;
    const targetSize = Math.round(baseDimension * dpr);
    canvas.width = targetSize;
    canvas.height = targetSize;

    let isVisible = false;
    let lastDrawTime = 0;

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const drawLoop = (timestamp) => {
      if (!running) return;
      animationFrameId = requestAnimationFrame(drawLoop);

      // Draw smoothly at ~30 FPS
      if (!isVisible || timestamp - lastDrawTime < 33) return;
      lastDrawTime = timestamp;

      const video = sharedVideo;
      if (video && video.videoWidth > 0 && !video.paused) {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        
        // The animated Dharani logo emblem is vertically centered in the upper portion (0 to ~72% height)
        const contentHeight = Math.min(vh, Math.round(vw * 0.72));
        const contentWidth = vw;

        // Proportional centering inside target canvas for maximum sharpness and zero distortion
        const drawAspect = contentWidth / contentHeight;
        const drawW = targetSize;
        const drawH = Math.round(targetSize / drawAspect);
        const offsetY = Math.round((targetSize - drawH) / 2);

        ctx.clearRect(0, 0, targetSize, targetSize);
        ctx.drawImage(video, 0, 0, contentWidth, contentHeight, 0, offsetY, drawW, drawH);

        const frame = ctx.getImageData(0, 0, targetSize, targetSize);
        const data32 = new Uint32Array(frame.data.buffer);

        for (let i = 0; i < data32.length; i++) {
          const pixel = data32[i];
          const r = pixel & 0xFF;
          const g = (pixel >> 8) & 0xFF;
          const b = (pixel >> 16) & 0xFF;
          const maxVal = Math.max(r, g, b);

          // Remove only black background while preserving crisp edges and ALL white/light-green leaves
          if (maxVal < 22) {
            data32[i] = 0;
          } else if (maxVal < 60) {
            const alpha = Math.floor((maxVal - 22) * (255 / 38));
            data32[i] = (pixel & 0x00FFFFFF) | (alpha << 24);
          }
        }

        ctx.putImageData(frame, 0, 0);
      }
    };

    // Ensure singleton video is created
    getSharedVideo();

    // Start animated canvas only when video is ready
    onVideoReady(() => {
      if (running) {
        setVideoStarted(true);
        animationFrameId = requestAnimationFrame(drawLoop);
      }
    });

    return () => {
      running = false;
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  return (
    <span
      className={`brand-logo-video-wrap brand-logo-video-wrap--${variant} ${className}`}
      aria-label={ariaLabel}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
    >
      {/* Instant static logo so brand is visible immediately on slow 2G/3G */}
      <img
        src={LOGO_STATIC}
        alt={ariaLabel}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: videoStarted ? 0 : 1,
          transition: 'opacity 0.3s ease-in',
          pointerEvents: 'none'
        }}
      />
      {/* Animated canvas shown once video is ready */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: videoStarted ? 1 : 0,
          transition: 'opacity 0.3s ease-in'
        }}
      />
    </span>
  );
}
