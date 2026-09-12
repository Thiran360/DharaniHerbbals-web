const fs = require('fs');

let content = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

// Update auto-scroll logic
const autoScrollRegex = /useEffect\(\(\) => \{\s*const slider = sliderRef\.current;\s*if \(\!slider\) return;/g;
const autoScrollNew = `useEffect(() => {
      const slider = sliderRef.current;
      if (!slider || reviews.length <= 2) return;`;

content = content.replace(autoScrollRegex, autoScrollNew);

// Update JSX rendering
const jsxRegex = /<div className="pd-reviews-grid-slider" ref=\{sliderRef\}>\s*\{\[\.\.\.reviews, \.\.\.reviews, \.\.\.reviews, \.\.\.reviews\]\.map\(\(review, i\) => \(/g;
const jsxNew = `<div className="pd-reviews-grid-slider" ref={sliderRef} style={reviews.length <= 2 ? { overflow: 'hidden', flexWrap: 'wrap', justifyContent: 'flex-start' } : {}}>
                {(reviews.length > 2 ? [...reviews, ...reviews, ...reviews, ...reviews] : reviews).map((review, i) => (`

content = content.replace(jsxRegex, jsxNew);

fs.writeFileSync('src/pages/ProductDetails.jsx', content, 'utf8');
