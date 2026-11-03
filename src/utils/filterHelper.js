import { VERIFIED_PRODUCT_CATALOG } from '../data/productCatalogData.js';

export const FILTER_CONFIG = [
  {
    id: 'productType',
    label: 'Product Type',
    options: ['Powder', 'Soap', 'Oil', 'Shampoo', 'Food & Mixes', 'Tea & Beverages', 'Health & Malt']
  },
  {
    id: 'concern',
    label: 'Concern',
    options: ['Hair Care', 'Skin Care', 'Digestion & Gut', 'Immunity & Energy', 'Baby Care', 'Daily Wellness']
  },
  {
    id: 'ingredient',
    label: 'Ingredient',
    options: ['Turmeric', 'Amla', 'Aloe Vera', 'Hibiscus', 'Ginger', 'Pepper', 'Neem', 'Shikakai', 'Vetiver', 'Rose', 'Tulsi', 'Moringa']
  },
  {
    id: 'suitableFor',
    label: 'Intended Customer',
    options: ['All / Family', 'Women', 'Men', 'Kids & Babies']
  },
  {
    id: 'price',
    label: 'Price Range',
    options: ['Under ₹100', '₹100–₹250', '₹250–₹500', 'Above ₹500']
  },
  {
    id: 'availability',
    label: 'Availability',
    options: ['In Stock', 'Out of Stock']
  }
];

export function matchesProductFilter(product, categoryId, option) {
  if (!product) return false;

  const name = `${product.name || ''} ${product.raw_name || ''}`.toLowerCase();
  const catName = (product.category_name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const pType = (product.product_type || '').toLowerCase();
  const verified = VERIFIED_PRODUCT_CATALOG[product.id] || {};
  const ings = (verified.ingredients || []).join(' ').toLowerCase();

  switch (categoryId) {
    case 'productType': {
      const opt = option.toLowerCase();
      if (opt === 'powder') {
        return pType.includes('powder') || name.includes('powder') || name.includes('podi') || name.includes('churna');
      }
      if (opt === 'soap') {
        return pType.includes('soap') || name.includes('soap');
      }
      if (opt === 'oil') {
        return pType.includes('oil') || name.includes('oil') || name.includes('thailam');
      }
      if (opt === 'shampoo') {
        return pType.includes('shampoo') || name.includes('shampoo');
      }
      if (opt.includes('food')) {
        return catName.includes('food') || name.includes('pickle') || name.includes('varkey') || name.includes('mix') || name.includes('rice') || name.includes('pongal');
      }
      if (opt.includes('tea')) {
        return catName.includes('beverage') || name.includes('tea') || name.includes('decoction');
      }
      if (opt.includes('malt')) {
        return name.includes('malt') || name.includes('lehyam') || name.includes('sundi') || catName.includes('health');
      }
      return name.includes(opt) || pType.includes(opt) || catName.includes(opt);
    }

    case 'concern': {
      const opt = option.toLowerCase();
      if (opt.includes('hair')) {
        return catName.includes('hair') || name.includes('hair') || desc.includes('hair') || ings.includes('hair');
      }
      if (opt.includes('skin')) {
        return catName.includes('skin') || name.includes('skin') || name.includes('face') || desc.includes('skin') || name.includes('glow') || name.includes('manjal');
      }
      if (opt.includes('digestion')) {
        return name.includes('digestion') || name.includes('stomach') || desc.includes('digestion') || name.includes('sundi') || name.includes('sukku') || name.includes('pirandai');
      }
      if (opt.includes('immunity')) {
        return name.includes('immunity') || name.includes('vitality') || desc.includes('immunity') || desc.includes('vitality') || name.includes('malt') || name.includes('amla') || name.includes('tulsi');
      }
      if (opt.includes('baby')) {
        return catName.includes('baby') || name.includes('baby') || name.includes('nalangu');
      }
      if (opt.includes('daily wellness') || opt.includes('wellness')) {
        return catName.includes('wellness') || catName.includes('health') || catName.includes('body');
      }
      return name.includes(opt) || catName.includes(opt) || desc.includes(opt);
    }

    case 'ingredient': {
      const opt = option.toLowerCase();
      return name.includes(opt) || desc.includes(opt) || ings.includes(opt);
    }

    case 'suitableFor': {
      const opt = option.toLowerCase();
      if (opt.includes('men') && !opt.includes('women')) {
        return name.includes('(for men)') || (name.includes('men') && !name.includes('women'));
      }
      if (opt.includes('women')) {
        return name.includes('women') || name.includes('pusu manjal') || name.includes('nalangu');
      }
      if (opt.includes('kid') || opt.includes('baby')) {
        return catName.includes('baby') || name.includes('baby') || name.includes('kid') || name.includes('nalangu');
      }
      if (opt.includes('all') || opt.includes('family')) {
        return true;
      }
      return name.includes(opt);
    }

    case 'price': {
      const rawPrice = product.customer_price !== undefined ? product.customer_price : (product.price !== undefined ? product.price : product.mrp);
      const price = parseFloat(String(rawPrice || 0).replace(/[^0-9.]/g, ''));
      if (isNaN(price)) return true;

      if (option === 'Under ₹100') return price < 100;
      if (option === '₹100–₹250') return price >= 100 && price <= 250;
      if (option === '₹250–₹500') return price >= 250 && price <= 500;
      if (option === 'Above ₹500') return price > 500;
      return true;
    }

    case 'availability': {
      let isOutOfStock = false;
      if (product.stock !== undefined) {
        const s = Number(product.stock);
        isOutOfStock = !isNaN(s) && s <= 0;
      } else if (product.quantity !== undefined) {
        const q = Number(product.quantity);
        isOutOfStock = !isNaN(q) && q <= 0;
      } else if (product.in_stock !== undefined) {
        isOutOfStock = !product.in_stock;
      }

      if (option === 'In Stock') return !isOutOfStock;
      if (option === 'Out of Stock') return isOutOfStock;
      return true;
    }

    default:
      return true;
  }
}

export function filterProductList(list, selectedFilters) {
  if (!list || !Array.isArray(list)) return [];
  if (!selectedFilters || Object.keys(selectedFilters).length === 0) return list;

  return list.filter(product => {
    // Check each active category in selectedFilters
    for (const [categoryId, selectedOptions] of Object.entries(selectedFilters)) {
      if (!selectedOptions || selectedOptions.length === 0) continue;

      // Within a category, match ANY selected option (OR logic)
      const matchesAnyOption = selectedOptions.some(option =>
        matchesProductFilter(product, categoryId, option)
      );

      // Across categories, all active categories must be satisfied (AND logic)
      if (!matchesAnyOption) {
        return false;
      }
    }
    return true;
  });
}
