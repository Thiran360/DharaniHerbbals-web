import React, { useRef, useEffect, useState } from 'react';
import logoVideo from '../assets/logo.mp4';
import logo3dBright from '../assets/logo_3d_bright.png';
import './BrandLogoVideo.css';

// Master engine configuration
const MASTER_SIZE = 80; // High-DPI retina sharp resolution for 40-58px UI displays
let sharedVideo = null;
let sharedVideoReady = false;
let isCacheComplete = false;
let currentFrameIndex = 0;
let masterAnimId = null;
let lastVideoTime = -1;
let lastTickTime = 0;
const frameCache = [];
const readyCallbacks = [];
const subscribers = new Set();

// Master offscreen canvas and buffers
let masterCanvas = null;
let masterCtx = null;
let visited = null;
let queue = null;

function initMasterProcessor() {
  if (masterCanvas || typeof document === 'undefined') return;
  masterCanvas = document.createElement('canvas');
  masterCanvas.width = MASTER_SIZE;
  masterCanvas.height = MASTER_SIZE;
  masterCtx = masterCanvas.getContext('2d', { willReadFrequently: true });
  visited = new Uint8Array(MASTER_SIZE * MASTER_SIZE);
  queue = new Int32Array(MASTER_SIZE * MASTER_SIZE);
}

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

// Master frame processor: extracts frame, applies flood fill to make background transparent,
// and clones into an offscreen canvas for zero-overhead GPU drawing.
function processVideoFrame(video) {
  initMasterProcessor();
  if (!masterCtx || !visited || !queue) return null;

  masterCtx.clearRect(0, 0, MASTER_SIZE, MASTER_SIZE);
  masterCtx.drawImage(video, 0, 0, MASTER_SIZE, MASTER_SIZE);

  const imgData = masterCtx.getImageData(0, 0, MASTER_SIZE, MASTER_SIZE);
  const data32 = new Uint32Array(imgData.data.buffer);
  const W = MASTER_SIZE;
  const H = MASTER_SIZE;

  visited.fill(0);
  let head = 0;
  let tail = 0;

  const isBgPixel = (p) => {
    const pix = data32[p];
    const a = (pix >> 24) & 0xFF;
    if (a < 20) return true;
    const r = pix & 0xFF;
    const g = (pix >> 8) & 0xFF;
    const b = (pix >> 16) & 0xFF;
    return r >= 210 && g >= 210 && b >= 210;
  };

  // Enqueue perimeter pixels connected to canvas borders
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

  // BFS flood fill: erase outer white background while preserving leaves inside the green "D"
  const clearedList = [];
  while (head < tail) {
    const p = queue[head++];
    const px = p % W;
    const py = (p / W) | 0;

    data32[p] = 0;
    clearedList.push(p);

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

  // Smooth anti-aliased edge blending for boundary pixels
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

  masterCtx.putImageData(imgData, 0, 0);

  // Snapshot into a cached offscreen canvas
  const snapshot = document.createElement('canvas');
  snapshot.width = MASTER_SIZE;
  snapshot.height = MASTER_SIZE;
  const snapCtx = snapshot.getContext('2d');
  snapCtx.drawImage(masterCanvas, 0, 0);
  return snapshot;
}

// Global master tick loop: runs only once globally for all mounted BrandLogoVideo instances
function masterTick(timestamp) {
  if (subscribers.size === 0) {
    masterAnimId = null;
    return;
  }

  // If user switched tab or minimized window, idle without drawing
  if (typeof document !== 'undefined' && document.hidden) {
    masterAnimId = requestAnimationFrame(masterTick);
    return;
  }

  // Check if at least one subscriber is visible in viewport
  let anyVisible = false;
  for (const sub of subscribers) {
    if (sub.isIntersecting) {
      anyVisible = true;
      break;
    }
  }

  if (!anyVisible && isCacheComplete) {
    // When all logos are offscreen and cache is complete, sleep to save 100% CPU/battery
    masterAnimId = requestAnimationFrame(masterTick);
    return;
  }

  // When cache is complete: 0.0% CPU usage! No flood fill, no getImageData, no video decoding.
  // Cycles through pre-computed frames at silky-smooth 25fps (~40ms interval).
  if (isCacheComplete) {
    if (timestamp - lastTickTime >= 40) {
      lastTickTime = timestamp;
      currentFrameIndex = (currentFrameIndex + 1) % frameCache.length;
      const currentFrame = frameCache[currentFrameIndex];
      for (const sub of subscribers) {
        if (sub.isIntersecting) {
          sub.draw(currentFrame);
        }
      }
    }
    masterAnimId = requestAnimationFrame(masterTick);
    return;
  }

  // Still caching first video rotation (duration ~5.92s):
  const video = sharedVideo;
  if (video && video.videoWidth > 0 && !video.paused) {
    const curTime = video.currentTime;

    // Detect loop completion: video currentTime looped back or reached end
    if (lastVideoTime > 0 && curTime < lastVideoTime && frameCache.length >= 60) {
      isCacheComplete = true;
      video.pause(); // Video decoder is shut down!
      masterAnimId = requestAnimationFrame(masterTick);
      return;
    }

    if (curTime !== lastVideoTime && (timestamp - lastTickTime >= 35)) {
      lastVideoTime = curTime;
      lastTickTime = timestamp;

      const frameCanvas = processVideoFrame(video);
      if (frameCanvas) {
        frameCache.push(frameCanvas);
        for (const sub of subscribers) {
          if (sub.isIntersecting) {
            sub.draw(frameCanvas);
          }
        }
      }
    }
  }

  masterAnimId = requestAnimationFrame(masterTick);
}

function startMasterLoop() {
  if (!masterAnimId) {
    masterAnimId = requestAnimationFrame(masterTick);
  }
}

export default function BrandLogoVideo({ className = '', variant = 'nav', ariaLabel = 'Dharani Herbbals logo' }) {
  const canvasRef = useRef(null);
  const [videoStarted, setVideoStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = MASTER_SIZE;
    canvas.height = MASTER_SIZE;
    const ctx = canvas.getContext('2d');

    const subscriber = {
      isIntersecting: true,
      draw: (frameSource) => {
        if (!canvas) return;
        ctx.clearRect(0, 0, MASTER_SIZE, MASTER_SIZE);
        ctx.drawImage(frameSource, 0, 0, MASTER_SIZE, MASTER_SIZE);
        setVideoStarted(true);
      }
    };

    // If cache already has frames (e.g. page navigation or drawer toggle), render immediately!
    if (frameCache.length > 0) {
      const initialFrame = frameCache[currentFrameIndex] || frameCache[0];
      subscriber.draw(initialFrame);
    }

    subscribers.add(subscriber);

    const observer = new IntersectionObserver(([entry]) => {
      subscriber.isIntersecting = entry.isIntersecting;
      if (entry.isIntersecting && frameCache.length > 0) {
        subscriber.draw(frameCache[currentFrameIndex] || frameCache[0]);
      }
    }, { threshold: 0 });
    observer.observe(canvas);

    getSharedVideo();
    onVideoReady(() => {
      startMasterLoop();
    });
    startMasterLoop();

    return () => {
      subscribers.delete(subscriber);
      observer.disconnect();
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
