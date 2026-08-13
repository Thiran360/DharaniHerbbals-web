import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // We can load a simple HTML containing the video and capture a screenshot
  const html = `
    <html>
      <body style="margin: 0; padding: 0;">
        <video id="vid" src="file://${path.resolve('public/videos/vedanmart.mp4').replace(/\\/g, '/')}" autoplay muted style="width: 1920px; height: 1080px;"></video>
        <script>
          const v = document.getElementById('vid');
          v.oncanplay = () => {
            v.currentTime = 1.0; // seek to 1 sec
          };
        </script>
      </body>
    </html>
  `;
  
  await page.setContent(html);
  await page.setViewport({ width: 1920, height: 1080 });
  
  // wait for seek
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: 'public/logo_frame.png' });
  
  await browser.close();
  console.log('done');
})();
