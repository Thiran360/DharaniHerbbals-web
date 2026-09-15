const fs = require('fs');

let ctx = fs.readFileSync('src/context/ProductsContext.jsx', 'utf8');

const newRatingLogic = `rating: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                if (n === 'chemparuthi herbal shampoo') return 5.0;
                if (n === 'onion shampoo') return 5.0;
                if (n === 'rice kanji shampoo') return 5.0;
                if (n === 'avarampoo pusu manjal jar') return 4.0;
                if (n === 'multhani metti jar') return 5.0;
                if (n === 'wild turmeric') return 4.0;
                if (n === 'aloe vera facepack powder jar (for men)') return 5.0;
                if (n === 'facepack powder(jar)') return 5.0;
                if (n === 'nalangu powder jar') return 4.5;
                return p.rating || "0.0";
            })(),`;

const newReviewsLogic = `reviews: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                if (n === 'chemparuthi herbal shampoo') return 4;
                if (n === 'onion shampoo') return 1;
                if (n === 'rice kanji shampoo') return 2;
                if (n === 'avarampoo pusu manjal jar') return 1;
                if (n === 'multhani metti jar') return 2;
                if (n === 'wild turmeric') return 1;
                if (n === 'aloe vera facepack powder jar (for men)') return 1;
                if (n === 'facepack powder(jar)') return 3;
                if (n === 'nalangu powder jar') return 2;
                const r = p.rating || "0.0";
                if (r === "0.0" || r == 0) return 0;
                return p.reviews || 0;
            })(),`;

ctx = ctx.replace(/rating: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newRatingLogic);
ctx = ctx.replace(/reviews: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newReviewsLogic);

fs.writeFileSync('src/context/ProductsContext.jsx', ctx, 'utf8');

let det = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

const nalanguInjection = `
            if (n === 'nalangu powder jar') {
                const hardcodedReviews = [
                    { id: 'np1', name: 'Madhan', date: '9/24/2025', rating: 5.0, text: 'I’ve been using Nalangu Maavu regularly, and I can really see the difference in my skin. It feels much softer and smoother now. The natural coarse texture works as a gentle exfoliator, removing dead skin without any irritation. Over time, my skin has started to look fresher and has a natural glow. I love that it’s completely natural and chemical-free, making it safe for daily use. Definitely a great alternative to store-bought soaps and face washes!', initial: 'M', color: '#10b981' },
                    { id: 'np2', name: 'Sujatha', date: '7/22/2026', rating: 4.0, text: 'This product is great for regular use. Makes skin softer.', initial: 'S', color: '#f59e0b' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 4.5,
                    total_reviews: 2,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 }
                });
                return;
            }
`;

det = det.replace(/(if \(n === 'facepack powder\(jar\)'\) \{[\s\S]*?return;\s*\})/, "$1" + nalanguInjection);

fs.writeFileSync('src/pages/ProductDetails.jsx', det, 'utf8');
