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
                const r = p.rating || "0.0";
                if (r === "0.0" || r == 0) return 0;
                return p.reviews || 0;
            })(),`;

ctx = ctx.replace(/rating: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newRatingLogic);
ctx = ctx.replace(/reviews: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newReviewsLogic);

fs.writeFileSync('src/context/ProductsContext.jsx', ctx, 'utf8');

let det = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

const fpInjection = `
            if (n === 'facepack powder(jar)') {
                const hardcodedReviews = [
                    { id: 'fp1', name: 'Dharanya', date: '7/15/2025', rating: 5.0, text: 'The website is easy to navigate.', initial: 'D', color: '#ec4899' },
                    { id: 'fp2', name: 'Lavanya', date: '7/15/2025', rating: 5.0, text: 'Very useful and effective products.', initial: 'L', color: '#8b5cf6' },
                    { id: 'fp3', name: 'Sautanyha', date: '3/30/2026', rating: 5.0, text: 'I’ve been using Dharani Herbbals Facepack Powder for a few weeks now, and I can really see a nice glow on my skin. It feels gentle and has been working well for my daily routine.', initial: 'S', color: '#10b981' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 3,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 3 }
                });
                return;
            }
`;

det = det.replace(/(if \(n === 'aloe vera facepack powder jar \(for men\)'\) \{[\s\S]*?return;\s*\})/, "$1" + fpInjection);

fs.writeFileSync('src/pages/ProductDetails.jsx', det, 'utf8');
