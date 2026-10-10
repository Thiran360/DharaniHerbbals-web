const fs = require('fs');
const path = require('path');

const globalCssPath = path.join(__dirname, 'src', 'index.css');
let globalCss = fs.readFileSync(globalCssPath, 'utf8');

const overrides = `
/* =======================================
   EXACT SHOPIFY THEME MATCH (VILVAH-LIKE)
   ======================================= */

/* 1. Global Reset & Colors */
:root {
  --shopify-green: #2B4C3B;
  --shopify-green-light: #3B5A49;
  --shopify-bg-hero: #F7F5F0;
  --shopify-bg-bestsellers: #F0F5ED;
  --shopify-text: #1a202c;
  --shopify-text-muted: #4a5568;
}

body {
  background: #ffffff !important;
  color: var(--shopify-text) !important;
  font-family: 'Outfit', sans-serif !important;
}

/* 2. Topbar & Navbar Overrides */
.navbar-ultra {
  padding: 0 !important;
  background: #ffffff !important;
  border-bottom: 1px solid #eaeaea !important;
}

/* Inject a fake topbar using a pseudo-element on the navbar container */
.navbar-ultra::before {
  content: "Purely Natural | Chemical Free | Trusted Since 2010";
  display: flex;
  align-items: center;
  padding: 0 5%;
  height: 32px;
  background: var(--shopify-green);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.navbar-container {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 5% !important;
  height: auto !important;
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  border: none !important;
}

.secondary-navbar-wrapper {
  position: absolute;
  top: 45px; /* Position it in the middle of the navbar */
  left: 50%;
  transform: translateX(-50%);
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.secondary-navbar-container {
  display: flex;
  gap: 24px;
}

.sec-nav-item {
  color: #333 !important;
  font-weight: 500 !important;
  font-size: 0.85rem !important;
  text-transform: capitalize !important;
}

.desktop-search-bar {
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 50px !important;
  padding: 8px 16px !important;
  width: 200px !important;
}

/* Move the lang toggle and action buttons to align properly */
.nav-icons-right {
  gap: 16px !important;
  align-items: center !important;
}

.capsule-btn.cart-btn {
  background: var(--shopify-green) !important;
  color: white !important;
}

/* 3. Product Cards exact match */
.uc-card {
  background: #ffffff !important;
  border-radius: 12px !important;
  border: 1px solid #f0f0f0 !important;
  padding: 16px !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
  gap: 12px !important;
  flex-direction: column !important;
}

.uc-img-section {
  background: #F8F9FA !important;
  border-radius: 8px !important;
  height: 220px !important;
  width: 100% !important;
  border: none !important;
  position: relative !important;
  order: 1 !important;
}

.uc-img {
  mix-blend-mode: multiply !important;
  object-fit: contain !important;
  padding: 20px !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

.uc-info-section {
  padding: 0 !important;
  width: 100% !important;
  order: 2 !important;
}

.uc-title {
  font-family: 'Outfit', sans-serif !important;
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  color: #1a202c !important;
  margin-bottom: 6px !important;
  -webkit-line-clamp: 2 !important;
}

.uc-rating-row {
  color: #ed8936 !important;
  font-weight: 700 !important;
  font-size: 0.9rem !important;
}

.uc-review-count {
  color: #ed8936 !important;
}

.uc-price {
  font-size: 1.1rem !important;
  color: #1a202c !important;
  font-weight: 700 !important;
}

.uc-add-text-btn {
  background: var(--shopify-green-light) !important;
  border-radius: 50px !important;
  padding: 12px !important;
  font-size: 0.9rem !important;
  margin-top: 12px !important;
  width: 100% !important;
  text-align: center !important;
  justify-content: center !important;
  color: white !important;
}

.uc-add-text-btn:hover {
  background: var(--shopify-green) !important;
}

/* 4. Home Page layout overrides (Bento Header -> Hero match) */
.bento-header {
  background: var(--shopify-bg-hero) !important;
  border: none !important;
  border-radius: 0 !important;
  margin-top: 60px !important; /* spacing below nav */
  padding: 60px 5% !important;
  position: relative !important;
}

.bento-title-text {
  font-family: 'Lora', serif !important;
  font-size: 3.5rem !important;
  color: var(--shopify-text) !important;
  line-height: 1.1 !important;
}

.bento-desc-text {
  color: var(--shopify-text-muted) !important;
  font-size: 1.1rem !important;
}

.shop-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 24px !important;
}

/* 5. Clean up slider borders */
.promo-slider-item {
  border-radius: 12px !important;
  border: none !important;
}
`;

if (!globalCss.includes('EXACT SHOPIFY THEME MATCH')) {
  fs.writeFileSync(globalCssPath, globalCss + overrides);
  console.log('Appended shopify overrides');
} else {
  console.log('Already appended');
}
