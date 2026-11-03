// Auto-crop avatar - ES Module version
import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcPath = path.join(__dirname, 'src', 'assets', 'dharani_avatar.png');
const bakPath = path.join(__dirname, 'src', 'assets', 'dharani_avatar_backup.png');

async function run() {
  const img = await Jimp.read(srcPath);
  console.log('Original size:', img.getWidth(), 'x', img.getHeight());

  // Save backup
  await img.writeAsync(bakPath);

  const w = img.getWidth();
  const h = img.getHeight();
  
  let minX = w, maxX = 0, minY = h, maxY = 0;
  const ALPHA_THRESHOLD = 15;
  
  img.scan(0, 0, w, h, function(x, y, idx) {
    const alpha = this.bitmap.data[idx + 3];
    if (alpha > ALPHA_THRESHOLD) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  });
  
  console.log('Content bounds:', minX, minY, 'to', maxX, maxY);
  
  const pad = 3;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(w, maxX + pad + 1) - cropX;
  const cropH = Math.min(h, maxY + pad + 1) - cropY;
  
  console.log('Cropping to:', cropX, cropY, cropW, 'x', cropH);
  
  const cropped = img.clone().crop(cropX, cropY, cropW, cropH);
  console.log('Result size:', cropped.getWidth(), 'x', cropped.getHeight());
  
  await cropped.writeAsync(srcPath);
  console.log('SUCCESS: saved to', srcPath);
}

run().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});

