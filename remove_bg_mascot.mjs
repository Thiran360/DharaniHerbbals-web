// Remove white background from mascot image and save as transparent PNG
import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcPath = 'C:/Users/User/.gemini/antigravity/brain/20cb269a-937d-407a-ad6c-483fa8a1cf56/dharani_mascot_hd_1793465593445.jpg';
const outPath = path.join(__dirname, 'src', 'assets', 'dharani_avatar.png');

async function run() {
  const img = await Jimp.read(srcPath);
  const w = img.getWidth();
  const h = img.getHeight();
  console.log('Input:', w, 'x', h);

  // Remove white/near-white background
  // Sample white from corner pixel
  const cornerColor = img.getPixelColor(5, 5);
  const cornerRGBA = Jimp.intToRGBA(cornerColor);
  console.log('Corner color (bg reference):', cornerRGBA);

  const TOLERANCE = 35; // How close to white counts as background
  
  img.scan(0, 0, w, h, function(x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Check if pixel is close to white
    const distR = Math.abs(r - cornerRGBA.r);
    const distG = Math.abs(g - cornerRGBA.g);
    const distB = Math.abs(b - cornerRGBA.b);
    
    if (distR < TOLERANCE && distG < TOLERANCE && distB < TOLERANCE) {
      // Make fully transparent
      this.bitmap.data[idx + 3] = 0;
    } else if (distR < TOLERANCE + 20 && distG < TOLERANCE + 20 && distB < TOLERANCE + 20) {
      // Semi-transparent for anti-aliased edges (soft transition)
      const maxDist = Math.max(distR, distG, distB);
      const alpha = Math.min(255, Math.round((maxDist - TOLERANCE) * (255 / 20)));
      this.bitmap.data[idx + 3] = Math.max(alpha, 0);
    }
  });

  // Now auto-crop transparent edges
  let minX = w, maxX = 0, minY = h, maxY = 0;
  img.scan(0, 0, w, h, function(x, y, idx) {
    if (this.bitmap.data[idx + 3] > 10) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  });
  
  console.log('Content bounds:', minX, minY, 'to', maxX, maxY);
  
  const pad = 6;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(w, maxX + pad + 1) - cropX;
  const cropH = Math.min(h, maxY + pad + 1) - cropY;
  
  const cropped = img.clone().crop(cropX, cropY, cropW, cropH);
  console.log('Cropped:', cropped.getWidth(), 'x', cropped.getHeight());
  
  // Save as PNG with transparency
  await cropped.writeAsync(outPath);
  console.log('SUCCESS: saved to', outPath);
  
  const fs = await import('fs');
  const stat = fs.default.statSync(outPath);
  console.log('File size:', stat.size, 'bytes');
}

run().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});

