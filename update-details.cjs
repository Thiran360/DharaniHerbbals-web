const fs = require('fs');

let content = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

const injectionCode = `
      const fetchReviewsAndSummary = async () => {
        if (!id) return;

        // INJECT HIBISCUS REVIEWS
        const currentProduct = products.find(p => p.id === parseInt(id));
        if (currentProduct && currentProduct.name && currentProduct.name.toLowerCase().includes('hibiscus')) {
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
`;

content = content.replace(
  /const fetchReviewsAndSummary = async \(\) => \{\s*if \(\!id\) return;/g,
  injectionCode
);

fs.writeFileSync('src/pages/ProductDetails.jsx', content, 'utf8');
