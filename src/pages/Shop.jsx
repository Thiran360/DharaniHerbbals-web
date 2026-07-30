import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useNavigate, useSearchParams, useNavigationType } from 'react-router-dom';
import { ShoppingCart, Star, SlidersHorizontal, Heart, Plus, Clock, ShoppingBag, Leaf, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import FilterDrawer from '../components/FilterDrawer';
import grpImg from '../assets/grp.png';
import './Shop.css';

// ─── Product Card ────────────────────────────────────────────────────────────
export const ProductCard = memo(({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { language, translateProduct, bulkProductNames, isBulkLoading, t } = useLanguage();

  const navigate = useNavigate();

  const translatedName = language === 'ta' && product.tamil_name ? product.tamil_name : product.name;

  // Force a varied pseudo-random rating between 3.8 and 5.0 for the UI
  const displayRating = (
    3.8 + ((typeof product.id === 'number' ? product.id : (product.id ? product.id.toString().charCodeAt(0) + product.id.toString().length : 10)) % 13) * 0.1
  ).toFixed(1);


  const openProduct = () => {
    sessionStorage.setItem('shopScrollPos', window.scrollY);
    navigate(`/product/${product.id}`);
  };

  const handleCardKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProduct();
    }
  };

  const handleImageError = (e) => {
    if (e.target.src !== window.location.origin + '/logo.png') {
      e.target.src = '/logo.png';
      e.target.style.objectFit = 'contain';
      e.target.style.padding = '1rem';
    }
  };

  return (
    <div
      className="uc-card"
      role="link"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={handleCardKeyDown}
      aria-label={`Open ${translatedName}`}
    >
      <div className="uc-info-section">
        <div className="uc-category-tag">
          <Leaf size={12} className="uc-tag-icon" />
          <span>{product.category_name || 'Snacks'}</span>
        </div>

        <h3 className="uc-title">{translatedName}</h3>
        <p className="uc-subtitle">{language === 'ta' && product.tamil_description ? product.tamil_description : (product.description || 'Authentic Natural Herbal Product')}</p>

        <div className="uc-meta-row">
          <div className="uc-rating-row">
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span className="uc-rating-text">{displayRating}</span>
            <span className="uc-review-count">(97)</span>
          </div>
        </div>

        <div className="uc-bottom-row">
          <div className="uc-price-block">
            <span className="uc-price">{product.price}</span>
            {product.mrp && <span className="uc-original-price">₹{product.mrp}</span>}
          </div>
        </div>

        <button
          className="uc-add-text-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
          aria-label={t('addToCart')}
        >
          <ShoppingBag size={14} className="uc-btn-icon" />
          Add to Cart
        </button>
      </div>

      <div className="uc-img-section">
        <button
          className="uc-wishlist-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label="Toggle Wishlist"
        >
          <Heart
            size={16}
            fill={isInWishlist(product.id) ? "#1f2937" : "transparent"}
            color="#1f2937"
            strokeWidth={1.5}
          />
        </button>
        <img
          src={product.image || '/logo.png'}
          alt={translatedName}
          className="uc-img"
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
});

// ─── Category Tab ─────────────────────────────────────────────────────────────
const CategoryTab = ({ cat, activeCategory, onClick }) => {
  const { language, translateText, t } = useLanguage();
  const [name, setName] = useState(cat);

  useEffect(() => {
    if (cat === 'All') {
      setName(t('allProducts'));
      return;
    }
    let active = true;
    if (language === 'ta') {
      translateText(cat).then(res => { if (active) setName(res); });
    } else {
      setName(cat);
    }
    return () => { active = false; };
  }, [language, cat, t]);

  return (
    <button
      className={`shop-tab ${activeCategory === cat ? 'shop-tab--active' : ''}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

// ─── Shop Page ────────────────────────────────────────────────────────────────
export default function Shop() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const activeBrand = searchParams.get('brand');
  const { language, translateText, t, isBulkLoading } = useLanguage();
  const [translatedHeroCat, setTranslatedHeroCat] = useState(activeCategory);

  const [visibleCount, setVisibleCount] = useState(() => {
    const saved = sessionStorage.getItem('shopVisibleCount');
    return saved ? parseInt(saved, 10) : 12;
  });

  useEffect(() => {
    sessionStorage.setItem('shopVisibleCount', visibleCount);
  }, [visibleCount]);

  const scrollRestored = useRef(false);
  const [apiCategories, setApiCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    fetch('https://api.codingboss.in/herbal/categories/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApiCategories(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setApiCategories(data.data);
        } else {
          console.error('API did not return an array for categories:', data);
          setApiCategories([]);
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setApiCategories([]);
      });
  }, []);

  useEffect(() => {
    if (activeBrand) {
      setTranslatedHeroCat(`Brand: ${activeBrand}`);
      return;
    }
    if (activeCategory === 'All') {
      setTranslatedHeroCat(t('Explore Our Products'));
      return;
    }
    let active = true;
    if (language === 'ta') {
      translateText(activeCategory).then(res => { if (active) setTranslatedHeroCat(res); });
    } else {
      setTranslatedHeroCat(activeCategory);
    }
    return () => { active = false; };
  }, [language, activeCategory, activeBrand, t]);

  const categories = useMemo(() => {
    return ['All', ...apiCategories.map(c => c.name)];
  }, [apiCategories]);

  const filteredProducts = useMemo(() => {
    let list = products || [];

    // 1. Category Filter
    list = activeCategory === 'All'
      ? list
      : list.filter(p => p.category_name?.toLowerCase() === activeCategory.toLowerCase());

    // 1.5. Brand Filter
    if (activeBrand) {
      const searchBrand = activeBrand.trim().toLowerCase();
      list = list.filter(p => {
        const pBrand = p.brand ? String(p.brand).trim().toLowerCase() : '';
        const pBrandId = p.brand_id ? String(p.brand_id).trim().toLowerCase() : '';
        return pBrand === searchBrand || pBrandId === searchBrand;
      });
    }

    // 2. Price Filter
    if (selectedFilters.price && selectedFilters.price.length > 0) {
      list = list.filter(p => {
        const price = parseFloat(p.customer_price || p.mrp || 0);
        return selectedFilters.price.some(range => {
          if (range === 'Under ₹100') return price < 100;
          if (range === '₹100 - ₹300') return price >= 100 && price <= 300;
          if (range === '₹300 - ₹500') return price > 300 && price <= 500;
          if (range === 'Over ₹500') return price > 500;
          return true;
        });
      });
    }

    // 3. Discount Filter
    if (selectedFilters.offers && selectedFilters.offers.length > 0) {
      list = list.filter(p => {
        const mrp = parseFloat(p.mrp || 0);
        const price = parseFloat(p.customer_price || p.mrp || 0);
        const discountPercent = mrp > 0 ? ((mrp - price) / mrp) * 100 : 0;

        return selectedFilters.offers.some(offer => {
          if (offer === '10% Off or more') return discountPercent >= 10;
          if (offer === '20% Off or more') return discountPercent >= 20;
          if (offer === '30% Off or more') return discountPercent >= 30;
          if (offer === '50% Off or more') return discountPercent >= 50;
          return true;
        });
      });
    }

    // Product Type (mocked based on title containing the word)
    if (selectedFilters.productType && selectedFilters.productType.length > 0) {
      list = list.filter(p => {
        const name = (p.name || '').toLowerCase();
        return selectedFilters.productType.some(type => name.includes(type.toLowerCase()));
      });
    }

    // Ingredient (mocked based on title containing the word)
    if (selectedFilters.ingredient && selectedFilters.ingredient.length > 0) {
      list = list.filter(p => {
        const name = (p.name || '').toLowerCase();
        return selectedFilters.ingredient.some(ing => name.includes(ing.toLowerCase()));
      });
    }

    // Sort to push products without images and specific products to the end
    list.sort((a, b) => {
      const aHasImage = a.image && a.image.trim().length > 0;
      const bHasImage = b.image && b.image.trim().length > 0;

      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();
      const aTamil = (a.tamil_name || "").toLowerCase();
      const bTamil = (b.tamil_name || "").toLowerCase();

      const aIsEnd = aName.includes("sowbakiya sundi") || aTamil.includes("sowbakiya sundi") || aName.includes("thuthuvalai") || aTamil.includes("thuthuvalai");
      const bIsEnd = bName.includes("sowbakiya sundi") || bTamil.includes("sowbakiya sundi") || bName.includes("thuthuvalai") || bTamil.includes("thuthuvalai");

      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;

      if (!aIsEnd && bIsEnd) return -1;
      if (aIsEnd && !bIsEnd) return 1;

      return 0;
    });

    return list;
  }, [products, activeCategory, activeBrand, selectedFilters]);


  const handleCategoryClick = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
    setVisibleCount(12);
    sessionStorage.setItem('shopVisibleCount', 12);
    sessionStorage.removeItem('shopScrollPos');

    // Scroll to the start of the products instead of the top of the page
    const shopBody = document.querySelector('.shop-body');
    if (shopBody) {
      const topPos = shopBody.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navType = useNavigationType();

  useEffect(() => {
    if (filteredProducts && filteredProducts.length > 0 && !scrollRestored.current) {
      const savedScroll = sessionStorage.getItem('shopScrollPos');
      if (savedScroll && navType === 'POP') {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      scrollRestored.current = true;
    }
  }, [filteredProducts, navType]);


  return (
    <div className="shop-root">
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      {/* ── Hero Banner ── */}
      <div className="shop-hero">
        <div className="shop-hero-bg" />

        <div className="shop-hero-container">
          <div className="shop-hero-content">
            <span className="shop-hero-tag"><Leaf size={16} /> 100% NATURAL & HERBAL</span>
            <h1 className="shop-hero-title">
              <span>{translatedHeroCat}</span>
            </h1>
            <p className="shop-hero-sub">
              {t('handcraftedWellness')}
            </p>
            <div className="shop-hero-actions">
              <button className="shop-btn-primary" onClick={() => {
                document.querySelector('.shop-body').scrollIntoView({ behavior: 'smooth' });
              }}>Shop Now <ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="shop-body">

        {/* ── Translation Status Banner ── */}
        {isBulkLoading && (
          <div className="shop-translate-banner">
            <span className="shop-translate-spinner" />
            {t('translating')}
          </div>
        )}

        {/* ── Filter Bar ── */}
        <div className="shop-filter-bar">
          <div className="shop-filter-left" onClick={() => setIsFilterOpen(true)} style={{ cursor: 'pointer' }}>
            <SlidersHorizontal size={20} className="shop-filter-icon" />
            <span className="shop-filter-label" style={{ userSelect: 'none' }}>{t('filterBy')}</span>
            {Object.keys(selectedFilters).length > 0 && (
              <span style={{
                backgroundColor: '#22c55e',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                marginLeft: '8px'
              }}>
                {Object.values(selectedFilters).flat().length}
              </span>
            )}
          </div>
          <div className="shop-tabs-scroll">
            {categories.map((cat) => (
              <CategoryTab
                key={cat}
                cat={cat}
                activeCategory={activeCategory}
                onClick={() => handleCategoryClick(cat)}
              />
            ))}
          </div>
        </div>

        {/* ── Results info ── */}
        <div className="shop-results-bar">
          <p className="shop-results-text">
            {t('showing')} <strong>{filteredProducts.length}</strong> {t('of')} <strong>{products.length}</strong> {t('products')}
            {activeCategory !== 'All' && <> {t('in')} <strong className="shop-results-cat">{translatedHeroCat}</strong></>}
          </p>
        </div>

        {/* ── Skeleton loading ── */}
        {loading && (
          <div className="shop-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="pc-skeleton">
                <div className="pc-skeleton-img" />
                <div className="pc-skeleton-body">
                  <div className="pc-skeleton-line w-40" />
                  <div className="pc-skeleton-line w-80" />
                  <div className="pc-skeleton-line w-60" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filteredProducts.length === 0 && (
          <div className="shop-empty">
            <div className="shop-empty-emoji">🌿</div>
            <h3 className="shop-empty-title">{t('noProductsFound')}</h3>
            <p className="shop-empty-desc">{t('noItemsAvailable')}</p>
            <button className="shop-empty-btn" onClick={() => handleCategoryClick('All')}>
              {t('browseAll')}
            </button>
          </div>
        )}

        {/* ── Product Grid ── */}
        {!loading && filteredProducts.length > 0 && (
          <div className="shop-grid-container">
            <div className="shop-grid">
              {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className="shop-load-more" style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
                <button
                  className="btn-load-more"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
