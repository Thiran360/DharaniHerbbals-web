import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useNavigate, useSearchParams, useNavigationType, Link } from 'react-router-dom';
import { ShoppingCart, Star, SlidersHorizontal, Heart, Plus, Clock, ShoppingBag, Leaf, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL, resolveMediaUrl } from '../services/api';
import { formatProductPackSize, formatProductDisplayName, formatCurrency } from '../utils/productFormatters';
import { searchProducts } from '../utils/searchHelper';
import { filterProductList } from '../utils/filterHelper';
import FilterDrawer from '../components/FilterDrawer';
import ComboOffersSection from '../components/ComboOffersSection';
import SeoHead from '../components/SeoHead';
import { getVerifiedReviewData } from '../utils/productReviews';
import grpImg from '../assets/grp.webp';
import hairBannerImg from '../assets/hair_banner_transparent.webp';
import imgBody from '../assets/body_soap_transparent.webp';
import imgFood from '../assets/pirandai_pickle_transparent_v2.webp';
import imgSkin from '../assets/aloe_vera_face_pack_transparent.webp';
import imgHealth from '../assets/sathu_maavu_transparent.webp';
import imgBaby from '../assets/nalangu_powder_transparent_v2.webp';
import imgPoojas from '../assets/pooja_oil_transparent_v2.webp';
import imgBeverages from '../assets/beverage_transparent.webp';
import imgAll from '../assets/show-all.webp';
import './Shop.css';

const getCategoryBullets = (catKey, language) => {
  if (language === 'ta') {
    return '• 100% இயற்கை மூலிகை • பாரம்பரிய தயாரிப்பு • தூய்மையான தரம்';
  }
  switch (catKey) {
    case 'hair':
    case 'hair care':
      return '• High Performance • 100% Natural • Root Nourishing';
    case 'skin':
    case 'skin care':
      return '• Pure Herbs • Radiant Glow • Chemical Free';
    case 'body':
      return '• Handcrafted Soaps • Organic Herbs • Refreshing Bath';
    case 'food':
      return '• Authentic Recipe • Traditional Taste • 100% Pure';
    case 'health':
    case 'health & wellness':
      return '• Pure Siddha • Daily Vitality • Herbal Nutrition';
    case 'baby':
      return '• Extra Gentle • 100% Pure Herbs • Hypoallergenic';
    case 'poojas':
      return '• Sacred Aromas • Pure Lamp Oils • Divine Ambience';
    case 'beverages':
      return '• Natural Herbal Teas • Immunity Boost • Zero Sugar';
    default:
      return '• High performance • Natural • Sustainable';
  }
};

const CATEGORY_HERO_CONFIG = {
  hair: {
    titleKey: 'hairCareTitle',
    defaultTitle: 'Hair Care Collection',
    tagKey: 'hairCareTag',
    defaultTag: '100% Natural Hair Care',
    subKey: 'hairCareDesc',
    defaultSub: 'Nourish your locks with authentic herbal oils, natural shampoos, and traditional hair care remedies for strong, shiny, and healthy hair.',
    bgImage: hairBannerImg
  },
  'hair care': {
    titleKey: 'hairCareTitle',
    defaultTitle: 'Hair Care Collection',
    tagKey: 'hairCareTag',
    defaultTag: '100% Natural Hair Care',
    subKey: 'hairCareDesc',
    defaultSub: 'Nourish your locks with authentic herbal oils, natural shampoos, and traditional hair care remedies for strong, shiny, and healthy hair.',
    bgImage: hairBannerImg
  },
  skin: {
    titleKey: 'skinCareTitle',
    defaultTitle: 'Skin Care Collection',
    tagKey: 'skinCareTag',
    defaultTag: 'Pure & Radiant Skin Care',
    subKey: 'skinCareDesc',
    defaultSub: 'Rejuvenate your skin with authentic herbal face packs, natural aloe gels, and traditional skin remedies.',
    bgImage: imgSkin
  },
  'skin care': {
    titleKey: 'skinCareTitle',
    defaultTitle: 'Skin Care Collection',
    tagKey: 'skinCareTag',
    defaultTag: 'Pure & Radiant Skin Care',
    subKey: 'skinCareDesc',
    defaultSub: 'Rejuvenate your skin with authentic herbal face packs, natural aloe gels, and traditional skin remedies.',
    bgImage: imgSkin
  },
  body: {
    titleKey: 'bodyCareTitle',
    defaultTitle: 'Bath & Body Essentials',
    tagKey: 'bodyCareTag',
    defaultTag: '100% Herbal Body Care',
    subKey: 'bodyCareDesc',
    defaultSub: 'Pamper your skin with handcrafted organic herbal soaps and refreshing natural bath powders.',
    bgImage: imgBody
  },
  food: {
    titleKey: 'foodTitle',
    defaultTitle: 'Traditional Food & Pickles',
    tagKey: 'foodTag',
    defaultTag: 'Authentic Traditional Taste',
    subKey: 'foodDesc',
    defaultSub: 'Savor authentic homemade herbal pickles, traditional spices, and wholesome natural foods.',
    bgImage: imgFood
  },
  'health & wellness': {
    titleKey: 'healthTitle',
    defaultTitle: 'Health & Wellness Care',
    tagKey: 'healthTag',
    defaultTag: 'Pure Siddha & Ayurvedic Care',
    subKey: 'healthDesc',
    defaultSub: 'Boost your daily vital energy with authentic herbal health powders and traditional wellness supplements.',
    bgImage: imgHealth
  },
  health: {
    titleKey: 'healthTitle',
    defaultTitle: 'Health & Wellness Care',
    tagKey: 'healthTag',
    defaultTag: 'Pure Siddha & Ayurvedic Care',
    subKey: 'healthDesc',
    defaultSub: 'Boost your daily vital energy with authentic herbal health powders and traditional wellness supplements.',
    bgImage: imgHealth
  },
  baby: {
    titleKey: 'babyTitle',
    defaultTitle: 'Gentle Baby Care',
    tagKey: 'babyTag',
    defaultTag: 'Gentle & Pure Herbal Care',
    subKey: 'babyDesc',
    defaultSub: 'Nurture your little ones with 100% natural, mild herbal bath powders and gentle baby care remedies.',
    bgImage: imgBaby
  },
  poojas: {
    titleKey: 'poojasTitle',
    defaultTitle: 'Divine Pooja Essentials',
    tagKey: 'poojasTag',
    defaultTag: 'Traditional Sacred Aromas',
    subKey: 'poojasDesc',
    defaultSub: 'Elevate your spiritual ambiance with pure natural lamp oils, herbal incenses, and sacred pooja essentials.',
    bgImage: imgPoojas
  },
  beverages: {
    titleKey: 'beveragesTitle',
    defaultTitle: 'Herbal Teas & Beverages',
    tagKey: 'beveragesTag',
    defaultTag: 'Refreshing Natural Drinks',
    subKey: 'beveragesDesc',
    defaultSub: 'Revitalize your body with traditional herbal teas, natural concoctions, and refreshing wellness drinks.',
    bgImage: imgBeverages
  },
  all: {
    titleKey: 'ourCollection',
    defaultTitle: 'Explore Our Products',
    tagKey: 'herbalTag',
    defaultTag: '100% Natural & Herbal',
    subKey: 'handcraftedWellness',
    defaultSub: 'Handcrafted wellness products rooted in nature and tradition.',
    bgImage: imgAll
  }
};

import ProductCard from '../components/ProductCard';
export { ProductCard };

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
      role="tab"
      aria-selected={activeCategory === cat}
      aria-label={`Filter by category: ${name}`}
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
  const activeSearch = searchParams.get('search') || searchParams.get('q') || '';
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
    fetch(`${API_BASE_URL}/categories/`, {
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
    if (activeSearch) {
      setTranslatedHeroCat(`"${activeSearch}"`);
      return;
    }
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
  }, [language, activeCategory, activeBrand, activeSearch, t]);

  const categories = useMemo(() => {
    return ['All', ...apiCategories.map(c => c.name)];
  }, [apiCategories]);

  const filteredProducts = useMemo(() => {
    let list = products || [];

    // 0. Search Query Filter
    if (activeSearch) {
      list = searchProducts(list, activeSearch);
    }

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

    // 2. Apply multi-facet product filters (productType, concern, ingredient, intended customer, price, availability)
    list = filterProductList(list, selectedFilters);

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
  }, [products, activeCategory, activeBrand, activeSearch, selectedFilters]);


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


  const currentCategoryKey = (activeCategory || '').trim().toLowerCase();
  const catConfig = CATEGORY_HERO_CONFIG[currentCategoryKey] || CATEGORY_HERO_CONFIG['all'];

  const heroTagText = t(catConfig.tagKey) || catConfig.defaultTag;
  const heroSubText = t(catConfig.subKey) || catConfig.defaultSub;
  const heroTitleText = activeCategory === 'All' ? t('Explore Our Products') : (translatedHeroCat || catConfig.defaultTitle);
  const heroBgImg = catConfig.bgImage || imgAll;

  const shopSeo = useMemo(() => {
    const isCat = activeCategory && activeCategory !== 'All';
    const catName = isCat ? (translatedHeroCat || catConfig.defaultTitle) : 'All Products';
    const title = isCat
      ? `${catName} | Herbal Products & Traditional Care | Dharani Herbals`
      : 'Shop All Authentic Herbal Products | Dharani Herbals';
    const description = isCat
      ? `Explore our collection of authentic herbal ${catName.toLowerCase()} crafted with pure botanical extracts and traditional Siddha wisdom.`
      : 'Browse our complete catalog of verified botanical hair care, skincare, baby care, traditional food, and pooja essentials.';
    const canonicalUrl = isCat
      ? `https://www.dharaniherbbals.in/shop?category=${encodeURIComponent(activeCategory)}`
      : 'https://www.dharaniherbbals.in/shop';

    return {
      title,
      description,
      canonicalUrl,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        image: 'https://www.dharaniherbbals.in/logo.png',
        type: 'website'
      },
      keywords: isCat
        ? [`herbal ${catName.toLowerCase()}`, `${catName.toLowerCase()} online`, 'dharani herbals', 'botanical products']
        : ['herbal products', 'siddha wellness', 'dharani herbals catalog', 'ayurvedic products']
    };
  }, [activeCategory, translatedHeroCat, catConfig]);

  return (
    <div className="shop-root">
      <SeoHead {...shopSeo} />
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        products={products}
      />

      {/* ── Mobile Category Header (Rendered ONLY on mobile when a category is selected) ── */}
      {activeCategory && activeCategory !== 'All' && (
        <div className="shop-category-header mobile-only-cat-header">
          <div className="shop-category-breadcrumbs">
            <Link to="/">{t('home')}</Link>
            <span className="crumb-sep">›</span>
            <span className="crumb-current">{translatedHeroCat || catConfig.defaultTitle}</span>
          </div>

          <h1 className="shop-category-title">{translatedHeroCat || catConfig.defaultTitle}</h1>

          <div className="shop-category-bullets">
            {getCategoryBullets(currentCategoryKey, language)}
          </div>

          <p className="shop-category-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? (t('itemInCollection') || 'product') : (t('itemsInCollection') || 'products')}
          </p>
        </div>
      )}

      {/* ── Hero Banner: Always shown on desktop with image; on mobile shown only when activeCategory === 'All' ── */}
      <div className={`shop-hero ${activeCategory && activeCategory !== 'All' ? 'shop-hero-desktop-only shop-hero-category' : ''}`}>
        <div className="shop-hero-container">
          <div className="shop-hero-content">
            <span className="shop-hero-tag"><Leaf size={14} /> {heroTagText}</span>
            <h1 className="shop-hero-title">
              <span>{heroTitleText}</span>
            </h1>
            <p className="shop-hero-sub">
              {heroSubText}
            </p>

            <div className="shop-hero-actions">
              <button className="shop-btn-primary" onClick={() => {
                const target = document.querySelector('.shop-body');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}>{language === 'ta' ? 'இப்போதே வாங்குங்கள்' : 'Shop Now'} <ArrowRight size={16} /></button>
            </div>
          </div>

          <div className="shop-hero-right-visual">
            <div className="shop-hero-visual-card">
              <img src={heroBgImg} alt={heroTitleText} className="shop-hero-right-img" />
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
          <button
            type="button"
            className="shop-filter-left"
            onClick={() => setIsFilterOpen(true)}
            aria-label={`Open product filters${Object.keys(selectedFilters).length > 0 ? ` (${Object.values(selectedFilters).flat().length} active)` : ''}`}
            aria-expanded={isFilterOpen}
          >
            <SlidersHorizontal size={20} className="shop-filter-icon" aria-hidden="true" />
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
          </button>
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

        {/* ── Active Combo Offers Section ── */}
        {activeCategory === 'All' && !activeBrand && Object.keys(selectedFilters).length === 0 && (
          <div style={{ marginBottom: '20px' }}>
            <ComboOffersSection />
          </div>
        )}

        {/* ── Active Filter Chips Bar ── */}
        {Object.values(selectedFilters).flat().length > 0 && (
          <div className="shop-active-filters-chips">
            <span className="shop-active-filters-title">Active Filters:</span>
            <div className="shop-active-chips-list">
              {Object.entries(selectedFilters).map(([catId, options]) =>
                (options || []).map(option => (
                  <button
                    key={`${catId}-${option}`}
                    className="shop-filter-chip"
                    onClick={() => {
                      setSelectedFilters(prev => {
                        const next = (prev[catId] || []).filter(o => o !== option);
                        const updated = { ...prev };
                        if (next.length > 0) updated[catId] = next;
                        else delete updated[catId];
                        return updated;
                      });
                    }}
                    title={`Remove ${option}`}
                  >
                    <span>{option}</span>
                    <span className="chip-x">×</span>
                  </button>
                ))
              )}
              <button
                type="button"
                className="shop-clear-all-chips-btn"
                onClick={() => setSelectedFilters({})}
              >
                Clear All ✕
              </button>
            </div>
          </div>
        )}

        {/* ── Results info ── */}
        <div className="shop-results-bar">
          <p className="shop-results-text">
            {t('showing')} <strong>{filteredProducts.length}</strong> {t('of')} <strong>{products.length}</strong> {t('products')}
            {activeSearch && <> for &ldquo;<strong>{activeSearch}</strong>&rdquo;</>}
            {activeCategory !== 'All' && <> {t('in')} <strong className="shop-results-cat">{translatedHeroCat}</strong></>}
          </p>
          {activeSearch && (
            <button
              type="button"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('search');
                newParams.delete('q');
                setSearchParams(newParams);
              }}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '0.82rem',
                color: '#475569',
                cursor: 'pointer',
                fontWeight: 600,
                marginLeft: '12px'
              }}
            >
              Clear Search ✕
            </button>
          )}
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
