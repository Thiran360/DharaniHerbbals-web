import { useRef, useEffect, useState } from 'react';

const LOGO_SRC = '/videos/logo.mp4';
const LOGO_STATIC = '/favicon.png';

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

  // Keep in DOM with 1x1 invisible size so mobile browsers actively decode video frames
  sharedVideo.style.position = 'fixed';
  sharedVideo.style.bottom = '0';
  sharedVideo.style.right = '0';
  sharedVideo.style.width = '1px';
  sharedVideo.style.height = '1px';
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

  // Touch/scroll/click triggers to unlock video playback on strict mobile devices
  const resumeGesture = () => {
    if (sharedVideo && sharedVideo.paused) {
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
    let validFrames = 0;

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

        // Proportional centering of the 3D animated emblem
        const contentHeight = Math.min(vh, Math.round(vw * 0.72));
        const contentWidth = vw;

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

          // Original clean keying: preserves rich 3D shading while clearing black background
          if (maxVal < 22) {
            data32[i] = 0;
          } else if (maxVal < 60) {
            const alpha = Math.floor((maxVal - 22) * (255 / 38));
            data32[i] = (pixel & 0x00FFFFFF) | (alpha << 24);
          }
        }

        ctx.putImageData(frame, 0, 0);

        validFrames++;
        if (validFrames >= 2 && !videoStarted) {
          setVideoStarted(true);
        }
      } else {
        if (video && video.paused && videoStarted) {
          setVideoStarted(false);
          validFrames = 0;
        }
      }
    };

    getSharedVideo();

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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Clean official emblem fallback - visible until video frames actively render */}
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
      {/* Original 3D spinning canvas - smooth and vibrant */}
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
