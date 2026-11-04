import React, { useRef, useEffect, useState } from 'react';
import logoVideo from '../assets/logo.mp4';
import logo3dBright from '../assets/logo_3d_bright.png';
import './BrandLogoVideo.css';

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
  sharedVideo.setAttribute('x5-playsinline', '');
  sharedVideo.setAttribute('autoplay', '');
  sharedVideo.preload = 'auto';
  sharedVideo.crossOrigin = 'anonymous';
  sharedVideo.style.position = 'fixed';
  sharedVideo.style.top = '-9999px';
  sharedVideo.style.left = '-9999px';
  sharedVideo.style.width = '64px';
  sharedVideo.style.height = '64px';
  sharedVideo.style.opacity = '0.001';
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

export default function BrandLogoVideo({ className = '', variant = 'nav', ariaLabel = 'Dharani Herbbals logo' }) {
  const canvasRef = useRef(null);
  const [videoStarted, setVideoStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animId;
    let running = true;
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 2, 2) : 2;
    const baseSize = (variant === 'nav' || variant === 'mobile-nav') ? 56 : 100;
    const targetSize = Math.round(baseSize * dpr);
    canvas.width = targetSize;
    canvas.height = targetSize;

    // Pre-allocated arrays for flood fill to avoid garbage collection overhead
    const totalPixels = targetSize * targetSize;
    const visited = new Uint8Array(totalPixels);
    const queue = new Int32Array(totalPixels);

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
      if (!isIntersecting || timestamp - lastTime < 33) return; // ~30 fps cap for smooth performance
      lastTime = timestamp;

      const video = sharedVideo;
      if (video && video.videoWidth > 0 && !video.paused) {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        // The 3D logo in logo.mp4 sits in the upper ~72% of the video frame.
        // Crop the bottom empty margin so the 3D logo is centered.
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
        const W = targetSize;
        const H = targetSize;

        // Reset visited mask
        visited.fill(0);
        let head = 0;
        let tail = 0;

        // Detect if outer background is white or dark
        const cornerPixel = data32[0];
        const cr = cornerPixel & 0xFF;
        const cg = (cornerPixel >> 8) & 0xFF;
        const cb = (cornerPixel >> 16) & 0xFF;
        const isWhiteBg = (cr + cg + cb) > 400;

        const isBgPixel = isWhiteBg
          ? (p) => {
              const pix = data32[p];
              const r = pix & 0xFF;
              const g = (pix >> 8) & 0xFF;
              const b = (pix >> 16) & 0xFF;
              return r > 215 && g > 215 && b > 215;
            }
          : (p) => {
              const pix = data32[p];
              const r = pix & 0xFF;
              const g = (pix >> 8) & 0xFF;
              const b = (pix >> 16) & 0xFF;
              return r < 35 && g < 35 && b < 35;
            };

        // Enqueue only perimeter pixels matching background
        for (let x = 0; x < W; x++) {
          if (isBgPixel(x)) {
            visited[x] = 1;
            queue[tail++] = x;
          }
          const bot = (H - 1) * W + x;
          if (!visited[bot] && isBgPixel(bot)) {
            visited[bot] = 1;
            queue[tail++] = bot;
          }
        }
        for (let y = 0; y < H; y++) {
          const left = y * W;
          if (!visited[left] && isBgPixel(left)) {
            visited[left] = 1;
            queue[tail++] = left;
          }
          const right = y * W + (W - 1);
          if (!visited[right] && isBgPixel(right)) {
            visited[right] = 1;
            queue[tail++] = right;
          }
        }

        // BFS flood fill: erase only outer background pixels connected to outside edges
        // White leaves inside the green "D" are protected and preserved!
        while (head < tail) {
          const p = queue[head++];
          const px = p % W;
          const py = (p / W) | 0;

          // Clear this background pixel to 100% transparent
          data32[p] = 0;

          // 4-way neighbors
          if (px > 0) {
            const np = p - 1;
            if (!visited[np] && isBgPixel(np)) {
              visited[np] = 1;
              queue[tail++] = np;
            }
          }
          if (px < W - 1) {
            const np = p + 1;
            if (!visited[np] && isBgPixel(np)) {
              visited[np] = 1;
              queue[tail++] = np;
            }
          }
          if (py > 0) {
            const np = p - W;
            if (!visited[np] && isBgPixel(np)) {
              visited[np] = 1;
              queue[tail++] = np;
            }
          }
          if (py < H - 1) {
            const np = p + W;
            if (!visited[np] && isBgPixel(np)) {
              visited[np] = 1;
              queue[tail++] = np;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        renderedCount++;
        if (renderedCount >= 2) {
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
    >
      <img
        src={logo3dBright}
        alt={ariaLabel}
        className="brand-logo-poster"
      />
      <canvas
        ref={canvasRef}
        className="brand-logo-canvas"
        style={{
          opacity: videoStarted ? 1 : 0
        }}
      />
    </span>
  );
}
