import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { API_BASE_URL, NGROK_DOMAIN, resolveMediaUrl } from '../services/api';
import { formatProductPackSize, formatVariationLabel, formatProductDisplayName, formatCurrency } from '../utils/productFormatters';
import { getProductVariations, getDefaultVariation } from '../data/productVariationsData';
import { getProductDescription } from '../data/productCatalogData';
import liveProductsBackup from '../data/liveProductsCache.json';

const EXCLUDED_PRODUCT_IDS = new Set([1032, 1039, 1228, 1192, 1128]);

const isRemovedProduct = (p) => {
  if (!p) return false;
  if (p.id && EXCLUDED_PRODUCT_IDS.has(Number(p.id))) return true;
  const name = String(p.name || p.raw_name || '').toLowerCase();
  return (
    name.includes('ponni (brown rice)') ||
    name.includes('ponni brown rice') ||
    name.includes('nattu samba brown rice') ||
    name.includes('nattu samba rice') ||
    name.includes('coconut milk soap') ||
    name.includes('vettiver soap') ||
    name.includes('jathikkai pickle')
  );
};

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const getCacheKey = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const data = JSON.parse(storedUser);
        const role1 = String(data.user?.role || '').toLowerCase();
        const role2 = String(data.role || '').toLowerCase();
        const type1 = String(data.user?.user_type || '').toLowerCase();
        const type2 = String(data.user_type || '').toLowerCase();

        const isStoreMember = data.is_store_login || data.is_store_member || data.user?.is_store_member || data.is_store ||
          ['staff', 'store', 'store_member'].includes(role1) ||
          ['staff', 'store', 'store_member'].includes(role2) ||
          ['staff', 'store', 'store_member'].includes(type1) ||
          ['staff', 'store', 'store_member'].includes(type2);
        if (isStoreMember) return 'dharani_products_cache_store';
      }
    } catch (e) { }
    return 'dharani_products_cache_customer';
  };

  const transformProduct = (p) => {
    const r = (p.rating !== null && p.rating !== undefined && p.rating !== '') ? Number(p.rating) : null;
    const rev = (p.reviews !== null && p.reviews !== undefined && p.reviews !== '') ? Number(p.reviews) : null;
    const isValid = r !== null && !isNaN(r) && r > 0 && rev !== null && !isNaN(rev) && rev > 0;
    const enhancedDescription = getProductDescription(p);
    const variations = (Array.isArray(p.variations) && p.variations.length > 0)
      ? p.variations
      : getProductVariations(p.id);
    const defaultVar = getDefaultVariation(p, variations);
    const normalizedPackSize = defaultVar
      ? formatVariationLabel(defaultVar, p)
      : (formatProductPackSize(p) || p.pack_size);
    const displayName = formatProductDisplayName(p.raw_name || p.name);
    const displayTamilName = formatProductDisplayName(p.raw_tamil_name || p.tamil_name || displayName);
    return {
      ...p,
      name: displayName,
      raw_name: p.raw_name || p.name,
      tamil_name: displayTamilName,
      raw_tamil_name: p.raw_tamil_name || p.tamil_name || displayName,
      price: formatCurrency(p.price),
      originalPrice: (p.mrp && parseFloat(p.mrp) > parseFloat(String(p.price || 0).replace(/[^0-9.]/g, ''))) ? formatCurrency(p.mrp) : (p.originalPrice ? formatCurrency(p.originalPrice) : ''),
      discount: (p.mrp && parseFloat(p.mrp) > parseFloat(String(p.price || 0).replace(/[^0-9.]/g, ''))) ? (Math.round(((parseFloat(p.mrp) - parseFloat(String(p.price).replace(/[^0-9.]/g, ''))) / parseFloat(p.mrp)) * 100) + '% OFF') : (p.discount ? p.discount + '% OFF' : ''),
      description: enhancedDescription || p.description,
      pack_size: normalizedPackSize,
      variations: variations,
      default_variation: defaultVar,
      default_variation_id: defaultVar?.id || null,
      rating: isValid ? r : null,
      reviews: isValid ? rev : 0
    };
  };

  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem(getCacheKey());
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(p => !isRemovedProduct(p)).map(transformProduct);
        }
      }
    } catch (e) { }
    if (Array.isArray(liveProductsBackup) && liveProductsBackup.length > 0) {
      return liveProductsBackup.filter(p => !isRemovedProduct(p)).map(transformProduct);
    }
    return [];
  });

  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(getCacheKey());
      return cached ? false : true;
    } catch (e) {
      return true;
    }
  });

  const refreshProducts = () => {
    if (products.length === 0) {
      setLoading(true);
    }
    let apiUrl = `${API_BASE_URL}/products/`;
    let isStoreMember = false;

    // Check if the logged-in user is a store member
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const data = JSON.parse(storedUser);
        const role1 = String(data.user?.role || '').toLowerCase();
        const role2 = String(data.role || '').toLowerCase();
        const type1 = String(data.user?.user_type || '').toLowerCase();
        const type2 = String(data.user_type || '').toLowerCase();

        isStoreMember = data.is_store_login || data.is_store_member || data.user?.is_store_member || data.is_store ||
          ['staff', 'store', 'store_member'].includes(role1) ||
          ['staff', 'store', 'store_member'].includes(role2) ||
          ['staff', 'store', 'store_member'].includes(type1) ||
          ['staff', 'store', 'store_member'].includes(type2);

        if (isStoreMember) {
          apiUrl = `${API_BASE_URL}/store/products/`;
        }
      }
    } catch (e) {
      console.error("Failed to parse user data for API selection", e);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => {
        clearTimeout(timeoutId);
        return res.json();
      })
      .then(async data => {
        // Fetch product-images to overlay custom uploaded images
        let extraImagesMap = {};
        try {
          const piRes = await fetch(`${API_BASE_URL}/product-images/`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          });
          if (piRes.ok) {
            const piData = await piRes.json();
            const piList = Array.isArray(piData) ? piData : (piData.data || piData.results || []);
            piList.forEach(pi => {
              const pId = String(pi.product_id || pi.product || '');
              if (pId && pi.is_active !== false) {
                const resolved = resolveMediaUrl(pi.image || pi.url);
                if (resolved) {
                  extraImagesMap[pId] = resolved;
                }
              }
            });
          }
        } catch (e) {
          console.warn('Failed to fetch product-images for website', e);
        }
        // Extract base URL from apiUrl to prepend to images if needed
        let baseUrl = '';
        try {
          const urlObj = new URL(apiUrl);
          baseUrl = urlObj.origin;
        } catch (e) {
          baseUrl = NGROK_DOMAIN;
        }

        // Map API data to our frontend format
        if (!Array.isArray(data)) {
          throw new Error('API did not return an array');
        }
        const formatted = data.filter(p => !isRemovedProduct(p)).map(p => {
          // Determine the correct price based on the role and available fields
          let activePrice = 0;
          let originalPrice = 0;

          if (isStoreMember) {
            // Store members see store_price, and original is mrp
            const sPrice = parseFloat(p.store_price);
            activePrice = !isNaN(sPrice) ? sPrice : (parseFloat(p.price) || 0);
            originalPrice = parseFloat(p.mrp) || parseFloat(p.price) || 0;
          } else {
            // Normal customers see customer_price
            const cPrice = parseFloat(p.customer_price);
            activePrice = !isNaN(cPrice) ? cPrice : (parseFloat(p.price) || 0);
            originalPrice = parseFloat(p.mrp) || parseFloat(p.price) || 0;
          }

          let discount = '';
          if (originalPrice > activePrice) {
            discount = `${Math.round(((originalPrice - activePrice) / originalPrice) * 100)}% OFF`;
          }

          let displayWeight = p.weight_volume;
          let displayUnit = p.unit;
          const pNameLower = p.name ? p.name.toLowerCase() : '';

          if (pNameLower.includes('sprouted multigrain') || (p.id === 1272 && String(p.unit).toLowerCase() === 'mg')) {
            displayWeight = '250';
            displayUnit = 'g';
          } else if (pNameLower.includes('arappu shampoo') || pNameLower.includes('deepa oil')) {
            displayWeight = '0.250';
            displayUnit = 'ML';
          } else if (pNameLower.includes('coconut milk soap')) {
            displayWeight = '75';
            displayUnit = 'GM';
          }

          const variations = (Array.isArray(p.variations) && p.variations.length > 0)
            ? p.variations
            : getProductVariations(p.id);
          const defaultVar = getDefaultVariation({ ...p, price: activePrice }, variations);
          const normalizedPackSize = defaultVar
            ? formatVariationLabel(defaultVar, p)
            : formatProductPackSize({
                ...p,
                weight_volume: displayWeight,
                unit: displayUnit
              });

          const enhancedDescription = getProductDescription(p);

          const displayName = formatProductDisplayName(p.name);
          const displayTamilName = formatProductDisplayName(p.tamil_name || p.name);

          return {
            id: p.id,
            brand: p.brand,
            brand_id: p.brand_id,
            name: displayName,
            raw_name: p.name,
            tamil_name: displayTamilName,
            raw_tamil_name: p.tamil_name || p.name,
            subtitle: enhancedDescription ? enhancedDescription.substring(0, 60) + '...' : 'Nourishing & Natural',
            price: formatCurrency(activePrice),
            originalPrice: originalPrice > activePrice ? formatCurrency(originalPrice) : '',
            discount: discount,
            rating: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                const dn = displayName.toLowerCase();
                if (n === 'chemparuthi herbal shampoo') return 5.0;
                if (n === 'onion shampoo') return 5.0;
                if (n === 'rice kanji shampoo') return 5.0;
                if (n === 'avarampoo pusu manjal jar') return 4.0;
                if (n === 'multhani metti jar' || dn === 'multani mitti jar') return 5.0;
                if (n === 'wild turmeric') return 4.0;
                if (n === 'aloe vera facepack powder jar (for men)') return 5.0;
                if (n === 'facepack powder(jar)' || dn.includes('facepack powder')) return 5.0;
                if (n === 'nalangu powder jar') return 4.5;
                if (n === 'multhani metti soap' || dn === 'multani mitti soap') return 5.0;
                if (n === 'aloe vera soap') return 5.0;
                if (n === 'balloon plant oil') return 4.0;
                if (n === 'amutham nattu charkkarai') return 5.0;
                if (n === 'karuppu kavuni rice') return 5.0;
                if (n === 'kodo - moringa millet pongal mix 250g') return 3.0;
                if (n === 'abc malt (jar)' || dn.includes('abc malt')) return 5.0;
                if (n === 'pirandai pickle') return 5.0;
                if (n === 'ooty varkey') return 5.0;
                const r = (p.rating !== null && p.rating !== undefined && p.rating !== '') ? Number(p.rating) : null;
                const rev = (p.reviews !== null && p.reviews !== undefined && p.reviews !== '') ? Number(p.reviews) : null;
                if (r !== null && !isNaN(r) && r > 0 && rev !== null && !isNaN(rev) && rev > 0) {
                  return r;
                }
                return null;
            })(),
            reviews: (() => {
                const n = p.name ? p.name.toLowerCase().trim() : '';
                const dn = displayName.toLowerCase();
                if (n === 'chemparuthi herbal shampoo') return 4;
                if (n === 'onion shampoo') return 1;
                if (n === 'rice kanji shampoo') return 2;
                if (n === 'avarampoo pusu manjal jar') return 1;
                if (n === 'multhani metti jar' || dn === 'multani mitti jar') return 2;
                if (n === 'wild turmeric') return 1;
                if (n === 'aloe vera facepack powder jar (for men)') return 1;
                if (n === 'facepack powder(jar)' || dn.includes('facepack powder')) return 3;
                if (n === 'nalangu powder jar') return 2;
                if (n === 'multhani metti soap' || dn === 'multani mitti soap') return 1;
                if (n === 'aloe vera soap') return 1;
                if (n === 'balloon plant oil') return 1;
                if (n === 'amutham nattu charkkarai') return 1;
                if (n === 'karuppu kavuni rice') return 1;
                if (n === 'kodo - moringa millet pongal mix 250g') return 1;
                if (n === 'abc malt (jar)' || dn.includes('abc malt')) return 1;
                if (n === 'pirandai pickle') return 1;
                if (n === 'ooty varkey') return 1;
                const rev = (p.reviews !== null && p.reviews !== undefined && p.reviews !== '') ? Number(p.reviews) : null;
                const r = (p.rating !== null && p.rating !== undefined && p.rating !== '') ? Number(p.rating) : null;
                if (rev !== null && !isNaN(rev) && rev > 0 && r !== null && !isNaN(r) && r > 0) {
                  return rev;
                }
                return 0;
            })(),
            badge: p.is_new ? 'NEW' : '',
            badgeColor: p.is_new ? 'green' : '',
            image: extraImagesMap[String(p.id)] || (p.image ? resolveMediaUrl(p.image) : null),
            category_name: p.category_name,
            description: enhancedDescription || p.description,
            pack_size: normalizedPackSize,
            weight_volume: displayWeight,
            unit: displayUnit,
            gst_percentage: p.gst_percentage || 0,
            variations: variations,
            default_variation: defaultVar,
            default_variation_id: defaultVar?.id || null
          };
        });

        // Custom sort: Push Sowbakiya Sundi and Thuthuvalai Lehyam to the end
        const normalProducts = [];
        const endProducts = [];

        formatted.forEach(p => {
          const nameLower = (p.name || "").toLowerCase();
          const tamilLower = (p.tamil_name || "").toLowerCase();
          if (
            nameLower.includes("sowbakiya sundi") || tamilLower.includes("sowbakiya sundi") ||
            nameLower.includes("thuthuvalai") || tamilLower.includes("thuthuvalai")
          ) {
            endProducts.push(p);
          } else {
            normalProducts.push(p);
          }
        });

        const finalProducts = [...normalProducts, ...endProducts];

        // Update state and cache only if data has changed to prevent flickering
        setProducts(prevProducts => {
          if (JSON.stringify(prevProducts) === JSON.stringify(finalProducts)) {
            return prevProducts;
          }
          return finalProducts;
        });
        try {
          localStorage.setItem(getCacheKey(), JSON.stringify(finalProducts));
        } catch (e) {
          console.warn("Failed to cache products:", e);
        }
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshProducts();

    const handleOnline = () => {
      refreshProducts();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const value = useMemo(() => ({
    products,
    loading,
    refreshProducts
  }), [products, loading, refreshProducts]);

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
