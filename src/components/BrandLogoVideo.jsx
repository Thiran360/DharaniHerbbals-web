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
        ctx.clearRect(0, 0, targetSize, targetSize);
        ctx.drawImage(video, 0, 0, targetSize, targetSize);

        const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
        const data32 = new Uint32Array(imgData.data.buffer);
        const W = targetSize;
        const H = targetSize;

        // Reset visited mask
        visited.fill(0);
        let head = 0;
        let tail = 0;

        // Any pixel that is transparent or matches the outer white background
        const isBgPixel = (p) => {
          const pix = data32[p];
          const a = (pix >> 24) & 0xFF;
          if (a < 20) return true;
          const r = pix & 0xFF;
          const g = (pix >> 8) & 0xFF;
          const b = (pix >> 16) & 0xFF;
          return r >= 210 && g >= 210 && b >= 210;
        };

        // Enqueue perimeter pixels connected to the canvas borders
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

        // BFS flood fill: erase only outer background pixels connected to outside edges.
        // White leaves inside the green "D" are completely protected and preserved!
        const clearedList = [];
        while (head < tail) {
          const p = queue[head++];
          const px = p % W;
          const py = (p / W) | 0;

          data32[p] = 0;
          clearedList.push(p);

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

        // Smooth anti-aliased edge blending for boundary pixels (removes white fringe while preserving bright colors)
        for (let i = 0; i < clearedList.length; i++) {
          const bp = clearedList[i];
          const bx = bp % W;
          const by = (bp / W) | 0;

          const checkEdge = (np) => {
            if (!visited[np]) {
              visited[np] = 1;
              const pix = data32[np];
              const r = pix & 0xFF;
              const g = (pix >> 8) & 0xFF;
              const b = (pix >> 16) & 0xFF;
              const minVal = Math.min(r, g, b);
              if (minVal >= 185) {
                const alpha = Math.max(0, Math.min(255, Math.round(255 * (1 - (minVal - 185) / 25))));
                data32[np] = (alpha << 24) | (b << 16) | (g << 8) | r;
              }
            }
          };

          if (bx > 0) checkEdge(bp - 1);
          if (bx < W - 1) checkEdge(bp + 1);
          if (by > 0) checkEdge(bp - W);
          if (by < H - 1) checkEdge(bp + W);
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
        className={`brand-logo-poster ${videoStarted ? 'hidden' : ''}`}
        style={{
          opacity: videoStarted ? 0 : 1,
          visibility: videoStarted ? 'hidden' : 'visible',
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none'
        }}
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
