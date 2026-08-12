import Jimp from 'jimp';

const image = await Jimp.read('public/logo_frame2.png');

image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
  const r = this.bitmap.data[idx + 0];
  const g = this.bitmap.data[idx + 1];
  const b = this.bitmap.data[idx + 2];

  const minVal = Math.min(r, g, b);

  // Remove light grey/white background
  if (minVal > 140 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
    this.bitmap.data[idx + 3] = 0;
  }
});

await image.writeAsync('public/logo_static.png');
console.log('Saved logo_static.png');
