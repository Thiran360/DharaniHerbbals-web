import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = "C:\\Users\\srira\\.gemini\\antigravity\\brain\\e82c38a7-e7bd-4a6d-8a87-98121c0ab848\\.user_uploaded\\media_1786423205548.png";
const outputPath = path.join(__dirname, 'public', 'favicon.png');

async function processFavicon() {
  try {
    const image = await loadImage(inputPath);
    console.log("Image loaded:", image.width, "x", image.height);
    
    // The "D" in the original logo is on the far left.
    // Let's crop a square from the left edge.
    // The logo is 1121x365 roughly? Let's just crop a square of height x height from the left.
    const size = image.height;
    
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Draw only the left square part
    ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);
    
    // Get image data to make white transparent
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If the pixel is very close to white, make it transparent
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0; // Set alpha to 0
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log("Favicon successfully generated and saved to", outputPath);
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

processFavicon();
