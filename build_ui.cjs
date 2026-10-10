const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. Rewrite Navbar.jsx
const navbarPath = path.join(srcDir, 'components', 'Navbar.jsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// The screenshot shows:
// Top bar: Dark green, text, lang toggle, account, wishlist, cart
// Main bar: Logo, center links, search, wishlist, account, cart

const newNavbarCss = \`
/* New Navbar CSS matching screenshot */
.navbar-super {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #fff;
  font-family: 'Outfit', sans-serif;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.top-bar {
  background: #2B4C3B;
  color: white;
  padding: 8px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.top-bar-left span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.lang-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.main-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.nav-links a:hover {
  color: #2B4C3B;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-pill {
  border: 1px solid #e5e7eb;
  border-radius: 50px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 200px;
}

.search-pill input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.85rem;
}
\`;

fs.writeFileSync(path.join(srcDir, 'components', 'Navbar.css'), newNavbarCss);

// 2. Overhaul App.jsx Home component to match layout
const appPath = path.join(srcDir, 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Use regex to replace the Home component return statement
const homeReturnRegex = /return \(\s*<div style=\{\{ width: '100%' \}\}>[\s\S]*?<\/div>\s*\);\s*\}/;

const newHomeReturn = \`return (
    <div className="home-super-wrapper" style={{ width: '100%', paddingTop: '100px' }}>
      {/* Hero Section */}
      <section className="super-hero" style={{
        background: '#F7F5F0',
        padding: '60px 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '500px', zIndex: 2 }}>
          <p style={{ color: '#526E46', fontWeight: 700, letterSpacing: '1px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px' }}>Nature's Goodness for a Healthier You</p>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: '3.5rem', color: '#1a202c', lineHeight: 1.1, marginBottom: '24px' }}>Pure. Natural.<br/>Effective.</h1>
          <p style={{ color: '#4a5568', fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.6 }}>Discover the goodness of nature with Dharani Herbals. Explore our wide range of herbal products for your skin, hair, health and overall wellness.</p>
          <Link to="/shop" style={{ display: 'inline-block', background: '#2B4C3B', color: 'white', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontWeight: 600 }}>Shop Now →</Link>
          
          <div style={{ display: 'flex', gap: '24px', marginTop: '48px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}><Leaf size={16} color="#526E46"/> 100% Natural</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}><Shield size={16} color="#526E46"/> No Harmful Chemicals</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}><CheckCircle size={16} color="#526E46"/> Trusted Quality</span>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)', width: '55%', height: '120%', zIndex: 1 }}>
           <div style={{ width: '100%', height: '100%', background: 'url(https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80) center/cover', borderRadius: '50% 0 0 50%', opacity: 0.9 }}></div>
        </div>
      </section>

      {/* Shop by Category */}
      <section style={{ padding: '80px 5%', textAlign: 'center', background: '#fff' }}>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: '2.5rem', color: '#1a202c', fontStyle: 'italic', marginBottom: '8px' }}>Shop by Category</h2>
        <p style={{ color: '#4a5568', marginBottom: '40px' }}>Explore our wide range of natural products</p>
        <CategoryStrip />
      </section>

      {/* Best Sellers Section */}
      <section style={{ padding: '80px 5%', background: '#F0F5ED', display: 'flex', gap: '40px' }}>
        <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ color: '#526E46', fontWeight: 700, letterSpacing: '1px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px' }}>Our Top Picks</p>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: '3rem', color: '#1a202c', lineHeight: 1.1, marginBottom: '24px' }}>Best Sellers</h2>
          <p style={{ color: '#4a5568', fontSize: '1rem', marginBottom: '32px', lineHeight: 1.6 }}>Loved by many, these natural favorites are trusted for their quality and results.</p>
          <Link to="/shop?sort=bestsellers" style={{ display: 'inline-block', background: '#2B4C3B', color: 'white', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontWeight: 600, width: 'max-content' }}>View All →</Link>
        </div>
        
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ padding: '60px 5%', background: '#fff', borderBottom: '1px solid #eaeaea' }}>
         <TrustBadges />
      </section>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
\`;

appContent = appContent.replace(homeReturnRegex, newHomeReturn);

// Make sure icons are imported
if (!appContent.includes('Shield')) {
  appContent = appContent.replace(/import { Heart } from 'lucide-react';/, "import { Heart, Leaf, Shield, CheckCircle } from 'lucide-react';");
}

fs.writeFileSync(appPath, appContent);
console.log('Updated App.jsx layout');

// 3. Force ProductCard to match screenshot
const shopPath = path.join(srcDir, 'pages', 'Shop.jsx');
let shopContent = fs.readFileSync(shopPath, 'utf8');

// The product card in the screenshot has: 
// Image with light grey bg
// Title (bold, serif)
// Rating (orange star + score + (count))
// Price (bold)
// Add to Cart button (dark green, rounded)

// We already modified Shop.css, let's just make sure the CSS classes are robust.
const globalCssPath = path.join(srcDir, 'index.css');
let globalCss = fs.readFileSync(globalCssPath, 'utf8');

globalCss += \`
/* Screenshot match overrides */
.uc-card {
  background: #ffffff !important;
  border-radius: 12px !important;
  border: 1px solid #f0f0f0 !important;
  padding: 16px !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
  gap: 12px !important;
}
.uc-img-section {
  background: #F8F9FA !important;
  border-radius: 8px !important;
  height: 220px !important;
  width: 100% !important;
}
.uc-img {
  mix-blend-mode: multiply !important;
  object-fit: contain !important;
  padding: 20px !important;
}
.uc-info-section {
  padding: 0 !important;
}
.uc-title {
  font-family: 'Outfit', sans-serif !important;
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  color: #1a202c !important;
  margin-bottom: 6px !important;
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
  background: #3B5A49 !important;
  border-radius: 50px !important;
  padding: 12px !important;
  font-size: 0.9rem !important;
  margin-top: 12px !important;
}
.uc-add-text-btn:hover {
  background: #2B4C3B !important;
}
\`;

fs.writeFileSync(globalCssPath, globalCss);
console.log('Updated index.css overrides');
