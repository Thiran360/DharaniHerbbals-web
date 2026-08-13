import { useRef, useEffect, useState } from 'react';
<<<<<<< HEAD
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
=======

const LOGO_SRC = '/videos/logo1.mp4';
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
  sharedVideo.preload = 'auto';
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

export default function BrandLogoVideo({ className = '', variant = 'title', ariaLabel = 'Vedan Mart logo' }) {
  const canvasRef = useRef(null);
  const [videoStarted, setVideoStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;
    let running = true;

    const targetSize = variant === 'nav' || variant === 'mobile-nav' ? 150 : 300; // Reduced size for performance
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

      // Only draw if visible and throttle to ~30 FPS (every 33ms) to save CPU/battery
      if (!isVisible || timestamp - lastDrawTime < 33) return;
      lastDrawTime = timestamp;

      const video = sharedVideo;
      if (video && video.videoWidth > 0 && !video.paused) {
        const zoomFactor = 1.0;
        const minDim = Math.min(video.videoWidth, video.videoHeight) / zoomFactor;
        const sx = (video.videoWidth - minDim) / 2;
        const sy = (video.videoHeight - minDim) / 2;

        ctx.clearRect(0, 0, targetSize, targetSize);
        ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, targetSize, targetSize);

        const frame = ctx.getImageData(0, 0, targetSize, targetSize);
        const data32 = new Uint32Array(frame.data.buffer);

        for (let i = 0; i < data32.length; i++) {
          const pixel = data32[i];
          const r = pixel & 0xFF;
          const g = (pixel >> 8) & 0xFF;
          const b = (pixel >> 16) & 0xFF;
          const maxVal = Math.max(r, g, b);
          const minVal = Math.min(r, g, b);

          if (maxVal < 25) {
            data32[i] = 0;
          } else if (maxVal < 65) {
            const alpha = Math.floor((maxVal - 25) * (255 / 40));
            data32[i] = (pixel & 0x00FFFFFF) | (alpha << 24);
          } else if (minVal > 150 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
            data32[i] = 0;
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
>>>>>>> master

  return (
    <span
      className={`brand-logo-video-wrap brand-logo-video-wrap--${variant} ${className}`}
      aria-label={ariaLabel}
<<<<<<< HEAD
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
=======
      style={{ display: 'inline-flex', position: 'relative', overflow: 'hidden' }}
    >
      {/* Animated canvas shown once video is ready */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: videoStarted ? 1 : 0,
          transition: 'opacity 0.3s ease-in'
>>>>>>> master
        }}
      />
    </span>
  );
}
