// Auto-crop the dharani avatar PNG to remove extra transparent space
// so the girl appears neat and well-framed in the popup card

const Jimp = require('jimp');
const path = require('path');

const srcPath = path.join('D:', 'DharaniHerbbals-web-main', 'DharaniHerbbals-web-main', 'src', 'assets', 'dharani_avatar.png');
const bakPath = path.join('D:', 'DharaniHerbbals-web-main', 'DharaniHerbbals-web-main', 'src', 'assets', 'dharani_avatar_backup.png');
const outPath = srcPath;

async function run() {
  const img = await Jimp.read(srcPath);
  console.log('Original size:', img.getWidth(), 'x', img.getHeight());

  // Save backup
  await img.writeAsync(bakPath);
  console.log('Backup saved:', bakPath);

  // Auto-crop: scan from all edges to find content bounds
  const w = img.getWidth();
  const h = img.getHeight();
  
  let minX = w, maxX = 0, minY = h, maxY = 0;
  const ALPHA_THRESHOLD = 15; // pixels with alpha < threshold are transparent
  
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
  
  // Add small padding (4px each side)
  const pad = 4;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(w, maxX + pad + 1) - cropX;
  const cropH = Math.min(h, maxY + pad + 1) - cropY;
  
  console.log('Crop:', cropX, cropY, cropW, 'x', cropH);
  
  // Crop tightly to content
  const cropped = img.clone().crop(cropX, cropY, cropW, cropH);
  console.log('Cropped size:', cropped.getWidth(), 'x', cropped.getHeight());
  
  await cropped.writeAsync(outPath);
  console.log('Saved cropped image to:', outPath);
}

run().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
