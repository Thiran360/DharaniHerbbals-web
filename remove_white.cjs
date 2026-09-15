const Jimp = require('jimp');

async function removeWhite() {
  const image = await Jimp.read('src/assets/pirandai_pickle_real.jpg');
  
  // Iterate over all pixels
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];
    
    // If pixel is near-white (background), make it transparent
    if (red > 240 && green > 240 && blue > 240) {
      this.bitmap.data[idx + 3] = 0; // Alpha channel
    }
  });
  
  await image.writeAsync('src/assets/pirandai_pickle_transparent_v2.png');
  console.log('Done!');
}

removeWhite();
