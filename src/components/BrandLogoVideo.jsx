import { useRef, useEffect, useState } from 'react';

const LOGO_SRC = '/videos/logo.mp4';
const LOGO_STATIC = '/logo_3d_bright.png';

// --- Shared singleton video element ---
let sharedVideo = null;
let sharedVideoReady = false;
const readyCallbacks = [];

function notifyVideoReady() {
  if (sharedVideoReady) return;
  sharedVideoReady = true;
  readyCallbacks.forEach(cb => {
    try { cb(); } catch (e) { /* ignore */ }
  });
  readyCallbacks.length = 0;
}

function getSharedVideo() {
  if (sharedVideo) return sharedVideo;

  sharedVideo = document.createElement('video');
  sharedVideo.src = LOGO_SRC;
  sharedVideo.loop = true;
  sharedVideo.muted = true;
  sharedVideo.defaultMuted = true;
  sharedVideo.playsInline = true;
  sharedVideo.autoplay = true;
  sharedVideo.setAttribute('muted', '');
  sharedVideo.setAttribute('playsinline', '');
  sharedVideo.setAttribute('webkit-playsinline', '');
  sharedVideo.setAttribute('autoplay', '');
  sharedVideo.preload = 'auto';
  sharedVideo.crossOrigin = 'anonymous';

  // Keep in DOM render tree off-screen so iOS Safari and mobile Chrome actively render video frames
  sharedVideo.style.position = 'fixed';
  sharedVideo.style.top = '-9999px';
  sharedVideo.style.left = '-9999px';
  sharedVideo.style.width = '64px';
  sharedVideo.style.height = '64px';
  sharedVideo.style.opacity = '0.01';
  sharedVideo.style.pointerEvents = 'none';
  sharedVideo.style.zIndex = '-9999';
  document.body.appendChild(sharedVideo);

  const attemptPlay = () => {
    if (!sharedVideo) return;
    const p = sharedVideo.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        notifyVideoReady();
      }).catch(() => {});
    }
  };

  sharedVideo.addEventListener('loadeddata', () => {
    attemptPlay();
    notifyVideoReady();
  });
  sharedVideo.addEventListener('canplay', () => {
    attemptPlay();
    notifyVideoReady();
  });
  sharedVideo.addEventListener('playing', () => {
    notifyVideoReady();
  });
  sharedVideo.addEventListener('timeupdate', () => {
    if (sharedVideo.currentTime > 0) {
      notifyVideoReady();
    }
  });

  // Strict mobile gesture trigger fallback
  const resumeGesture = () => {
    if (sharedVideo && (sharedVideo.paused || !sharedVideoReady)) {
      sharedVideo.play().then(notifyVideoReady).catch(() => {});
    }
  };
  if (typeof window !== 'undefined') {
    ['touchstart', 'pointerdown', 'scroll', 'click'].forEach(evt => {
      window.addEventListener(evt, resumeGesture, { passive: true, once: true });
    });
  }

  attemptPlay();

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

    let isVisible = true;
    let lastDrawTime = 0;
    let renderedFrames = 0;

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

        // Only reveal animated canvas and fade out static base once valid frames are actively rendering
        renderedFrames++;
        if (renderedFrames >= 3 && !videoStarted) {
          setVideoStarted(true);
        }
      } else {
        // If video ever pauses or stops, smoothly fall back to static image
        if (video && video.paused && videoStarted) {
          setVideoStarted(false);
          renderedFrames = 0;
        }
      }
    };

    // Ensure singleton video is created
    getSharedVideo();

    // Start animated canvas loop when video is ready
    onVideoReady(() => {
      if (running) {
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
      {/* Single static 3D logo - visible only when video is buffering/paused */}
      <img
        src={LOGO_STATIC}
        alt={ariaLabel}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: videoStarted ? 0 : 1,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none'
        }}
      />
      {/* Single animated spinning canvas - visible when actively rendering */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: videoStarted ? 1 : 0,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none'
        }}
      />
    </span>
  );
}
