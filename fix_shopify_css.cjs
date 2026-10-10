const fs = require('fs');
const path = require('path');

const globalCssPath = path.join(__dirname, 'src', 'index.css');
let globalCss = fs.readFileSync(globalCssPath, 'utf8');

// Remove the previously appended Shopify overrides
globalCss = globalCss.replace(/\/\* =======================================\n   EXACT SHOPIFY THEME MATCH.*?$/s, '');

// Append correct overrides
const overrides = `
/* =======================================
   EXACT SHOPIFY THEME MATCH (FIXED)
   ======================================= */
:root {
  --shopify-green: #2B4C3B;
  --shopify-green-light: #3B5A49;
  --shopify-bg-hero: #F7F5F0;
  --shopify-text: #1a202c;
  --shopify-text-muted: #4a5568;
}

body {
  background: #ffffff !important;
  color: var(--shopify-text) !important;
  font-family: 'Outfit', sans-serif !important;
}

/* 1. Navbar Fixes */
.navbar-ultra {
  padding: 0 !important;
  background: #ffffff !important;
  border-bottom: 1px solid #eaeaea !important;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.navbar-ultra::before {
  content: "Purely Natural | Chemical Free | Trusted Since 2010";
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 36px;
  background: var(--shopify-green);
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.navbar-container {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 5% !important;
  background: #ffffff !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  border: none !important;
  width: 100% !important;
  max-width: 100% !important;
}

.nav-brand-container {
  display: flex;
  align-items: center;
}

.brand-text-logo {
  color: var(--shopify-green) !important;
}

.nav-icons-right {
  display: flex !important;
  align-items: center !important;
  gap: 16px !important;
}

.secondary-navbar-wrapper {
  background: #ffffff !important;
  border-top: 1px solid #f0f0f0 !important;
  border-bottom: 1px solid #eaeaea !important;
  padding: 0 !important;
  box-shadow: none !important;
  position: relative !important;
  transform: none !important;
  left: auto !important;
  top: auto !important;
  width: 100%;
  display: flex;
  justify-content: center;
}

.secondary-navbar-container {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 12px 0;
}

.sec-nav-item {
  color: #333 !important;
  font-weight: 500 !important;
  font-size: 0.9rem !important;
  text-transform: capitalize !important;
}

.desktop-search-bar {
  background: #f3f4f6 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 50px !important;
  padding: 8px 16px !important;
  width: 250px !important;
  display: flex !important;
  align-items: center !important;
}

.desktop-search-bar input {
  background: transparent !important;
}

.lang-switcher-capsule {
  background: #f3f4f6 !important;
}

/* Product Cards */
.uc-card {
  background: #ffffff !important;
  border-radius: 12px !important;
  border: 1px solid #f0f0f0 !important;
  padding: 16px !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
  gap: 12px !important;
  flex-direction: column !important;
  display: flex !important;
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
`;

fs.writeFileSync(globalCssPath, globalCss + overrides);
console.log('Fixed index.css');
