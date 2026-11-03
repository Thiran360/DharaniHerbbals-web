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

  let wv = product.weight_volume;
  let unit = product.unit ? String(product.unit).trim() : '';

  // 5. If weight_volume is missing, '0', or 0, check product name for explicit pack size
  if (!wv || wv === '0' || wv === 0) {
    const nameMatch = (product.name || '').match(/(\d+(?:\.\d+)?)\s*(gm|g|kg|ml|l)\b/i);
    if (nameMatch) {
      let num = parseFloat(nameMatch[1]);
      let u = nameMatch[2].toLowerCase();
      if (u === 'gm') u = 'g';
      return `${num} ${u}`;
    }
    return '';
  }

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

  const unitUpper = unit.toUpperCase();

  // 7. Handle demonstrably incorrect 'mg' on retail consumer food/herbal packs
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

  // 8. Handle Grams (GM / Gm / G)
  if (unitUpper === 'GM' || unitUpper === 'G') {
    // Decimal kg entered under GM (e.g. 0.050 GM -> 50 g, 0.250 GM -> 250 g, 0.500 GM -> 500 g)
    if (num < 1) {
      return `${Math.round(num * 1000)} g`;
    }
    return `${num} g`;
  }

  // 9. Handle Millilitres (ML / Ml)
  if (unitUpper === 'ML') {
    // Decimal litres entered under ML (e.g. 0.250 ML -> 250 ml, 0.125 ML -> 125 ml)
    if (num < 1) {
      return `${Math.round(num * 1000)} ml`;
    }
    return `${num} ml`;
  }

  // 10. Handle Litres and Kilograms
  if (unitUpper === 'L') {
    return `${num} L`;
  }
  if (unitUpper === 'KG') {
    return `${num} kg`;
  }

  // Fallback to lowercase unit
  return `${num} ${unit.toLowerCase()}`.trim();
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

const LEADING_BRAND_REGEX = /^\s*(?:(?:mahil|makil|ramcare|ram\s*care|vedanamuthu|vedanamut|vedan|amuthu|amutham|vana\s*arasi|vanarasi|athiyaman|divyam|dhisha|dharani(?:\s+herbb?als)?)(?=[^a-zA-Z0-9]|$)|(?:மகிழ்|மகிழ|ராம்கேர்|வேதனமுத்து|வேதன்|அமுது|அமுதம்|வான\s*அரசி|வன\s*அரசி|அதியமான்|திவ்யம்|திஷா|தாரணி|தரணி)(?=[^\u0B80-\u0BFF]|$))\s*[-–:xX*/]*\s*/i;

export function formatProductDisplayName(rawName) {
  if (!rawName) return '';
  let name = String(rawName).trim();

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

  // 3. Remove leading weights/quantities and brand names repeatedly from the front
  let prev;
  let guard = 0;
  do {
    prev = name;
    name = name.replace(LEADING_WEIGHT_REGEX, '');
    name = name.replace(LEADING_BRAND_REGEX, '');
    guard++;
  } while (name !== prev && guard < 10);

  // 4. Normalize multiple spaces
  name = name.replace(/\s+/g, ' ').trim();

  // 5. Fallback to rawName if completely stripped
  return name || String(rawName).trim();
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

