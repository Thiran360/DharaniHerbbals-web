const fs = require('fs');

let ctx = fs.readFileSync('src/context/ProductsContext.jsx', 'utf8');

const newRatingLogic = `rating: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                if (n === 'chemparuthi herbal shampoo') return 5.0;
                if (n === 'onion shampoo') return 5.0;
                if (n === 'rice kanji shampoo') return 5.0;
                if (n === 'avarampoo pusu manjal jar') return 4.0;
                if (n === 'multhani metti jar') return 5.0;
                return p.rating || "0.0";
            })(),`;

const newReviewsLogic = `reviews: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                if (n === 'chemparuthi herbal shampoo') return 4;
                if (n === 'onion shampoo') return 1;
                if (n === 'rice kanji shampoo') return 2;
                if (n === 'avarampoo pusu manjal jar') return 1;
                if (n === 'multhani metti jar') return 2;
                const r = p.rating || "0.0";
                if (r === "0.0" || r == 0) return 0;
                return p.reviews || 0;
            })(),`;

ctx = ctx.replace(/rating: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newRatingLogic);
ctx = ctx.replace(/reviews: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newReviewsLogic);

fs.writeFileSync('src/context/ProductsContext.jsx', ctx, 'utf8');

let det = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

const multaniInjection = `
            if (n === 'multhani metti jar') {
                const hardcodedReviews = [
                    { id: 'm1', name: 'VARSHA C', date: '3/31/2026', rating: 5.0, text: 'I recently started using Multani Mitti, and even from the very beginning, I could see why it’s considered one of the best natural skincare ingredients. It leaves my skin feeling fresh, clean, and noticeably smoother after every use. I especially love how it absorbs excess oil without making my skin feel too dry.', initial: 'V', color: '#10b981' },
                    { id: 'm2', name: 'haris raj', date: '3/31/2026', rating: 5.0, text: 'I recently tried the 100 gm Mahil Multani Mitti and overall it’s a good budget-friendly skincare product', initial: 'H', color: '#3b82f6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 2,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 }
                });
                return;
            }
`;

det = det.replace(/(if \(n === 'avarampoo pusu manjal jar'\) \{[\s\S]*?return;\s*\})/, "$1" + multaniInjection);

fs.writeFileSync('src/pages/ProductDetails.jsx', det, 'utf8');
