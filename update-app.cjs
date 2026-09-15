const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

const injection = `.then(data => {
        const mappedData = data.map(p => {
            const n = p.name ? p.name.toLowerCase().trim() : '';
            let injectedRating = p.rating || "0.0";
            let injectedReviews = p.reviews || 0;

            if (n === 'chemparuthi herbal shampoo') injectedRating = 5.0;
            if (n === 'onion shampoo') injectedRating = 5.0;
            if (n === 'rice kanji shampoo') injectedRating = 5.0;
            if (n === 'avarampoo pusu manjal jar') injectedRating = 4.0;
            if (n === 'multhani metti jar') injectedRating = 5.0;
            if (n === 'wild turmeric') injectedRating = 4.0;
            if (n === 'aloe vera facepack powder jar (for men)') injectedRating = 5.0;
            if (n === 'facepack powder(jar)') injectedRating = 5.0;
            if (n === 'nalangu powder jar') injectedRating = 4.5;
            if (n === 'multhani metti soap') injectedRating = 5.0;
            if (n === 'aloe vera soap') injectedRating = 5.0;
            if (n === 'balloon plant oil') injectedRating = 4.0;
            if (n === 'amutham nattu charkkarai') injectedRating = 5.0;
            if (n === 'karuppu kavuni rice') injectedRating = 5.0;
            if (n === 'kodo - moringa millet pongal mix 250g') injectedRating = 3.0;
            if (n === 'abc malt (jar)') injectedRating = 5.0;
            if (n === 'pirandai pickle') injectedRating = 5.0;
            if (n === 'ooty varkey') injectedRating = 5.0;

            if (n === 'chemparuthi herbal shampoo') injectedReviews = 4;
            if (n === 'onion shampoo') injectedReviews = 1;
            if (n === 'rice kanji shampoo') injectedReviews = 2;
            if (n === 'avarampoo pusu manjal jar') injectedReviews = 1;
            if (n === 'multhani metti jar') injectedReviews = 2;
            if (n === 'wild turmeric') injectedReviews = 1;
            if (n === 'aloe vera facepack powder jar (for men)') injectedReviews = 1;
            if (n === 'facepack powder(jar)') injectedReviews = 3;
            if (n === 'nalangu powder jar') injectedReviews = 2;
            if (n === 'multhani metti soap') injectedReviews = 1;
            if (n === 'aloe vera soap') injectedReviews = 1;
            if (n === 'balloon plant oil') injectedReviews = 1;
            if (n === 'amutham nattu charkkarai') injectedReviews = 1;
            if (n === 'karuppu kavuni rice') injectedReviews = 1;
            if (n === 'kodo - moringa millet pongal mix 250g') injectedReviews = 1;
            if (n === 'abc malt (jar)') injectedReviews = 1;
            if (n === 'pirandai pickle') injectedReviews = 1;
            if (n === 'ooty varkey') injectedReviews = 1;

            if (injectedRating === "0.0" || injectedRating == 0) injectedReviews = 0;

            return { ...p, rating: injectedRating, reviews: injectedReviews };
        });
        setFeaturedProducts(mappedData);
      })`;

app = app.replace(/\.then\(data => setFeaturedProducts\(data\)\)/, injection);

fs.writeFileSync('src/App.jsx', app, 'utf8');
