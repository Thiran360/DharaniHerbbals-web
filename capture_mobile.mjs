import puppeteer from 'puppeteer';

(async () => {
  const uniqueDir = `C:/Users/User/AppData/Local/Temp/pup_${Date.now()}`;
  const browser = await puppeteer.launch({
    headless: 'new',
    userDataDir: uniqueDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('Navigating to http://localhost:5174/ ...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 20000 });

  await new Promise(r => setTimeout(r, 2000));

  // Check horizontal overflow
  const overflowInfo = await page.evaluate(() => {
    const docWidth = document.documentElement.offsetWidth;
    const bodyWidth = document.body.offsetWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const winWidth = window.innerWidth;
    
    // Find all elements overflowing horizontally
    const overflowingElements = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > winWidth + 2 || rect.left < -2) {
        overflowingElements.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        });
      }
    });

    return {
      docWidth,
      bodyWidth,
      scrollWidth,
      winWidth,
      hasHScroll: scrollWidth > winWidth,
      overflowingElements: overflowingElements.slice(0, 15)
    };
  });

  console.log('Overflow Info:', JSON.stringify(overflowInfo, null, 2));

  await page.screenshot({ path: 'd:/DharaniHerbbals-web-main/DharaniHerbbals-web-main/mobile_home_top.png' });

  // Scroll down a bit
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'd:/DharaniHerbbals-web-main/DharaniHerbbals-web-main/mobile_home_scrolled.png' });

  await browser.close();
  console.log('Screenshots saved!');
})();
