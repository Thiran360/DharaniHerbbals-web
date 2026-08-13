import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { statSync } from 'fs';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const inputPath = path.resolve('public/videos/vedanmart_small.mp4');
const outputPath = path.resolve('public/logo_frame2.png');

console.log('Extracting frame...');

ffmpeg(inputPath)
  .seekInput(0.5)
  .frames(1)
  .output(outputPath)
  .on('end', () => {
    console.log('Done! Size:', (statSync(outputPath).size / 1024).toFixed(1), 'KB');
  })
  .on('error', err => console.error('Error:', err.message))
  .run();
