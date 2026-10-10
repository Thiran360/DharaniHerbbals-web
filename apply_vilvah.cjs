const fs = require('fs');
const path = require('path');

const indexCssPath = path.join(__dirname, 'src', 'index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');

indexCss = indexCss.replace(
  /:root \{[\s\S]*?\}/,
  `:root {
  /* Premium Vilvah-inspired Brand Palette */
  --color-primary: #526E46; /* Olive/Forest Green */
  --color-primary-light: #758D66; 
  --color-primary-dark: #3a4f32;
  --color-secondary: #E8E4D9; /* Soft Beige */
  
  /* Neutral Palette */
  --color-bg-light: #F7F5F0; /* Vilvah creamy background */
  --color-bg-dark: #F7F5F0;
  --color-surface-light: #ffffff;
  --color-surface-dark: #ffffff;
  
  --color-text-light: #2A3226;
  --color-text-dark: #2A3226;
  --color-text-muted-light: #5F6B58;
  --color-text-muted-dark: #5F6B58;
  
  /* Glassmorphism toned down */
  --glass-bg-light: rgba(255, 255, 255, 0.95);
  --glass-bg-dark: rgba(255, 255, 255, 0.95);
  --glass-border-light: rgba(82, 110, 70, 0.15);
  --glass-border-dark: rgba(82, 110, 70, 0.15);
  --glass-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);
  
  /* Typography */
  --font-sans: 'Outfit', system-ui, sans-serif;
  --font-serif: 'Lora', 'Georgia', serif;
  
  /* Transitions */
  --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Active Theme Variables */
  --bg: var(--color-bg-light);
  --surface: var(--color-surface-light);
  --text: var(--color-text-light);
  --text-muted: var(--color-text-muted-light);
  --glass-bg: var(--glass-bg-light);
  --glass-border: var(--glass-border-light);
  --border: rgba(82, 110, 70, 0.15);
}`
);

// Inject font Lora
if (!indexCss.includes('Lora')) {
  indexCss = "@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');\n" + indexCss;
}

// Ensure Headings use serif font
indexCss = indexCss.replace(
  /h1, h2, h3, h4, h5, h6 \{/,
  `h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);`
);

fs.writeFileSync(indexCssPath, indexCss);
console.log('Updated index.css');

const navbarCssPath = path.join(__dirname, 'src', 'components', 'Navbar.css');
let navbarCss = fs.readFileSync(navbarCssPath, 'utf8');

// Change Navbar to be cleaner and less bubbly
navbarCss = navbarCss.replace(
  /--bg-glass: rgba\(255, 255, 255, 0\.75\);/,
  '--bg-glass: #ffffff;'
).replace(
  /--bg-glass-scrolled: rgba\(255, 255, 255, 0\.9\);/,
  '--bg-glass-scrolled: #ffffff;'
).replace(
  /border-radius: 24px;/,
  'border-radius: 0; border-bottom: 1px solid var(--border); border-top: none; border-left: none; border-right: none;'
).replace(
  /box-shadow: 0 4px 30px rgba\(0, 0, 0, 0\.04\), inset 0 1px 0 rgba\(255, 255, 255, 0\.8\);/,
  'box-shadow: none;'
).replace(
  /border-radius: 100px;/, // For scrolled
  'border-radius: 0;'
);

fs.writeFileSync(navbarCssPath, navbarCss);
console.log('Updated Navbar.css');

const shopCssPath = path.join(__dirname, 'src', 'pages', 'Shop.css');
let shopCss = fs.readFileSync(shopCssPath, 'utf8');

// Update uc-card (Product Card) to look like Vilvah
// Remove shadows and borders, make Add to Cart a solid block button
shopCss = shopCss.replace(
  /\.uc-card \{[\s\S]*?border-radius:[\s\S]*?\}/g,
  `.uc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  box-shadow: none;
}`
);

// Also specifically find .uc-card block and append styles if needed.
// Wait, regex might be tricky. Let's append to the end of Shop.css instead to OVERRIDE everything gracefully!

shopCss += `
/* =======================================
   VILVAH PREMIUM OVERRIDES
   ======================================= */
.uc-card {
  border-radius: 8px !important;
  border: 1px solid rgba(82, 110, 70, 0.1) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02) !important;
  background: #ffffff !important;
}

.uc-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important;
  border-color: rgba(82, 110, 70, 0.3) !important;
}

.uc-img-section {
  border-radius: 8px 8px 0 0 !important;
  background: #fdfdfd !important;
}

.uc-title {
  font-family: var(--font-serif) !important;
  font-weight: 600 !important;
  font-size: 1.15rem !important;
  color: var(--color-text-light) !important;
}

.uc-add-text-btn {
  background: var(--color-primary) !important;
  color: white !important;
  border-radius: 4px !important;
  padding: 10px !important;
  width: 100% !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  box-shadow: none !important;
}

.uc-add-text-btn:hover {
  background: var(--color-primary-light) !important;
}

.shop-category-title {
  font-family: var(--font-serif) !important;
}

.bento-title-text {
  font-family: var(--font-serif) !important;
}

/* Cleanup glowing orbs */
.shop-root::before, .shop-root::after,
.bento-header-blob {
  display: none !important;
}

.shop-hero {
  background-color: var(--color-secondary) !important;
  background-image: none !important;
}

.shop-hero-title {
  font-family: var(--font-serif) !important;
  color: var(--color-primary-dark) !important;
}

.shop-hero-sub {
  color: var(--color-text-muted-light) !important;
}

.shop-btn-primary {
  background: var(--color-primary) !important;
  color: white !important;
  border-radius: 4px !important;
}

.navbar-ultra {
  padding: 0 !important;
}

.navbar-container {
  border-radius: 0 !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  background: #ffffff !important;
  box-shadow: 0 1px 5px rgba(0,0,0,0.05) !important;
}

.secondary-navbar-wrapper {
  background: var(--color-bg-light) !important;
  border-bottom: 1px solid rgba(82, 110, 70, 0.1) !important;
}

.sec-nav-item {
  color: var(--color-text-muted-light) !important;
  font-weight: 500 !important;
}

.sec-nav-item:hover, .sec-nav-item.active {
  color: var(--color-primary) !important;
}
`;

fs.writeFileSync(shopCssPath, shopCss);
console.log('Updated Shop.css');
