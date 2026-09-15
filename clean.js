import Jimp from 'jimp';

async function cleanLogo() {
  const image = await Jimp.read('public/logo_frame.png');
  
  // Crop to center (assume 1920x1080, logo is roughly in center)
  // Let's crop a 400x400 square from the center
  image.crop(1920/2 - 200, 1080/2 - 200, 400, 400);
  
  // Iterate over all pixels to remove checkerboard background
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    const minVal = Math.min(r, g, b);
    
    // Remove white/light grey checkerboard
    if (minVal > 150 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
      this.bitmap.data[idx + 3] = 0; // Alpha channel to 0
    }
  });
  
  await image.writeAsync('public/logo_clean.png');
  console.log('Done!');
}

cleanLogo();
