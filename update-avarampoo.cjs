const fs = require('fs');

let ctx = fs.readFileSync('src/context/ProductsContext.jsx', 'utf8');

const newRatingLogic = `rating: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                if (n === 'chemparuthi herbal shampoo') return 5.0;
                if (n === 'onion shampoo') return 5.0;
                if (n === 'rice kanji shampoo') return 5.0;
                if (n === 'avarampoo pusu manjal jar') return 4.0;
                return p.rating || "0.0";
            })(),`;

const newReviewsLogic = `reviews: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                if (n === 'chemparuthi herbal shampoo') return 4;
                if (n === 'onion shampoo') return 1;
                if (n === 'rice kanji shampoo') return 2;
                if (n === 'avarampoo pusu manjal jar') return 1;
                const r = p.rating || "0.0";
                if (r === "0.0" || r == 0) return 0;
                return p.reviews || 0;
            })(),`;

ctx = ctx.replace(/rating: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newRatingLogic);
ctx = ctx.replace(/reviews: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newReviewsLogic);

fs.writeFileSync('src/context/ProductsContext.jsx', ctx, 'utf8');

let det = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

const avarampooInjection = `
            if (n === 'avarampoo pusu manjal jar') {
                const hardcodedReviews = [
                    { id: 'av1', name: 'Karthikeyan', date: '2/12/2026', rating: 4.0, text: 'Nice product', initial: 'K', color: '#f59e0b' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 4.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 }
                });
                return;
            }
`;

det = det.replace(/(if \(n === 'rice kanji shampoo'\) \{[\s\S]*?return;\s*\})/, "$1" + avarampooInjection);

fs.writeFileSync('src/pages/ProductDetails.jsx', det, 'utf8');
