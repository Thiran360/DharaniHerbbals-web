import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { statSync } from 'fs';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const inputPath = path.resolve('public/videos/vedanmart.mp4');
const outputPath = path.resolve('public/videos/vedanmart_small.mp4');
const framePath = path.resolve('public/logo_frame2.png');

console.log('Compressing video at higher quality...');

// Step 1: Compress video
ffmpeg(inputPath)
  .videoFilters(['crop=ih:ih', 'scale=400:400'])
  .outputOptions([
    '-c:v libx264',
    '-crf 24',
    '-preset slow',
    '-movflags faststart',
    '-an',
    '-r 24'
  ])
  .output(outputPath)
  .on('end', () => {
    const size = statSync(outputPath).size;
    console.log('Video done! Size:', (size / 1024).toFixed(1), 'KB');

    // Step 2: Extract a frame from the NEW compressed video
    console.log('Extracting frame...');
    ffmpeg(outputPath)
      .seekInput(0.5)
      .frames(1)
      .output(framePath)
      .on('end', () => {
        console.log('Frame extracted!');
      })
      .on('error', err => console.error('Frame error:', err.message))
      .run();
  })
  .on('error', err => console.error('Video error:', err.message))
  .run();
