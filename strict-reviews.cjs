const fs = require('fs');

let ctx = fs.readFileSync('src/context/ProductsContext.jsx', 'utf8');

const newRatingLogic = `rating: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                if (n === 'chemparuthi herbal shampoo') return 5.0;
                if (n === 'onion shampoo') return 5.0;
                if (n === 'rice kanji shampoo') return 5.0;
                return p.rating || "0.0";
            })(),`;

const newReviewsLogic = `reviews: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                if (n === 'chemparuthi herbal shampoo') return 4;
                if (n === 'onion shampoo') return 1;
                if (n === 'rice kanji shampoo') return 2;
                return p.reviews || 0;
            })(),`;

ctx = ctx.replace(/rating: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newRatingLogic);
ctx = ctx.replace(/reviews: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newReviewsLogic);

fs.writeFileSync('src/context/ProductsContext.jsx', ctx, 'utf8');

let det = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

det = det.replace(/if \(n\.includes\('chemparuthi herbal shampoo'\)\) \{/g, "if (n === 'chemparuthi herbal shampoo') {");
det = det.replace(/if \(n\.includes\('onion'\)\) \{/g, "if (n === 'onion shampoo') {");
det = det.replace(/if \(n\.includes\('rice kanji'\)\) \{/g, "if (n === 'rice kanji shampoo') {");
det = det.replace(/const n = currentProduct\.name\.toLowerCase\(\);/g, "const n = currentProduct.name.toLowerCase().trim();");

fs.writeFileSync('src/pages/ProductDetails.jsx', det, 'utf8');
