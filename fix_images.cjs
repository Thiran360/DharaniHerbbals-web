const fs = require('fs');
const path = require('path');

const shopCssPath = path.join(__dirname, 'src', 'pages', 'Shop.css');
let shopCss = fs.readFileSync(shopCssPath, 'utf8');

const overrideCss = `
/* =======================================
   FIX VILVAH IMAGES
   ======================================= */
.uc-card {
  flex-direction: column !important;
}

.uc-img-section {
  width: 100% !important;
  height: 250px !important;
  border-radius: 8px 8px 0 0 !important;
  border: none !important;
  order: 1 !important;
  position: relative !important;
}

.uc-info-section {
  width: 100% !important;
  order: 2 !important;
}

.uc-img {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  mix-blend-mode: normal !important;
  padding: 0 !important;
  transform: none !important;
}

.uc-card:hover .uc-img {
  transform: scale(1.05) !important;
}

.uc-wishlist-btn {
  z-index: 10 !important;
}
`;

fs.writeFileSync(shopCssPath, shopCss + overrideCss);
console.log('Fixed images in Shop.css');
