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
                if (n === 'multhani metti soap') return 5.0;
                if (n === 'aloe vera soap') return 5.0;
                if (n === 'balloon plant oil') return 4.0;
                if (n === 'amutham nattu charkkarai') return 5.0;
                if (n === 'karuppu kavuni rice') return 5.0;
                if (n === 'kodo - moringa millet pongal mix 250g') return 3.0;
                if (n === 'abc malt (jar)') return 5.0;
                if (n === 'pirandai pickle') return 5.0;
                if (n === 'ooty varkey') return 5.0;
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
                if (n === 'multhani metti soap') return 1;
                if (n === 'aloe vera soap') return 1;
                if (n === 'balloon plant oil') return 1;
                if (n === 'amutham nattu charkkarai') return 1;
                if (n === 'karuppu kavuni rice') return 1;
                if (n === 'kodo - moringa millet pongal mix 250g') return 1;
                if (n === 'abc malt (jar)') return 1;
                if (n === 'pirandai pickle') return 1;
                if (n === 'ooty varkey') return 1;
                const r = p.rating || "0.0";
                if (r === "0.0" || r == 0) return 0;
                return p.reviews || 0;
            })(),`;

ctx = ctx.replace(/rating: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newRatingLogic);
ctx = ctx.replace(/reviews: \(\(\) => \{[\s\S]*?\}\)\(\),/g, newReviewsLogic);

fs.writeFileSync('src/context/ProductsContext.jsx', ctx, 'utf8');

let det = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

const ootyInjection = `
            if (n === 'ooty varkey') {
                const hardcodedReviews = [
                    { id: 'ov1', name: 'DHIVYA DHARSHINI S', date: '3/31/2026', rating: 5.0, text: 'Varkey for snacks is really delicious! The taste takes me back and beautifully resembles the nostalgic flavors of Ooty.', initial: 'D', color: '#8b5cf6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
`;

det = det.replace(/(if \(n === 'pirandai pickle'\) \{[\s\S]*?return;\s*\})/, "$1" + ootyInjection);

fs.writeFileSync('src/pages/ProductDetails.jsx', det, 'utf8');
