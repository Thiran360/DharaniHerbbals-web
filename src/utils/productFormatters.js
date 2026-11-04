/**
 * productFormatters.js
 * Utility functions for pack size normalization, variation formatting,
 * and description sanitization for Dharani Herbals products.
 */

import { getProductVariations, getDefaultVariation } from '../data/productVariationsData.js';

/**
 * Format and normalize product pack size / weight / volume.
 * Uses the authoritative selected or default variation when available,
 * while safely preserving the actual weight or volume for single-size products.
 *
 * @param {Object} product - Product record
 * @returns {string} Formatted pack size, e.g. "250 g", "100 ml", "1.3 kg", or ""
 */
export function formatProductPackSize(product) {
  if (!product) return '';

  // 1. If explicit selected variation is present, use it
  if (product.selected_variation) {
    return formatVariationLabel(product.selected_variation, product);
  }

  // 2. If explicit default variation is present, use it
  if (product.default_variation) {
    return formatVariationLabel(product.default_variation, product);
  }

  // 3. If product has variations attached, format the default matching variation
  if (Array.isArray(product.variations) && product.variations.length > 0) {
    const def = getDefaultVariation(product, product.variations);
    if (def) {
      return formatVariationLabel(def, product);
    }
  }

  // 4. Check global product variations registry
  if (product.id) {
    const vars = getProductVariations(product.id);
    if (vars && vars.length > 0) {
      const def = getDefaultVariation(product, vars);
      if (def) {
        return formatVariationLabel(def, product);
      }
    }
  }

  // 5. Check product name for explicit pack size first (e.g. "500ml", "300ml", "250g", "50g")
  const rawName = String(product.name || product.raw_name || '');
  const nameMatch = rawName.match(/(\d+(?:\.\d+)?)\s*(gm|gms|gram|grams|g|ml|mls|milliliter|millilitres|l|ltr|liters|litres|liter|kg|kgs)\b/i);
  if (nameMatch) {
    let num = parseFloat(nameMatch[1]);
    let u = nameMatch[2].toLowerCase();
    if (u.startsWith('k')) u = 'kg';
    else if (u.startsWith('m')) u = 'ml';
    else if (u.startsWith('l')) u = 'L';
    else u = 'g';
    return `${num} ${u}`;
  }

  let wv = product.weight_volume;
  let unit = product.unit ? String(product.unit).trim() : '';

  // Check if unit is invalid or an ERP packaging stock unit (NOS, PCS, etc.)
  const isInvalidUnit = !unit || /^(?:nos|no|pcs|pc|piece|pieces|ea|each|pkt|pack|box)$/i.test(unit);

  // 6. Extract embedded numbers and units (e.g. "500 gm", "0.250 ML")
  if (typeof wv === 'string') {
    const embeddedMatch = wv.trim().match(/^(\d+(?:\.\d+)?)\s*(gm|g|kg|ml|l|mg)?$/i);
    if (embeddedMatch) {
      wv = embeddedMatch[1];
      if (embeddedMatch[2]) {
        const embeddedUnit = embeddedMatch[2].toLowerCase();
        // If embedded unit is "gm" or accidentally "mg", normalize to "g"
        if (embeddedUnit === 'gm' || embeddedUnit === 'mg') {
          unit = 'g';
        } else {
          unit = embeddedUnit;
        }
      }
    }
  }

  const num = parseFloat(wv);
  if (isNaN(num) || num <= 0) {
    return '';
  }

  const isLiquid = /oil|shampoo|juice|sherbet|syrup|water|liquid|wash/i.test(rawName);
  const defaultUnit = isLiquid ? 'ml' : 'g';

  // 7. If unit is an ERP unit like NOS or PCS, convert decimal numbers to clean grams/ml
  if (isInvalidUnit) {
    if (num < 1) {
      return `${Math.round(num * 1000)} ${defaultUnit}`;
    }
    return `${num} ${defaultUnit}`;
  }

  const unitUpper = unit.toUpperCase();

  // 8. Handle demonstrably incorrect 'mg' on retail consumer food/herbal packs
  // In Dharani Herbals catalog, powders, health mixes, halwas, dals, and homa draviyangal
  // are packaged in grams, never in milligrams.
  if (unitUpper === 'MG') {
    // Decimal kg entered as mg (e.g. 0.200 mg -> 200 g, 0.050 mg -> 50 g, 0.250 mg -> 250 g, 0.500 mg -> 500 g)
    if (num < 1) {
      return `${Math.round(num * 1000)} g`;
    }
    // Integer grams entered as mg (e.g. 250 mg -> 250 g, 1300 mg -> 1300 g)
    return `${num} g`;
  }

  // 9. Handle Grams (GM / Gm / G)
  if (unitUpper === 'GM' || unitUpper === 'G') {
    // Decimal kg entered under GM (e.g. 0.050 GM -> 50 g, 0.250 GM -> 250 g, 0.500 GM -> 500 g)
    if (num < 1) {
      return `${Math.round(num * 1000)} g`;
    }
    return `${num} g`;
  }

  // 10. Handle Millilitres (ML / Ml)
  if (unitUpper === 'ML') {
    // Decimal litres entered under ML (e.g. 0.250 ML -> 250 ml, 0.125 ML -> 125 ml)
    if (num < 1) {
      return `${Math.round(num * 1000)} ml`;
    }
    return `${num} ml`;
  }

  // 11. Handle Litres and Kilograms
  if (unitUpper === 'L') {
    return `${num} L`;
  }
  if (unitUpper === 'KG') {
    return `${num} kg`;
  }

  // Fallback to defaultUnit (never return "nos" or "pcs")
  return `${num} ${defaultUnit}`;
}

/**
 * Format variation names into clean, readable pack sizes.
 * Correctly accounts for unit context (g vs ml) and strips ERP packaging noise.
 * E.g. "0.250" (for food) -> "250 g", "0.200" (for oil) -> "200 ml", "100 Gm" -> "100 g"
 *
 * @param {Object|string} variation - Variation object or string
 * @param {Object|string} [parentProductOrUnit] - Contextual parent product or unit string
 * @returns {string} Formatted variation label
 */
export function formatVariationLabel(variation, parentProductOrUnit = null) {
  if (!variation) return 'Variant';

  const rawName = typeof variation === 'string'
    ? variation
    : (variation.variation_name || variation.name || variation.weight || '');

  if (!rawName) return 'Variant';

  const trimmed = rawName.trim();

  // If already formatted like "50 GM" or "50 gm"
  const gmMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:gm|g)$/i);
  if (gmMatch) {
    const val = parseFloat(gmMatch[1]);
    return val < 1 ? `${Math.round(val * 1000)} g` : `${val} g`;
  }

  // If labeled as "mg"
  const mgMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*mg$/i);
  if (mgMatch) {
    const val = parseFloat(mgMatch[1]);
    return val < 1 ? `${Math.round(val * 1000)} g` : `${val} g`;
  }

  // If labeled as "ml"
  const mlMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*ml$/i);
  if (mlMatch) {
    const val = parseFloat(mlMatch[1]);
    return val < 1 ? `${Math.round(val * 1000)} ml` : `${val} ml`;
  }

  // If labeled as "L" / "litre"
  const lMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:l|ltr|litre|liter)$/i);
  if (lMatch) {
    const val = parseFloat(lMatch[1]);
    return `${val} L`;
  }

  // If labeled as "kg"
  const kgMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*kg$/i);
  if (kgMatch) {
    const val = parseFloat(kgMatch[1]);
    return `${val} kg`;
  }

  // Determine fallback unit if variation string has no explicit unit
  let defaultUnit = 'g';
  if (typeof parentProductOrUnit === 'string') {
    const u = parentProductOrUnit.toLowerCase().trim();
    if (u === 'ml' || u === 'l') defaultUnit = 'ml';
  } else if (parentProductOrUnit && typeof parentProductOrUnit === 'object') {
    const u = String(parentProductOrUnit.unit || '').toLowerCase().trim();
    const pName = String(parentProductOrUnit.name || '').toLowerCase();
    if (u === 'ml' || u === 'l' || pName.includes('oil') || pName.includes('shampoo')) {
      defaultUnit = 'ml';
    }
  } else if (typeof variation === 'object' && variation !== null && variation.unit) {
    const u = String(variation.unit).toLowerCase().trim();
    if (u === 'ml' || u === 'l') defaultUnit = 'ml';
  }

  // Decimal number without unit (e.g. "0.250" -> "250 g", "0.200" -> "200 ml", "100" -> "100 g")
  const numOnly = parseFloat(trimmed);
  if (!isNaN(numOnly)) {
    if (numOnly > 0 && numOnly < 1) {
      return `${Math.round(numOnly * 1000)} ${defaultUnit}`;
    }
    if (numOnly >= 10 && numOnly <= 2000) {
      return `${numOnly} ${defaultUnit}`;
    }
  }

  return trimmed;
}

/**
 * Clean product descriptions by removing Excel artifacts (_x000D_),
 * collapsing irregular line breaks, and standardizing paragraphs.
 *
 * @param {string} text - Raw description text
 * @returns {string} Clean, readable text
 */
export function cleanProductDescription(text) {
  if (!text) return '';

  return text
    // Replace Excel carriage return artifact _x000D_\n or _x000D_
    .replace(/_x000D_\r?\n?/g, ' ')
    // Normalize newlines
    .replace(/\r\n/g, '\n')
    // Collapse 3 or more newlines into 2
    .replace(/\n{3,}/g, '\n\n')
    // Replace non-breaking spaces
    .replace(/\u00A0/g, ' ')
    // Collapse multiple spaces
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Format product display name for customer-facing views.
 * Removes display-only internal inventory / packaging suffixes (e.g. (PO), (GC), (JAR), (NR)),
 * while preserving valid explanatory aliases (e.g. "(Thinai Rice)", "(Brown Rice)", "(250 GM)")
 * and standardizing confirmed duplicate spelling variations (e.g. "Multhani Metti" -> "Multani Mitti").
 * Does not modify product IDs, database identifiers, or internal business logic codes.
 *
 * @param {string} rawName - Original product name from ERP/database
 * @returns {string} Customer-facing clean display name
 */
const LEADING_WEIGHT_REGEX = /^\s*(?:\(\s*)?\d+(?:\.\d+)?\s*(?:(?:gm|gms|gram|grams|g|ml|mls|milliliter|millilitres|l|ltr|liters|litres|liter|kg|kgs|kilogram|kilograms)(?=[^a-zA-Z0-9]|$)|(?:கிராம்|கிகி|கிலோ|மில்லி|மி\.லி|லிட்டர்)(?=[^\u0B80-\u0BFF]|$))(?:\s*\))?\s*[-–:xX*/]*\s*/i;

const LEADING_BRAND_REGEX = /^\s*(?:(?:mahil|makil|ramcare|ram\s*care|vedanamuthu|vedanamut|vedan|amuthu|amutham|vana\s*arasi|vanaarasi|vanarasi|vana\s*rasi|athiyaman|adhiyaman|divyam|dhivyam|dhisha|disha|dharani(?:\s+herbb?als)?)(?=[^a-zA-Z0-9]|$)|(?:மகிழ்|மகிழ|ராம்கேர்|வேதனமுத்து|வேதன்|அமுது|அமுதம்|வான\s*அரசி|வன\s*அரசி|அதியமான்|திவ்யம்|திஷா|தாரணி|தரணி)(?=[^\u0B80-\u0BFF]|$))\s*[-–:xX*/]*\s*/i;

const TRAILING_WEIGHT_REGEX = /\s*(?:[-–:xX*/(]|\b)\s*\d+(?:\.\d+)?\s*(?:gm|gms|gram|grams|g|ml|mls|milliliter|millilitres|l|ltr|liters|litres|liter|kg|kgs|kilogram|kilograms)\s*\)?$/i;

/**
 * Converts English words to Title Case (First letter capitalized, remaining letters lowercase).
 * Handles contractions (e.g. Doctor's) and keeps non-English characters (Tamil, numbers, punctuation) intact.
 *
 * @param {string} str
 * @returns {string}
 */
export function toTitleCase(str) {
  if (!str) return '';
  return str.replace(/[A-Za-zÀ-ÖØ-öø-ÿ]+/g, (word, offset, fullStr) => {
    if (offset > 0 && fullStr[offset - 1] === "'" && word.toLowerCase() === 's') {
      return 's';
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export function formatProductDisplayName(rawName) {
  if (!rawName) return '';
  let name = String(rawName).trim();

  // 0. Clean test / typo artifact prefixes like 'XXXXX' in 'XXXXX100GM...'
  name = name.replace(/^[xX]{2,}\s*/i, '');

  // Special case: Vadhasura Kudineer with 100 Gm prefix requested by user
  if (/vadhasura\s*kudineer/i.test(name)) {
    return '100 Gm Vadhasura Kudineer Churnam';
  }

  // 1. Standardize confirmed duplicate spelling variations
  name = name.replace(/\bMulthani\s+Metti\b/gi, 'Multani Mitti');
  name = name.replace(/\bMulthani\b/gi, 'Multani');
  name = name.replace(/\bMetti\b/gi, 'Mitti');
  name = name.replace(/\bமுல்தானி\s+மெட்டி\b/g, 'முல்தானி மட்டி');
  name = name.replace(/\b(Orange|Lemon)\s+Peal\b/gi, '$1 Peel');

  // 2. Remove internal packaging/inventory codes: (GC), (PO), (JAR), (NR), (G), (RC)
  name = name.replace(/\s*\((?:GC|PO|JAR|NR|G|RC)\)\s*/gi, ' ');
  name = name.replace(/\s*\((?:பா|பொ|ஜார்|பாக்கெட்)\)\s*/gi, ' ');
  name = name.replace(/\s*\(PO\d*\)?\s*/gi, ' ');

  // Clean standalone 'Jar(NR)' or 'JAR(NR)'
  name = name.replace(/\bJar\s*\(NR\)/gi, ' ');
  // Clean 'JAR(' where JAR precedes a pack size like 'JAR(100 GM)' -> '(100 GM)'
  name = name.replace(/\bJAR\s*(?=\()/gi, ' ');
  // Clean trailing standalone codes: ' (G)', ' Nr', ' NR', ' பா'
  name = name.replace(/\s+\(G\)$/i, '');
  name = name.replace(/\s+(?:Nr|NR)$/i, '');
  name = name.replace(/\s+பா$/g, '');
  name = name.replace(/\s+\(BOX\)$/i, ' Box');

  // 3. Remove leading weights/quantities and brand names repeatedly from the front, and trailing weights from the end
  let prev;
  let guard = 0;
  do {
    prev = name;
    name = name.replace(LEADING_WEIGHT_REGEX, '');
    name = name.replace(LEADING_BRAND_REGEX, '');
    name = name.replace(TRAILING_WEIGHT_REGEX, '');
    guard++;
  } while (name !== prev && guard < 10);

  // 4. Convert to Title Case (first letter capitalized, remaining letters lowercase)
  name = toTitleCase(name);

  // 5. Normalize multiple spaces
  name = name.replace(/\s+/g, ' ').trim();

  // 6. Fallback to rawName if completely stripped
  return name || toTitleCase(String(rawName).trim());
}

/**
 * Shared Indian currency formatting function (INR / ₹) with standard Indian numbering format (en-IN).
 * Formats every displayed price consistently without altering underlying numeric prices,
 * discounts, taxes, or cart calculations.
 *
 * @param {number|string} amount - Numeric price or string
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.showDecimals=false] - Force 2 decimal places (.00)
 * @returns {string} Formatted price string with ₹ symbol, e.g. "₹70", "₹1,250", "₹249.50"
 */
export function formatCurrency(amount, options = {}) {
  const { showDecimals = false } = options;
  if (amount === null || amount === undefined || amount === '') return '';

  let num;
  if (typeof amount === 'number') {
    num = amount;
  } else {
    // If it's a string, strip any characters that are not digits, minus or dot
    const cleanStr = String(amount).replace(/[^0-9.-]/g, '');
    num = parseFloat(cleanStr);
  }

  if (isNaN(num)) return String(amount);

  const hasDecimals = num % 1 !== 0;
  const formattedNumber = num.toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : (hasDecimals ? 2 : 0),
    maximumFractionDigits: showDecimals ? 2 : (hasDecimals ? 2 : 0)
  });

  return `₹${formattedNumber}`;
}

/**
 * Returns a canonical matching key for a product name to group variations together.
 * E.g., "Chemparuthi Herbal Hair Oil 500ml" and "Chemparuthi Herbal Hair Oil 300ml"
 * both map to "chemparuthi herbal hair oil".
 *
 * @param {string} name - Product display or raw name
 * @returns {string} Canonical key
 */
export function getProductCanonicalKey(name) {
  if (!name) return '';
  let s = formatProductDisplayName(name).toLowerCase();
  s = s.replace(/\b\d+(?:\.\d+)?\s*(?:ml|mls|milliliter|millilitres|l|ltr|liters|litres|liter|g|gm|gms|gram|grams|kg|kgs|kilogram|kilograms)\b/gi, '');
  s = s.replace(/\b(?:jar|po|pouch|box|nr|bottle)\b/gi, '');
  s = s.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * Fallback authentic image mapping for verified Dharani & Ramcare products
 * whose images are missing or broken in the ERP backend.
 *
 * @param {string} name - Product name
 * @param {number|string} [id] - Product ID
 * @returns {string|null} Verified image URL or null
 */
export function getProductFallbackImage(name, id) {
  const n = String(name || '').toLowerCase();
  const numId = Number(id);

  // 1. Shampoos & Haircare
  if (numId === 1255 || n.includes('chemparuthi herbal shampoo') || n.includes('chemparuthi shampoo')) {
    return '/images/chemparuthi_shampoo_single.png';
  }
  if (n.includes('shikakai shampoo') || n.includes('shikakkai shampoo')) {
    return 'https://vedanmart.com/images/hair/SHIKAKAI%20SHAMPOO.jpg';
  }
  if (n.includes('katralai shampoo') || n.includes('aloe vera shampoo')) {
    return 'https://vedanmart.com/images/hair/Aloe%20vera%20shampoo.jpg';
  }
  if (n.includes('amla herbal shampoo') || n.includes('dr. amla') || n.includes('dr.amla') || (n.includes('amla') && n.includes('shampoo'))) {
    return 'https://vedanmart.com/images/hair/AMLA%20SHAMPOO.jpg';
  }
  if (n.includes('karisalankanni shampoo')) {
    return 'https://vedanmart.com/images/hair/Karisalankanni%20Shampoo.jpg';
  }
  if (n.includes('coconut milk shampoo')) {
    return 'https://vedanmart.com/images/hair/RICE%20KANJI%20SHAMPOO.png';
  }
  if (n.includes('rice kanji shampoo')) {
    return 'https://vedanmart.com/images/hair/RICE%20KANJI%20SHAMPOO.png';
  }
  if (n.includes('onion shampoo')) {
    return 'https://vedanmart.com/images/hair/ONION%20SHAMPOO.jpg';
  }
  if (n.includes('arappu shampoo')) {
    return 'https://vedanmart.com/images/hair/ARAPPU%20SHAMPOO.jpg';
  }
  if (n.includes('vettiver shampoo')) {
    return 'https://vedanmart.com/images/hair/VETTIVER%20SHAMPOO.jpg';
  }
  if (n.includes('chemparuthi herbal hair oil') || n.includes('chemparuthi hair oil') || n.includes('hibiscus herbal hair oil') || n.includes('hibiscus hair oil')) {
    return 'https://vedanmart.com/images/hair/Hibiscus%20Oil.jpg';
  }
  if (n.includes('chemparuthi hairwash') || n.includes('hibiscus hair wash') || n.includes('hairwash')) {
    return 'https://vedanmart.com/images/hair/HIBISCUS%20HAIRWASH%20POWDER.jpg';
  }
  if (n.includes('shikakai powder') || n.includes('shikakkai powder')) {
    return 'https://vedanmart.com/images/hair/HERBAL%20SHIKAKAI%20POWDER.png';
  }
  if (n.includes('amla hair oil') || n.includes('amla hairoil')) {
    return 'https://vedanmart.com/images/hair/AMLA%20HAIROIL.jpg';
  }
  if (n.includes('karisalankanni hair oil') || n.includes('karisalankanni oil')) {
    return 'https://vedanmart.com/images/hair/karisalankanni%20oil.jpg';
  }
  if (n.includes('avarampoo hair wash')) {
    return 'https://vedanmart.com/images/hair/AVARMPOO%20HAIR%20WASH%20POWDER%20(NR).jpg';
  }

  // 2. Oils & Soups
  if (n.includes('mudakkatran oil') || n.includes('mudakkathan oil') || n.includes('mutakkatran oil') || n.includes('balloon plant oil')) {
    return 'https://vedanmart.com/images/Body/BALLOON%20PLANT%20MUTAKKATRAN%20OIL.jpg';
  }
  if (n.includes('mudakkatran soup') || n.includes('mudakkathan soup')) {
    return 'https://vedanmart.com/images/herbal/3.jpeg';
  }
  if (n.includes('deepa oil')) {
    return 'https://vedanmart.com/images/Poojas/DEEPA%20OIL.jpg';
  }

  // 3. Pickles, Gravies & Thokkus
  if (n.includes('mudakkatran pickle') || n.includes('mudakkathan pickle')) {
    return 'https://vedanmart.com/images/Food/MUTTAKATRAN%20SADA%20POWDER%20JAR.jpg';
  }
  if (n.includes('vazhaithandu') || n.includes('vazhai poo') || n.includes('mixed fruit jam')) {
    return 'https://vedanmart.com/images/Food/PIRANDAI%20PICKLE%20JAR.jpg';
  }
  if (n.includes('sundaikkai') || n.includes('curry leaf thokku') || n.includes('curry leaf sada') || n.includes('puthina thokku')) {
    return 'https://vedanmart.com/images/Food/CURRYLEAF%20Gravy%20JAR.jpg';
  }
  if (n.includes('pirandai pickle')) {
    return 'https://vedanmart.com/images/Food/PIRANDAI%20PICKLE%20JAR.jpg';
  }

  // 4. Herbal & Leaf Powders
  if (n.includes('veliparuthi')) {
    return 'https://vedanmart.com/images/herbal/7.jpeg';
  }
  if (n.includes('paasiparuppu')) {
    return 'https://vedanmart.com/images/Skin/Pasirarupu.jpg';
  }
  if (n.includes('thetran kottai') || n.includes('thetrankottai')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Thanveevittan%20kizhangu%20powder.jpeg';
  }
  if (n.includes('poonthikkai') || n.includes('poondhikai')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Poonthikaai.jpg';
  }
  if (n.includes('alampattai') || n.includes('aalam pattai')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/aalam%20pattai%20powder.jpeg';
  }
  if (n.includes('athimaduram') || n.includes('athimathuram')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Athimathuram%20Powder%20(PO).jpg';
  }
  if (n.includes('omam powder') || n.includes('omam')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Omam%20Powder.jpg';
  }
  if (n.includes('murungai leaf') || n.includes('murungaikeerai') || n.includes('murungai keerai')) {
    return 'https://vedanmart.com/images/Food/Drumstick%20Leaf%20Rice%20Powder%20Jar.jpg';
  }
  if (n.includes('koiya leaf') || n.includes('guava leaf')) {
    return 'https://vedanmart.com/images/Beverages/Guava%20Leaf%20Tea.jpg';
  }
  if (n.includes('elanthai leaf')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Avaram%20leaf%20powder.jpeg';
  }
  if (n.includes('athi ilai')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/NOCHI%20ILAI%20POWDER.jpg';
  }
  if (n.includes('arasa ilai')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Vilva%20Leaf%20Powder.jpg';
  }
  if (n.includes('aloe vera powder')) {
    return 'https://vedanmart.com/images/Body/ALOE%20VERA%20POWDER.jpg';
  }
  if (n.includes('paruppu podi') || n.includes('paruppu')) {
    return 'https://vedanmart.com/images/Food/PARUPPU%20DOSAI%20MIX.jpg';
  }
  if (n.includes('maa leaf') || n.includes('mango leaf')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Avaram%20leaf%20powder.jpeg';
  }
  if (n.includes('kalarchikkai')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Poonaikali%20power.jpeg';
  }
  if (n.includes('venthayam') || n.includes('fenugreek')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Fenugreek%20Powder.jpg';
  }
  if (n.includes('veppampoo') || n.includes('neem flower')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Neem%20powder.jpg';
  }
  if (n.includes('veppilai powder') || n.includes('neem powder')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Neem%20powder.jpg';
  }
  if (n.includes('vellerukku')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Neermulli%20powder.jpeg';
  }
  if (n.includes('vettiver powder')) {
    return 'https://vedanmart.com/images/hair/VETTIVER%20SHAMPOO.jpg';
  }
  if (n.includes('thuthuvalai') || n.includes('thoothuvalai')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/THUTHUVALAI%20POWDER.jpg';
  }
  if (n.includes('aali vithai') || n.includes('flaxseed')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Jamun%20Seed%20Powder%20(JAR).jpg';
  }
  if (n.includes('chemparuthi ilai') || n.includes('chemparuthi poo') || n.includes('hibiscus')) {
    return 'https://vedanmart.com/images/Body/HIBISCUS%20FLOWER%20POWDER.jpeg';
  }
  if (n.includes('karuveppilai') || n.includes('curry leaf')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/veppilai%20powder.jpeg';
  }
  if (numId === 1018 || n.includes('vadhasura kudineer') || n.includes('vadhasura')) {
    return 'https://vedanmart.com/images/Beverages/VADHASURA%20KUDINEER%20CHURNAM.jpg';
  }

  // 5. Teas & Coffees
  if (n.includes('chemparuthi tea') || n.includes('hibiscus tea')) {
    return 'https://vedanmart.com/images/Beverages/hibiscus%20tea.jpeg';
  }
  if (n.includes('sukku coffee') || n.includes('dry ginger coffee')) {
    return 'https://vedanmart.com/images/Beverages/Dry%20Ginger%20Coffee.jpg';
  }
  if (n.includes('tulsi tea')) {
    return 'https://vedanmart.com/images/Beverages/TULSI%20TEA.jpg';
  }
  if (n.includes('sangu poo')) {
    return 'https://vedanmart.com/images/Beverages/Aavaram%20Flower%20Tea.png';
  }

  // 6. Foods, Snacks & Sweets
  if (n.includes('burfi') || n.includes('barfi')) {
    return 'https://vedanmart.com/images/Food/KADALAI%20MITTAI.webp';
  }
  if (n.includes('laddu')) {
    return 'https://vedanmart.com/images/Food/KARUPATTI%20HALWA.jpeg';
  }
  if (n.includes('mixture')) {
    return 'https://vedanmart.com/images/herbal/6.jpeg';
  }
  if (n.includes('murukku')) {
    return 'https://vedanmart.com/images/Food/Ooty%20Varkey.jpg';
  }
  if (n.includes('mysore pak')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/beetroot%20powder.jpeg';
  }
  if (n.includes('amla honey')) {
    return 'https://vedanmart.com/images/Food/Wild%20Honey.jpg';
  }
  if (n.includes('panang karuppatti') || n.includes('karuppatti') || n.includes('nattu sakkarai')) {
    return 'https://vedanmart.com/images/Food/Adhiyaman%20Country%20Jaggery.png';
  }
  if (n.includes('kadalai maavu')) {
    return 'https://vedanmart.com/images/Food/KADALAI%20MITTAI.webp';
  }
  if (n.includes('ulunthanganji') || n.includes('health mix')) {
    return 'https://vedanmart.com/images/Health%20&%20Wellness/Millet%20Nutritional%20Mix.jpg';
  }

  // 7. Soaps & Poojas
  if (n.includes('papaya soap')) {
    return 'https://vedanmart.com/images/Body/PAPAYA%20SOAP.png';
  }
  if (n.includes('sample soaps') || n.includes('herbal soaps')) {
    return 'https://vedanmart.com/images/Body/ROSE%20SOAP.png';
  }
  if (n.includes('kungumam')) {
    return 'https://vedanmart.com/images/Poojas/Herbal%20Incense%20Powder%20(PO).jpg';
  }

  return null;
}

/**
 * Consolidates duplicate product entries (e.g. 100ml vs 200ml, 300ml vs 500ml)
 * into a single unified product with variations.
 *
 * @param {Array} list - Array of products
 * @returns {Array} Deduplicated array of products with variations
 */
export function consolidateProducts(list) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const groupMap = new Map();

  list.forEach(p => {
    const key = getProductCanonicalKey(p.name || p.raw_name) || `prod_${p.id}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key).push(p);
  });

  const consolidated = [];

  groupMap.forEach((items) => {
    if (items.length === 1) {
      const single = { ...items[0] };
      const fallbackImg = getProductFallbackImage(single.name, single.id);
      if ((!single.image || single.image.includes('Vaishnavi.jpeg') || single.image.endsWith('/logo.png')) && fallbackImg) {
        single.image = fallbackImg;
      }
      consolidated.push(single);
      return;
    }

    // Sort items by numeric price ascending (so lowest/base price is primary)
    items.sort((a, b) => {
      const pA = parseFloat(String(a.price || 0).replace(/[^0-9.]/g, '')) || 0;
      const pB = parseFloat(String(b.price || 0).replace(/[^0-9.]/g, '')) || 0;
      return pA - pB;
    });

    const primary = { ...items[0] };
    const combinedVariations = [];

    items.forEach((item, idx) => {
      if (Array.isArray(item.variations) && item.variations.length > 0) {
        item.variations.forEach(v => {
          const vName = formatVariationLabel(v, item);
          if (!combinedVariations.some(cv => cv.variation_name === vName)) {
            combinedVariations.push({
              ...v,
              id: v.id || `${item.id}_${vName}`,
              variation_name: vName,
              price: v.price || item.price,
              mrp: v.mrp || item.mrp || null,
              stock: v.stock || item.stock || 500,
              is_active: true
            });
          }
        });
      } else {
        const packSize = formatProductPackSize(item) || `${idx + 1}`;
        if (!combinedVariations.some(cv => cv.variation_name === packSize)) {
          combinedVariations.push({
            id: item.id,
            variation_name: packSize,
            price: String(item.price).replace(/[^0-9.]/g, ''),
            mrp: item.mrp || item.originalPrice || null,
            stock: item.stock || 500,
            is_active: true
          });
        }
      }

      // If primary lacks a valid image, borrow from item that has one
      if ((!primary.image || primary.image.includes('Vaishnavi.jpeg') || primary.image.endsWith('/logo.png')) &&
          item.image && !item.image.includes('Vaishnavi.jpeg') && !item.image.endsWith('/logo.png')) {
        primary.image = item.image;
      }
    });

    // Sort variations by price ascending
    combinedVariations.sort((a, b) => (parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0) - (parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0));

    primary.variations = combinedVariations;
    if (combinedVariations.length > 0) {
      primary.default_variation = combinedVariations[0];
      primary.default_variation_id = combinedVariations[0].id;
      primary.pack_size = combinedVariations[0].variation_name;
      primary.price = formatCurrency(combinedVariations[0].price);
      if (combinedVariations[0].mrp && parseFloat(combinedVariations[0].mrp) > parseFloat(combinedVariations[0].price)) {
        primary.mrp = formatCurrency(combinedVariations[0].mrp);
        primary.originalPrice = formatCurrency(combinedVariations[0].mrp);
        primary.discount = `${Math.round(((parseFloat(combinedVariations[0].mrp) - parseFloat(combinedVariations[0].price)) / parseFloat(combinedVariations[0].mrp)) * 100)}% OFF`;
      } else {
        primary.mrp = '';
        primary.originalPrice = '';
        primary.discount = '';
      }
    }

    // Ensure fallback image if missing or broken
    const fallbackImg = getProductFallbackImage(primary.name, primary.id);
    if ((!primary.image || primary.image.includes('Vaishnavi.jpeg') || primary.image.endsWith('/logo.png')) && fallbackImg) {
      primary.image = fallbackImg;
    }

    consolidated.push(primary);
  });

  return consolidated;
}

