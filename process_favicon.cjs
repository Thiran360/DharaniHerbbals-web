const Jimp = require('jimp');
const path = require('path');

const inputPath = "C:\\Users\\srira\\.gemini\\antigravity\\brain\\e82c38a7-e7bd-4a6d-8a87-98121c0ab848\\.user_uploaded\\media_1786423205548.png";
const outputPath = path.join(__dirname, 'public', 'favicon.png');

async function processFavicon() {
  try {
    const image = await Jimp.read(inputPath);
    console.log("Image loaded:", image.bitmap.width, "x", image.bitmap.height);
    
    // First, crop only the left 30% of the image to isolate the "D" from the "Dharani Herbbals" text
    // The total width is 1186px, the D seems to occupy roughly the first 300px based on aspect ratio
    const dWidth = Math.floor(image.bitmap.width * 0.25);
    image.crop(0, 0, dWidth, image.bitmap.height);
    console.log("Cropped to D area:", dWidth, "x", image.bitmap.height);

    // Make white pixels transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is close to white, make it fully transparent
      if (red > 230 && green > 230 && blue > 230) {
        this.bitmap.data[idx + 3] = 0; // alpha to 0
      }
    });

    // Autocrop the transparent boundaries perfectly tight to the 'D'
    image.autocrop();
    console.log("Autocropped tight to D:", image.bitmap.width, "x", image.bitmap.height);

    // Create a square canvas matching the largest dimension
    const size = Math.max(image.bitmap.width, image.bitmap.height);
    const canvas = new Jimp(size, size, 0x00000000); // fully transparent

    // Center the 'D' on the square canvas
    const x = Math.floor((size - image.bitmap.width) / 2);
    const y = Math.floor((size - image.bitmap.height) / 2);
    canvas.composite(image, x, y);

    // Save the final favicon!
    await canvas.writeAsync(outputPath);
    console.log("Favicon successfully generated and saved to", outputPath);
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

processFavicon();
