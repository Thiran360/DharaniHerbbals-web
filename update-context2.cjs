const fs = require('fs');

let content = fs.readFileSync('src/context/ProductsContext.jsx', 'utf8');

const newRatingLogic = `rating: (() => {
                const n = p.name ? p.name.toLowerCase() : '';
                if (n.includes('hibiscus')) return 5.0;
                if (n.includes('onion')) return 5.0;
                return p.rating || "0.0";
            })(),`;

const newReviewsLogic = `reviews: (() => {
                const n = p.name ? p.name.toLowerCase() : '';
                if (n.includes('hibiscus')) return 4;
                if (n.includes('onion')) return 1;
                return p.stock > 0 ? (p.stock * 3) : 124;
            })(),`;

content = content.replace(
  /rating: \(p\.name && p\.name\.toLowerCase\(\)\.includes\("hibiscus"\)\) \? 5\.0 : \(p\.rating \|\| "0\.0"\),/g,
  newRatingLogic
);

content = content.replace(
  /reviews: \(p\.name && p\.name\.toLowerCase\(\)\.includes\("hibiscus"\)\) \? 4 : \(p\.stock > 0 \? \(p\.stock \* 3\) : 124\),/g,
  newReviewsLogic
);

fs.writeFileSync('src/context/ProductsContext.jsx', content, 'utf8');
