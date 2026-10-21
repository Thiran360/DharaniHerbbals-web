import React, { useRef, useEffect, useState } from 'react';
import logoVideo from '../assets/logo.mp4';
import logo3dBright from '../assets/logo_3d_bright.png';

let sharedVideo = null;
let sharedVideoReady = false;
const readyCallbacks = [];

function notifyReady() {
  if (sharedVideoReady) return;
  sharedVideoReady = true;
  readyCallbacks.forEach((cb) => {
    try { cb(); } catch {}
  });
  readyCallbacks.length = 0;
}

function onVideoReady(cb) {
  if (sharedVideoReady) {
    cb();
  } else {
    readyCallbacks.push(cb);
  }
}

function getSharedVideo() {
  if (typeof document === 'undefined') return null;
  if (sharedVideo) return sharedVideo;

  sharedVideo = document.createElement('video');
  sharedVideo.src = logoVideo;
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
  sharedVideo.style.position = 'fixed';
  sharedVideo.style.top = '-9999px';
  sharedVideo.style.left = '-9999px';
  sharedVideo.style.width = '64px';
  sharedVideo.style.height = '64px';
  sharedVideo.style.opacity = '0.01';
  sharedVideo.style.pointerEvents = 'none';
  sharedVideo.style.zIndex = '-9999';
  document.body.appendChild(sharedVideo);

  const tryPlay = () => {
    if (!sharedVideo) return;
    const p = sharedVideo.play();
    if (p && typeof p.then === 'function') {
      p.then(() => notifyReady()).catch(() => {});
    }
  };

  sharedVideo.addEventListener('loadeddata', () => { tryPlay(); notifyReady(); });
  sharedVideo.addEventListener('canplay', () => { tryPlay(); notifyReady(); });
  sharedVideo.addEventListener('playing', () => notifyReady());
  sharedVideo.addEventListener('timeupdate', () => {
    if (sharedVideo.currentTime > 0) notifyReady();
  });

  const kickstart = () => {
    if (sharedVideo && (sharedVideo.paused || !sharedVideoReady)) {
      sharedVideo.play().then(notifyReady).catch(() => {});
    }
  };

  if (typeof window !== 'undefined') {
    ['touchstart', 'pointerdown', 'scroll', 'click'].forEach((evt) => {
      window.addEventListener(evt, kickstart, { passive: true, once: true });
    });
  }

  tryPlay();
  return sharedVideo;
}

export default function BrandLogoVideo({ className = '', variant = 'title', ariaLabel = 'Dharani Herbbals logo' }) {
  const canvasRef = useRef(null);
  const [videoStarted, setVideoStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animId;
    let running = true;
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 2, 2.5) : 2;
    const baseSize = (variant === 'nav' || variant === 'mobile-nav') ? 64 : 120;
    const targetSize = Math.round(baseSize * dpr);
    canvas.width = targetSize;
    canvas.height = targetSize;

    let isIntersecting = true;
    let lastTime = 0;
    let renderedCount = 0;

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(canvas);

    const draw = (timestamp) => {
      if (!running) return;
      animId = requestAnimationFrame(draw);
      if (!isIntersecting || timestamp - lastTime < 33) return;
      lastTime = timestamp;

      const video = sharedVideo;
      if (video && video.videoWidth > 0 && !video.paused) {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const contentHeight = Math.min(vh, Math.round(vw * 0.72));
        const contentWidth = vw;
        const aspect = contentWidth / contentHeight;
        const drawW = targetSize;
        const drawH = Math.round(targetSize / aspect);
        const offsetY = Math.round((targetSize - drawH) / 2);

        ctx.clearRect(0, 0, targetSize, targetSize);
        ctx.drawImage(video, 0, 0, contentWidth, contentHeight, 0, offsetY, drawW, drawH);

        const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
        const data32 = new Uint32Array(imgData.data.buffer);

        for (let i = 0; i < data32.length; i++) {
          const pixel = data32[i];
          const r = pixel & 0xFF;
          const g = (pixel >> 8) & 0xFF;
          const b = (pixel >> 16) & 0xFF;
          const maxVal = Math.max(r, g, b);

          if (maxVal < 22) {
            data32[i] = 0;
          } else if (maxVal < 60) {
            const alpha = Math.floor((maxVal - 22) * (255 / 38));
            data32[i] = (pixel & 0x00FFFFFF) | (alpha << 24);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        renderedCount++;
        if (renderedCount >= 3) {
          setVideoStarted(true);
        }
      }
    };

    getSharedVideo();
    onVideoReady(() => {
      if (running) animId = requestAnimationFrame(draw);
    });

    return () => {
      running = false;
      observer.disconnect();
      cancelAnimationFrame(animId);
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
      <img
        src={logo3dBright}
        alt={ariaLabel}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: 1,
          pointerEvents: 'none'
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: videoStarted ? 1 : 0,
          transition: 'opacity 0.3s ease-in',
          pointerEvents: 'none'
        }}
      />
    </span>
  );
}
