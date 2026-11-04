/**
 * searchHelper.js
 * Intelligent, verified, and relevance-ranked product search for Dharani Herbals storefront.
 *
 * Requirements:
 * - Matches across: Name, Tamil Name, Category, Description, Verified Ingredients, Verified Keywords & Synonyms.
 * - Handles case insensitivity, trimming, and spacing variants (e.g. "hairfall" vs "hair fall" vs "hair-fall").
 * - Supports multi-word queries (e.g. "hibiscus shampoo", "onion shampoo", "shampoo for hair fall").
 * - Precision: Multi-word queries require all core query concepts to be present in the product.
 * - Ranks exact product title and direct keyword matches above partial ingredient matches.
 * - Returns only genuine matching products without false positives or exaggerated claims.
 */

import { getProductDescription, getProductIngredients, getProductDirections } from '../data/productCatalogData.js';
import { getProductSearchKeywords } from './productSeo.js';

/**
 * Normalizes a string: trims, lowercases, removes excessive punctuation, and collapses spaces.
 */
export function normalizeSearchTerm(str = '') {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/['’]/g, '')             // remove apostrophes
    .replace(/[^\w\s\u0B80-\u0BFF]/gi, ' ') // keep letters, numbers, spaces, and Tamil Unicode
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Produces a spaceless version of a string for spacing-agnostic matching
 * (e.g., "hair fall" -> "hairfall", "face pack" -> "facepack").
 */
export function toCompactTerm(str = '') {
  return normalizeSearchTerm(str).replace(/\s+/g, '');
}

/**
 * Checks if a single term exists anywhere in the product record.
 */
function productContainsTerm(productData, term) {
  if (!term) return true;
  const compact = toCompactTerm(term);

  // Name & Tamil
  if (productData.name.includes(term) || productData.compactName.includes(compact)) return true;
  if (productData.rawName && (productData.rawName.includes(term) || (productData.compactRawName && productData.compactRawName.includes(compact)))) return true;
  if (productData.tamil.includes(term) || productData.compactTamil.includes(compact)) return true;

  // Category
  if (productData.category.includes(term) || productData.compactCategory.includes(compact)) return true;

  // Keywords & Synonyms
  for (const kw of productData.keywords) {
    if (kw.includes(term) || toCompactTerm(kw).includes(compact)) return true;
  }

  // Ingredients
  if (productData.ingredients.includes(term) || productData.compactIngredients.includes(compact)) return true;

  // Description
  if (productData.desc.includes(term) || productData.compactDesc.includes(compact)) return true;

  return false;
}

/**
 * Computes a relevance score for a product given a user search query.
 * Returns > 0 if the product matches, 0 if it does not match.
 *
 * @param {Object} product - Product record
 * @param {string} query - Raw search query
 * @returns {number} Relevance score (higher is better)
 */
export function getProductSearchScore(product, query) {
  if (!product) return 0;
  if (!query || !query.trim()) return 1;

  const rawQuery = query.trim().toLowerCase();
  const normQuery = normalizeSearchTerm(query);
  const compactQuery = toCompactTerm(query);

  if (!normQuery) return 1;

  // Extract structured corpus
  const pName = (product.name || '').toLowerCase();
  const rawPName = (product.raw_name || '').toLowerCase();
  const pTamil = (product.tamil_name || '').toLowerCase();
  const pCategory = (product.category_name || '').toLowerCase();
  const pSubtitle = (product.subtitle || '').toLowerCase();
  const pDesc = (getProductDescription(product) || product.description || '').toLowerCase();
  const ingredients = (getProductIngredients(product) || []).join(' ').toLowerCase();
  const keywords = (getProductSearchKeywords(product) || []).map(k => k.toLowerCase());

  // Confirmed spelling variations support (e.g. Multani Mitti <-> Multhani Metti, Peel <-> Peal)
  if (pName.includes('multani') || rawPName.includes('multhani') || pName.includes('metti') || rawPName.includes('metti')) {
    keywords.push('multani mitti', 'multhani metti', 'multani', 'multhani', 'mitti', 'metti', 'fullers earth');
  }
  if (pName.includes('peel') || rawPName.includes('peal')) {
    keywords.push('peel', 'peal');
  }

  const productData = {
    name: pName,
    compactName: toCompactTerm(pName),
    rawName: rawPName,
    compactRawName: toCompactTerm(rawPName),
    tamil: pTamil,
    compactTamil: toCompactTerm(pTamil),
    category: pCategory,
    compactCategory: toCompactTerm(pCategory),
    desc: pDesc,
    compactDesc: toCompactTerm(pDesc),
    ingredients: ingredients,
    compactIngredients: toCompactTerm(ingredients),
    keywords: keywords
  };

  // Check spacing-equivalence for whole query first (e.g. "hairfall" vs "hair fall")
  const wholeQueryMatches = productContainsTerm(productData, rawQuery) ||
    productContainsTerm(productData, normQuery) ||
    productData.compactName.includes(compactQuery) ||
    (productData.compactRawName && productData.compactRawName.includes(compactQuery)) ||
    productData.keywords.some(k => toCompactTerm(k).includes(compactQuery) || compactQuery.includes(toCompactTerm(k)));

  // Multi-token handling (e.g. "hibiscus shampoo", "onion shampoo", "baby shampoo")
  const stopWords = new Set(['for', 'in', 'and', 'the', 'with', 'from', 'of', 'to', 'a', 'an']);
  const queryTokens = normQuery.split(' ').filter(t => t.length > 1 && !stopWords.has(t));

  // If multi-word, ALL significant tokens must be present in the product
  if (queryTokens.length > 1) {
    // Special case: if the query itself is a spaced variation of a single concept like "hair fall",
    // and the product contains "hairfall" or "hair fall", it matches as a whole concept.
    const allTokensPresent = queryTokens.every(token => productContainsTerm(productData, token));
    
    if (!allTokensPresent && !wholeQueryMatches) {
      return 0; // Does NOT match all required query terms
    }
  } else if (!wholeQueryMatches) {
    return 0;
  }

  // ─── SCORING & RANKING ───
  let score = 50; // Base score for matching

  // 1. Direct Name Match
  if (pName === rawQuery || pName === normQuery) {
    score += 500;
  } else if (pName.startsWith(rawQuery) || pName.startsWith(normQuery)) {
    score += 350;
  } else if (pName.includes(rawQuery) || pName.includes(normQuery)) {
    score += 250;
  } else if (productData.compactName.includes(compactQuery)) {
    score += 220;
  }

  // 2. Keyword & Specific Synonym Matches
  for (const kw of keywords) {
    const normKw = normalizeSearchTerm(kw);
    const compactKw = toCompactTerm(kw);
    if (normKw === normQuery || compactKw === compactQuery) {
      score += 200;
    } else if (normKw.includes(normQuery) || compactKw.includes(compactQuery)) {
      score += 150;
    }
  }

  // 3. Multi-token specific name boosts
  if (queryTokens.length > 1) {
    const nameMatches = queryTokens.filter(t => pName.includes(t) || productData.compactName.includes(toCompactTerm(t))).length;
    if (nameMatches === queryTokens.length) {
      score += 300; // Entire multi-word query in product name!
    } else {
      score += nameMatches * 70;
    }
  }

  // 4. Category Match
  if (pCategory === normQuery || productData.compactCategory === compactQuery) {
    score += 100;
  } else if (pCategory.includes(normQuery) || productData.compactCategory.includes(compactQuery)) {
    score += 60;
  }

  // 5. Verified Ingredients & Description
  if (ingredients.includes(rawQuery) || ingredients.includes(normQuery)) {
    score += 60;
  }
  if (pDesc.includes(rawQuery) || pDesc.includes(normQuery)) {
    score += 30;
  }

  return score;
}

/**
 * Checks if a product matches a search query (boolean check)
 */
export function isProductSearchMatch(product, query) {
  return getProductSearchScore(product, query) > 0;
}

/**
 * Filter and sort a list of products by search relevance
 *
 * @param {Array} products - Array of product records
 * @param {string} query - User search query
 * @returns {Array} Filtered and ranked matching products
 */
export function searchProducts(products = [], query = '') {
  if (!Array.isArray(products)) return [];
  if (!query || !query.trim()) return products;

  return products
    .map(p => ({ product: p, score: getProductSearchScore(p, query) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
}
