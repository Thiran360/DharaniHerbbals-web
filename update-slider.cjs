const fs = require('fs');

let content = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

// Update auto-scroll logic
const autoScrollOld = `    useEffect(() => {
      const slider = sliderRef.current;
      if (!slider) return;`;

const autoScrollNew = `    useEffect(() => {
      const slider = sliderRef.current;
      if (!slider || reviews.length <= 2) return;`;

content = content.replace(autoScrollOld, autoScrollNew);

// Update JSX rendering
const jsxOld = `<div className="pd-reviews-grid-slider" ref={sliderRef}>
                {[...reviews, ...reviews, ...reviews, ...reviews].map((review, i) => (`

const jsxNew = `<div className="pd-reviews-grid-slider" ref={sliderRef} style={reviews.length <= 2 ? { overflow: 'hidden', flexWrap: 'wrap', justifyContent: 'flex-start' } : {}}>
                {(reviews.length > 2 ? [...reviews, ...reviews, ...reviews, ...reviews] : reviews).map((review, i) => (`

content = content.replace(jsxOld, jsxNew);

fs.writeFileSync('src/pages/ProductDetails.jsx', content, 'utf8');
