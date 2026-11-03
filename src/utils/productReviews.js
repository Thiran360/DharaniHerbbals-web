import { API_BASE_URL } from '../services/api.js';

/**
 * Verified real customer reviews for genuine Dharani Herbals products.
 * Strict policy: Never invent fake reviews or artificial ratings.
 */
const VERIFIED_PRODUCT_REVIEWS_MAP = {
  'chemparuthi herbal shampoo': {
    summary: {
      average_rating: 5.0,
      total_reviews: 4,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 4 }
    },
    reviews: [
      { id: 'h1', name: 'Karthik', date: '1/29/2026', rating: 5.0, text: 'Super product', initial: 'K', color: '#3b82f6' },
      { id: 'h2', name: 'haris raj', date: '3/31/2026', rating: 5.0, text: 'good natural product no side effects', initial: 'H', color: '#10b981' },
      { id: 'h3', name: 'Sanjaykrish', date: '3/31/2026', rating: 5.0, text: 'Smells good and reduce hair fall', initial: 'S', color: '#f59e0b' },
      { id: 'h4', name: 'Sivakami S', date: '4/1/2026', rating: 5.0, text: 'Really help to reduce hair fall and make hair very shine', initial: 'S', color: '#ef4444' }
    ]
  },
  'onion shampoo': {
    summary: {
      average_rating: 5.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
    },
    reviews: [
      { id: 'o1', name: 'L kokila', date: '9/2/2025', rating: 5.0, text: 'Good', initial: 'L', color: '#8b5cf6' }
    ]
  },
  'rice kanji shampoo': {
    summary: {
      average_rating: 5.0,
      total_reviews: 2,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 }
    },
    reviews: [
      { id: 'rk1', name: 'Geetha', date: '3/31/2026', rating: 5.0, text: 'I received a sample of their newly updated rice water shampoo, and I tried it immediately. It’s absolutely amazing! The texture feels smooth, it lathers well, and my hair feels nourished and refreshed.', initial: 'G', color: '#ec4899' },
      { id: 'rk2', name: 'G K DHARUN RAJ', date: '4/2/2026', rating: 5.0, text: 'This shampoo is really good and consistency is nice', initial: 'G', color: '#14b8a6' }
    ]
  },
  'avarampoo pusu manjal jar': {
    summary: {
      average_rating: 4.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 }
    },
    reviews: [
      { id: 'av1', name: 'Karthikeyan', date: '2/12/2026', rating: 4.0, text: 'Nice product', initial: 'K', color: '#f59e0b' }
    ]
  },
  'multhani metti jar': {
    summary: {
      average_rating: 5.0,
      total_reviews: 2,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 }
    },
    reviews: [
      { id: 'm1', name: 'VARSHA C', date: '3/31/2026', rating: 5.0, text: 'I recently started using Multani Mitti, and even from the very beginning, I could see why it’s considered one of the best natural skincare ingredients. It leaves my skin feeling fresh, clean, and noticeably smoother after every use. I especially love how it absorbs excess oil without making my skin feel too dry.', initial: 'V', color: '#10b981' },
      { id: 'm2', name: 'haris raj', date: '3/31/2026', rating: 5.0, text: 'I recently tried the 100 gm Mahil Multani Mitti and overall it’s a good budget-friendly skincare product', initial: 'H', color: '#3b82f6' }
    ]
  },
  'wild turmeric': {
    summary: {
      average_rating: 4.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 }
    },
    reviews: [
      { id: 'wt1', name: 'Madhan', date: '4/1/2026', rating: 4.0, text: 'Amazing Product!', initial: 'M', color: '#f59e0b' }
    ]
  },
  'aloe vera facepack powder jar (for men)': {
    summary: {
      average_rating: 5.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
    },
    reviews: [
      { id: 'avm1', name: 'Madhan', date: '4/1/2026', rating: 5.0, text: 'Amazing Product!', initial: 'M', color: '#3b82f6' }
    ]
  },
  'facepack powder(jar)': {
    summary: {
      average_rating: 5.0,
      total_reviews: 3,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 3 }
    },
    reviews: [
      { id: 'fp1', name: 'Dharanya', date: '7/15/2025', rating: 5.0, text: 'The website is easy to navigate.', initial: 'D', color: '#ec4899' },
      { id: 'fp2', name: 'Lavanya', date: '7/15/2025', rating: 5.0, text: 'Very useful and effective products.', initial: 'L', color: '#8b5cf6' },
      { id: 'fp3', name: 'Sautanyha', date: '3/30/2026', rating: 5.0, text: 'I’ve been using Dharani Herbbals Facepack Powder for a few weeks now, and I can really see a nice glow on my skin. It feels gentle and has been working well for my daily routine.', initial: 'S', color: '#10b981' }
    ]
  },
  'nalangu powder jar': {
    summary: {
      average_rating: 4.5,
      total_reviews: 2,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 }
    },
    reviews: [
      { id: 'np1', name: 'Madhan', date: '9/24/2025', rating: 5.0, text: 'I’ve been using Nalangu Maavu regularly, and I can really see the difference in my skin. It feels much softer and smoother now. The natural coarse texture works as a gentle exfoliator, removing dead skin without any irritation. Over time, my skin has started to look fresher and has a natural glow. I love that it’s completely natural and chemical-free, making it safe for daily use. Definitely a great alternative to store-bought soaps and face washes!', initial: 'M', color: '#10b981' },
      { id: 'np2', name: 'Sujatha', date: '7/22/2026', rating: 4.0, text: 'This product is great for regular use. Makes skin softer.', initial: 'S', color: '#f59e0b' }
    ]
  },
  'multhani metti soap': {
    summary: {
      average_rating: 5.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
    },
    reviews: [
      { id: 'mms1', name: 'Sautanyha', date: '3/31/2026', rating: 5.0, text: 'Recently had the opportunity to visit the company during soap manufacturing. It was a great experience to see the process firsthand. I also tried the soaps , they are really good.', initial: 'S', color: '#8b5cf6' }
    ]
  },
  'aloe vera soap': {
    summary: {
      average_rating: 5.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
    },
    reviews: [
      { id: 'avs1', name: 'Geetha', date: '4/2/2026', rating: 5.0, text: 'Tried so many products until i found "DHARANI HERBBALS" for my skin issues, but this is one that truly made a difference. My skin feels healthier and more balanced now.', initial: 'G', color: '#10b981' }
    ]
  },
  'balloon plant oil': {
    summary: {
      average_rating: 4.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 }
    },
    reviews: [
      { id: 'bpo1', name: 'Kasinathan', date: '9/8/2025', rating: 4.0, text: 'Good', initial: 'K', color: '#f59e0b' }
    ]
  },
  'amutham nattu charkkarai': {
    summary: {
      average_rating: 5.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
    },
    reviews: [
      { id: 'anc1', name: 'Ravikumar', date: '7/17/2026', rating: 5.0, text: 'Good', initial: 'R', color: '#ec4899' }
    ]
  },
  'karuppu kavuni rice': {
    summary: {
      average_rating: 5.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
    },
    reviews: [
      { id: 'kkr1', name: 'Geetha', date: '3/31/2026', rating: 5.0, text: 'As a student, I hardly get time to focus on proper nutrition. I tried Karuppu Kavuni rice to make up for essential vitamins and minerals, and it has been a wonderful choice.', initial: 'G', color: '#10b981' }
    ]
  },
  'kodo - moringa millet pongal mix 250g': {
    summary: {
      average_rating: 3.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }
    },
    reviews: [
      { id: 'km1', name: 'sowmiya', date: '7/7/2026', rating: 3.0, text: 'good quality', initial: 'S', color: '#f59e0b' }
    ]
  },
  'abc malt (jar)': {
    summary: {
      average_rating: 5.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
    },
    reviews: [
      { id: 'abc1', name: 'Sautanyha', date: '3/31/2026', rating: 5.0, text: 'Genuinely delighted with this health mix, the natural aroma is simply wonderful. It gives a sense of purity and nourishment in every sip, and it has become my absolute favorite.', initial: 'S', color: '#10b981' }
    ]
  },
  'pirandai pickle': {
    summary: {
      average_rating: 5.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
    },
    reviews: [
      { id: 'pp1', name: 'Pranesh S', date: '3/31/2026', rating: 5.0, text: 'Awesome Product', initial: 'P', color: '#f59e0b' }
    ]
  },
  'ooty varkey': {
    summary: {
      average_rating: 5.0,
      total_reviews: 1,
      rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
    },
    reviews: [
      { id: 'ov1', name: 'DHIVYA DHARSHINI S', date: '3/31/2026', rating: 5.0, text: 'Varkey for snacks is really delicious! The taste takes me back and beautifully resembles the nostalgic flavors of Ooty.', initial: 'D', color: '#8b5cf6' }
    ]
  }
};

// Aliases for standardized display names
VERIFIED_PRODUCT_REVIEWS_MAP['multani mitti jar'] = VERIFIED_PRODUCT_REVIEWS_MAP['multhani metti jar'];
VERIFIED_PRODUCT_REVIEWS_MAP['multani mitti soap'] = VERIFIED_PRODUCT_REVIEWS_MAP['multhani metti soap'];
VERIFIED_PRODUCT_REVIEWS_MAP['facepack powder'] = VERIFIED_PRODUCT_REVIEWS_MAP['facepack powder(jar)'];
VERIFIED_PRODUCT_REVIEWS_MAP['abc malt'] = VERIFIED_PRODUCT_REVIEWS_MAP['abc malt (jar)'];

/**
 * Fetch verified reviews and summary for a product.
 * Returns only genuine reviews or empty arrays.
 */
export async function getProductReviewsAndSummary(productId, productName = '') {
  const normName = (productName || '').toLowerCase().trim();
  let hardcoded = VERIFIED_PRODUCT_REVIEWS_MAP[normName];
  if (!hardcoded && (normName.includes('multani mitti') || normName.includes('multhani metti'))) {
    if (normName.includes('jar')) hardcoded = VERIFIED_PRODUCT_REVIEWS_MAP['multhani metti jar'];
    else if (normName.includes('soap')) hardcoded = VERIFIED_PRODUCT_REVIEWS_MAP['multhani metti soap'];
  }

  if (hardcoded) {
    return {
      reviews: hardcoded.reviews,
      summary: hardcoded.summary
    };
  }

  if (!productId) {
    return { reviews: [], summary: null };
  }

  try {
    const [revRes, sumRes] = await Promise.all([
      fetch(`${API_BASE_URL}/products/${productId}/reviews/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      }),
      fetch(`${API_BASE_URL}/products/${productId}/review-summary/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
    ]);

    let reviews = [];
    let summary = null;

    if (revRes.ok) {
      const data = await revRes.json();
      if (data && data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
        reviews = data.reviews.map((r, i) => ({
          id: r.id || Date.now() + i,
          name: r.user_name || r.customer_name || `Customer ${r.user_id || ''}`.trim(),
          date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently',
          rating: Number(r.rating) || 5,
          text: r.review_text || r.text || '',
          initial: (r.user_name || r.customer_name || 'C').charAt(0).toUpperCase(),
          color: colors[i % colors.length]
        }));
      }
    }

    if (sumRes.ok) {
      const sumData = await sumRes.json();
      if (sumData && Number(sumData.total_reviews) > 0 && Number(sumData.average_rating) > 0) {
        summary = sumData;
      }
    }

    return { reviews, summary };
  } catch (e) {
    return { reviews: [], summary: null };
  }
}

/**
 * Synchronous helper to get verified genuine review summary for a product.
 * Returns { rating: number, reviews: number } only if genuine reviews exist.
 * Returns null if the product has no reviews or invalid reviews.
 * Strict rule: Never invent ratings or reviews!
 */
export function getVerifiedReviewData(product) {
  if (!product) return null;
  const n = (product.name || '').toLowerCase().trim();
  const rawN = (product.raw_name || '').toLowerCase().trim();
  let entry = VERIFIED_PRODUCT_REVIEWS_MAP[n] || VERIFIED_PRODUCT_REVIEWS_MAP[rawN];
  if (!entry && (n.includes('multani mitti') || n.includes('multhani metti') || rawN.includes('multani mitti') || rawN.includes('multhani metti'))) {
    if (n.includes('jar') || rawN.includes('jar')) entry = VERIFIED_PRODUCT_REVIEWS_MAP['multhani metti jar'];
    else if (n.includes('soap') || rawN.includes('soap')) entry = VERIFIED_PRODUCT_REVIEWS_MAP['multhani metti soap'];
  }
  if (entry && entry.summary && entry.summary.total_reviews > 0 && entry.summary.average_rating > 0) {
    return {
      rating: Number(entry.summary.average_rating),
      reviews: Number(entry.summary.total_reviews)
    };
  }
  const r = (product.rating !== null && product.rating !== undefined && product.rating !== '') ? Number(product.rating) : null;
  const rev = (product.reviews !== null && product.reviews !== undefined && product.reviews !== '') ? Number(product.reviews) : null;
  if (r !== null && !isNaN(r) && r > 0 && rev !== null && !isNaN(rev) && rev > 0) {
    return {
      rating: r,
      reviews: rev
    };
  }
  return null;
}
