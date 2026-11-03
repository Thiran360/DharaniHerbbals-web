// Resize to reasonable web size (400px wide max) and optimize
import Jimp from 'jimp';

const srcPath = 'D:/DharaniHerbbals-web-main/DharaniHerbbals-web-main/src/assets/dharani_avatar.png';

async function run() {
  const img = await Jimp.read(srcPath);
  console.log('Input:', img.getWidth(), 'x', img.getHeight());
  
  // Resize to 400px wide (keeps aspect ratio) - great for 2x/3x display at 96-130px
  img.resize(400, Jimp.AUTO, Jimp.RESIZE_LANCZOS3);
  console.log('Resized:', img.getWidth(), 'x', img.getHeight());
  
  // Set PNG compression quality
  img.deflateLevel(9);
  img.filterType(Jimp.PNG_FILTER_AUTO);
  
  await img.writeAsync(srcPath);
  
  const fs = await import('fs');
  const stat = fs.default.statSync(srcPath);
  console.log('File size:', stat.size, 'bytes', '(' + (stat.size/1024).toFixed(1) + ' KB)');
  console.log('SUCCESS');
}

run().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});

