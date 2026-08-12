import { createContext, useContext, useState, useEffect } from 'react';

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

  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem(getCacheKey());
      if (cached) {
        const parsed = JSON.parse(cached);
        // Preload the first 8 product images instantly for blazingly fast LCP
        if (Array.isArray(parsed)) {
          parsed.slice(0, 8).forEach(p => {
            if (p.image) {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'image';
              link.href = p.image;
              document.head.appendChild(link);
            }
          });
        }
        return parsed;
      }
      return [];
    } catch (e) {
      return [];
    }
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
    let apiUrl = 'https://api.codingboss.in/products/';
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
          apiUrl = 'https://api.codingboss.in/store/products/';
        }
      }
    } catch (e) {
      console.error("Failed to parse user data for API selection", e);
    }

    fetch(apiUrl, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Extract base URL from apiUrl to prepend to images if needed
        let baseUrl = '';
        try {
          const urlObj = new URL(apiUrl);
          baseUrl = urlObj.origin;
        } catch (e) {
          baseUrl = 'https://api.codingboss.in';
        }

        // Map API data to our frontend format
        if (!Array.isArray(data)) {
          throw new Error('API did not return an array');
        }
        const formatted = data.map(p => {
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

          if (pNameLower.includes('arappu shampoo') || pNameLower.includes('deepa oil')) {
            displayWeight = '0.250';
            displayUnit = 'ML';
          } else if (pNameLower.includes('coconut milk soap')) {
            displayWeight = '75';
            displayUnit = 'GM';
          }

          return {
            id: p.id,
            brand: p.brand,
            brand_id: p.brand_id,
            name: p.name,
            tamil_name: p.tamil_name || p.name,
            subtitle: p.description ? p.description.substring(0, 60) + '...' : 'Nourishing & Natural',
            price: `₹${activePrice.toFixed(0)}`,
            originalPrice: originalPrice > activePrice ? `₹${originalPrice.toFixed(0)}` : '',
            discount: discount,
            rating: 4.8,
            reviews: p.stock > 0 ? (p.stock * 3) : 124,
            badge: p.is_new ? 'NEW' : '',
            badgeColor: p.is_new ? 'green' : '',
            image: (p.image && p.image.startsWith('/'))
              ? `${baseUrl}${p.image}`
              : (p.image || null),
            category_name: p.category_name,
            description: p.description,
            weight_volume: displayWeight,
            unit: displayUnit,
            gst_percentage: p.gst_percentage || 0,
            variations: p.variations || []
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
    // Auto-refresh removed for testing purposes
    // const intervalId = setInterval(() => {
    //   refreshProducts();
    // }, 2000);
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
