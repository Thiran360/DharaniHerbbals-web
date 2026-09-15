const fs = require('fs');

let content = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

const newInjection = `// INJECT HIBISCUS AND ONION AND RICE KANJI REVIEWS
        const currentProduct = products.find(p => p.id === parseInt(id));
        if (currentProduct && currentProduct.name) {
            const n = currentProduct.name.toLowerCase();
            if (n.includes('hibiscus')) {
                const hardcodedReviews = [
                    { id: 'h1', name: 'Karthik', date: '1/29/2026', rating: 5.0, text: 'Super product', initial: 'K', color: '#3b82f6' },
                    { id: 'h2', name: 'haris raj', date: '3/31/2026', rating: 5.0, text: 'good natural product no side effects', initial: 'H', color: '#10b981' },
                    { id: 'h3', name: 'Sanjaykrish', date: '3/31/2026', rating: 5.0, text: 'Smells good and reduce hair fall', initial: 'S', color: '#f59e0b' },
                    { id: 'h4', name: 'Sivakami S', date: '4/1/2026', rating: 5.0, text: 'Really help to reduce hair fall and make hair very shine', initial: 'S', color: '#ef4444' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 4,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 4 }
                });
                return;
            }
            if (n.includes('onion')) {
                const hardcodedReviews = [
                    { id: 'o1', name: 'L kokila', date: '9/2/2025', rating: 5.0, text: 'Good', initial: 'L', color: '#8b5cf6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
            if (n.includes('rice kanji')) {
                const hardcodedReviews = [
                    { id: 'rk1', name: 'Geetha', date: '3/31/2026', rating: 5.0, text: 'I received a sample of their newly updated rice water shampoo, and I tried it immediately. It’s absolutely amazing! The texture feels smooth, it lathers well, and my hair feels nourished and refreshed.', initial: 'G', color: '#ec4899' },
                    { id: 'rk2', name: 'G K DHARUN RAJ', date: '4/2/2026', rating: 5.0, text: 'This shampoo is really good and consistency is nice', initial: 'G', color: '#14b8a6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 2,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 }
                });
                return;
            }
        }`;

const regex = /\/\/ INJECT HIBISCUS AND ONION REVIEWS[\s\S]*?return;\s*\}\s*\}/;
content = content.replace(regex, newInjection);

fs.writeFileSync('src/pages/ProductDetails.jsx', content, 'utf8');
