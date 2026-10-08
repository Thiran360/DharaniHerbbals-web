const https = require('https');
https.get('https://dharaniherbbals.in/shop', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/<link rel=\"stylesheet\" crossorigin href=\"(\/assets\/Shop-[^\"]+\.css)\">/);
    if (match) {
      https.get('https://dharaniherbbals.in' + match[1], (cssRes) => {
        let cssData = '';
        cssRes.on('data', (chunk) => cssData += chunk);
        cssRes.on('end', () => {
          const blocks = cssData.split('}');
          blocks.forEach(block => {
            if (block.includes('.shop-hero-heading') || block.includes('.shop-hero-subheading') || block.includes('.shop-hero-badge') || block.includes('.shop-hero-cta-btn')) {
              console.log(block + '}');
            }
          });
        });
      });
    } else {
      console.log('No CSS found');
    }
  });
});
