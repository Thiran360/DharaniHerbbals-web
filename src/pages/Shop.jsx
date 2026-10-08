import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useNavigate, useSearchParams, useNavigationType } from 'react-router-dom';
import {
  ShoppingCart,
  Star,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
  Leaf,
  Sparkles,
  ArrowRight,
  Search,
  X,
  Flame,
  Tag,
  Check,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import FilterDrawer from '../components/FilterDrawer';
import bannerShowAll from '../assets/show-all.png';
import bannerGrp from '../assets/grp.png';
import bannerShopAll from '../assets/shopall.png';
import bannerShampoo from '../assets/chemparuthi_shampoo_transparent_v3.png';
import bannerSoap from '../assets/body_soap_transparent.png';
import bannerBeverage from '../assets/beverage_transparent.png';
import bannerBaby from '../assets/nalangu_powder_transparent_v2.png';
import bannerFood from '../assets/sathu_maavu_transparent.png';
import bannerPooja from '../assets/pooja_oil_transparent_v2.png';
import './Shop.css';

const CATEGORY_BANNERS = {
  Hair: {
    badge: '100% NATURAL HAIR CARE',
    badgeTa: '100% இயற்கை கூந்தல் பராமரிப்பு',
    title: 'Hair',
    titleTa: 'கூந்தல்',
    subtitle: 'Nourish your locks with authentic herbal oils, natural shampoos, and traditional hair care remedies for strong, shiny, and healthy hair.',
    subtitleTa: 'உண்மையான மூலிகை எண்ணெய்கள், ஷாம்புகள் மற்றும் பாரம்பரிய கூந்தல் பராமரிப்பு தயாரிப்புகளுடன் உங்கள் கூந்தலை வளப்படுத்துங்கள்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  Skin: {
    badge: 'PURE HERBAL SKIN CARE',
    badgeTa: 'தூய்மையான மூலிகை சரும பராமரிப்பு',
    title: 'Skin',
    titleTa: 'சருமம்',
    subtitle: 'Glow naturally with our authentic herbal facewashes, pure face packs, and holistic skin care remedies.',
    subtitleTa: 'எங்கள் உண்மையான மூலிகை முக கழுவிகள் மற்றும் முக பூச்சுகள் மூலம் உங்கள் சருமத்தை ஒளிரச் செய்யுங்கள்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  Body: {
    badge: '100% HERBAL BODY CARE',
    badgeTa: '100% மூலிகை உடல் பராமரிப்பு',
    title: 'Body',
    titleTa: 'உடல்',
    subtitle: 'Pamper your skin with handcrafted organic herbal soaps and refreshing natural bath powders.',
    subtitleTa: 'கையால் செய்யப்பட்ட இயற்கை மூலிகை சோப்புகள் மற்றும் குளியல் பொடிகள் மூலம் உங்கள் சருமத்தை அழகுபடுத்துங்கள்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  'Health & Wellness': {
    badge: 'PURE SIDDHA & AYURVEDIC CARE',
    badgeTa: 'தூய்மையான சித்த & ஆயுர்வேத பராமரிப்பு',
    title: 'Health & Wellness',
    titleTa: 'உடல்நலம் & ஆரோக்கியம்',
    subtitle: 'Boost your daily vital energy with authentic herbal health powders and traditional wellness supplements.',
    subtitleTa: 'உண்மையான மூலிகை சுகாதார பொடிகள் மற்றும் பாரம்பரிய ஆரோக்கிய சப்ளிமெண்ட்ஸ் மூலம் உங்கள் தினசரி முக்கிய ஆற்றலை அதிகரிக்கவும்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  Food: {
    badge: 'AUTHENTIC TRADITIONAL TASTE',
    badgeTa: 'உண்மையான பாரம்பரிய சுவை',
    title: 'Food',
    titleTa: 'உணவு',
    subtitle: 'Savor authentic homemade herbal pickles, traditional spices, and wholesome natural foods.',
    subtitleTa: 'வீட்டில் செய்யப்பட்ட பாரம்பரிய மூலிகை ஊறுகாய்கள், மசாலாப் பொருட்கள் மற்றும் ஆரோக்கியமான இயற்கை உணவுகளை சுவையுங்கள்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  Baby: {
    badge: 'GENTLE & PURE HERBAL CARE',
    badgeTa: 'மென்மையான மற்றும் தூய்மையான மூலிகை பராமரிப்பு',
    title: 'Baby',
    titleTa: 'குழந்தை',
    subtitle: 'Nurture your little ones with 100% natural, mild herbal bath powders and gentle baby care remedies.',
    subtitleTa: '100% இயற்கையான, மென்மையான மூலிகை குளியல் பொடிகள் மற்றும் குழந்தை பராமரிப்பு தயாரிப்புகளுடன் உங்கள் குழந்தைகளை பாதுகாக்கவும்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  Poojas: {
    badge: 'DIVINE SPIRITUAL ESSENTIALS',
    badgeTa: 'தெய்வீக ஆன்மீக பொருட்கள்',
    title: 'Poojas',
    titleTa: 'பூஜை பொருட்கள்',
    subtitle: 'Enhance your spiritual rituals with our pure, divine pooja oils, camphor, and sacred herbal offerings.',
    subtitleTa: 'எங்கள் தூய, தெய்வீக பூஜை எண்ணெய்கள், கற்பூரம் மற்றும் புனித மூலிகை பிரசாதங்களுடன் உங்கள் ஆன்மீக சடங்குகளை மேம்படுத்துங்கள்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  Beverages: {
    badge: 'REFRESHING NATURAL DRINKS',
    badgeTa: 'புத்துணர்ச்சியூட்டும் இயற்கை பானங்கள்',
    title: 'Beverages',
    titleTa: 'பானங்கள்',
    subtitle: 'Revitalize your body with traditional herbal teas, natural concoctions, and refreshing wellness drinks.',
    subtitleTa: 'பாரம்பரிய மூலிகை தேநீர்கள் மற்றும் புத்துணர்ச்சியூட்டும் நலவாழ்வு பானங்கள் மூலம் உங்கள் உடலை புதுப்பிக்கவும்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  bestsellers: {
    badge: 'MOST LOVED BOTANICALS',
    badgeTa: 'அதிகம் விரும்பப்பட்டவை',
    title: 'Best Sellers',
    titleTa: 'அதிகம் விற்பனையானவை',
    subtitle: 'Our highest-rated customer favorites, handpicked for exceptional quality and holistic results.',
    subtitleTa: 'வாடிக்கையாளர்களால் அதிகம் விரும்பப்பட்ட சிறந்த தயாரிப்புகள்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  offers: {
    badge: 'SPECIAL HERBAL OFFERS',
    badgeTa: 'சிறப்பு சலுகைகள்',
    title: 'Special Offers',
    titleTa: 'சிறப்பு சலுகைகள்',
    subtitle: 'Exclusive discounts on genuine Ayurvedic and botanical wellness formulations.',
    subtitleTa: 'சிறந்த இயற்கை தயாரிப்புகளுக்கான பிரத்யேக தள்ளுபடிகள்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  },
  All: {
    badge: '100% NATURAL & HERBAL',
    badgeTa: '100% இயற்கை & மூலிகை',
    title: 'Shop All',
    titleTa: 'அனைத்தையும் வாங்குங்கள்',
    subtitle: 'Discover our complete range of handcrafted wellness products rooted in nature and tradition.',
    subtitleTa: 'பாரம்பரியமும் இயற்கையும் கலந்த நலவாழ்வு தயாரிப்புகளின் எங்கள் முழுமையான வரம்பைக் கண்டறியவும்.',
    bgImage: bannerShowAll,
    image: bannerShowAll
  }
};

// ─── Premium Product Card Component ──────────────────────────────────────────
export const ProductCard = memo(({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { language, t } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);

  const navigate = useNavigate();

  const inWish = isInWishlist(product.id);
  const translatedName = language === 'ta' && product.tamil_name ? product.tamil_name : product.name;

  // Stable pseudo-random rating between 4.2 and 4.9 for display
  const displayRating = (
    4.2 + ((typeof product.id === 'number' ? product.id : (product.id ? product.id.toString().charCodeAt(0) + product.id.toString().length : 10)) % 8) * 0.1
  ).toFixed(1);

  const reviewCount = product.reviews || (85 + ((product.id || 7) % 40));

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
      e.target.style.padding = '1.5rem';
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
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
          <span>{product.category_name || 'Herbal'}</span>
        </div>

        <h3 className="uc-title" title={translatedName}>{translatedName}</h3>
        <p className="uc-subtitle">
          {language === 'ta' && product.tamil_description
            ? product.tamil_description
            : (product.description ? product.description.substring(0, 75) + '...' : 'Authentic Natural Herbal Product')}
        </p>

        <div className="uc-meta-row">
          <div className="uc-rating-row">
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span className="uc-rating-text">{displayRating}</span>
            <span className="uc-review-count">({reviewCount})</span>
          </div>
        </div>

        <div className="uc-bottom-row">
          <div className="uc-price-block">
            <span className="uc-price">{product.price}</span>
            {product.mrp && product.price !== `₹${product.mrp}` && (
              <span className="uc-original-price">₹{product.mrp}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="uc-add-text-btn"
          onClick={handleAddToCart}
          aria-label={t('addToCart') || 'Add to Cart'}
        >
          {justAdded ? (
            <>
              <Check size={14} className="uc-btn-icon" />
              <span>Added ✓</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} className="uc-btn-icon" />
              <span>{t('addToCart') || 'Add to Cart'}</span>
            </>
          )}
        </button>
      </div>

      <div className="uc-img-section">
        <button
          type="button"
          className="uc-wishlist-btn"
          onClick={handleToggleWishlist}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
          title={inWish ? "In Wishlist" : "Add to Wishlist"}
        >
          <Heart
            size={16}
            fill={inWish ? "#ef4444" : "transparent"}
            color={inWish ? "#ef4444" : "#1f2937"}
            strokeWidth={1.5}
          />
        </button>
        {product.discount && (
          <span className="pcard-badge discount" style={{ top: '8px', left: '8px' }}>{product.discount}</span>
        )}
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

// ─── Category Tab Pill ────────────────────────────────────────────────────────
const CategoryPill = ({ cat, activeCategory, activeFilter, onClick }) => {
  const { language, t } = useLanguage();

  const getLabel = () => {
    if (cat.id === 'all') return t('allProducts') || 'All Products';
    if (cat.id === 'bestsellers') return t('bestSellers') || 'Best Sellers';
    if (cat.id === 'offers') return t('offers') || 'Offers';
    if (language === 'ta' && cat.labelTa) return cat.labelTa;
    return cat.name;
  };

  const isActive =
    cat.id === 'all'
      ? activeCategory === 'All' && !activeFilter
      : cat.id === 'bestsellers'
      ? activeFilter === 'bestsellers'
      : cat.id === 'offers'
      ? activeFilter === 'offers'
      : activeCategory.toLowerCase() === cat.name.toLowerCase();

  return (
    <button
      type="button"
      className={`shop-cat-pill ${isActive ? 'is-active' : ''} ${cat.isHot ? 'is-hot' : ''} ${cat.isOffer ? 'is-offer' : ''}`}
      onClick={onClick}
    >
      {cat.isHot && <Flame size={13} className="pill-icon" />}
      {cat.isOffer && <Tag size={13} className="pill-icon" />}
      <span>{getLabel()}</span>
    </button>
  );
};

// ─── Main Shop Page ───────────────────────────────────────────────────────────
export default function Shop() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const activeBrand = searchParams.get('brand');
  const activeFilter = searchParams.get('filter'); // 'bestsellers' | 'offers'
  const activeSearch = searchParams.get('search') || '';

  const { language, translateText, t, isBulkLoading } = useLanguage();
  const [translatedHeroTitle, setTranslatedHeroTitle] = useState(activeCategory);

  // Search input state on the shop page
  const [searchInput, setSearchInput] = useState(activeSearch);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating', 'name'

  const [visibleCount, setVisibleCount] = useState(() => {
    const saved = sessionStorage.getItem('shopVisibleCount');
    return saved ? parseInt(saved, 10) : 16;
  });

  useEffect(() => {
    sessionStorage.setItem('shopVisibleCount', visibleCount);
  }, [visibleCount]);

  const scrollRestored = useRef(false);
  const [apiCategories, setApiCategories] = useState([]);
  const { isFilterOpen: isFilterOpenContext, setIsFilterOpen: setIsFilterOpenContext } = useProducts() || {};
  const [localFilterOpen, setLocalFilterOpen] = useState(false);
  const isFilterOpen = isFilterOpenContext !== undefined ? isFilterOpenContext : localFilterOpen;
  const setIsFilterOpen = setIsFilterOpenContext || setLocalFilterOpen;
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showInlineSuggestions, setShowInlineSuggestions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.shop-inline-search-wrap')) {
        setShowInlineSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync shop search input when URL searchParam changes
  useEffect(() => {
    setSearchInput(activeSearch);
  }, [activeSearch]);

  // Fetch real categories from API
  useEffect(() => {
    fetch('https://api.codingboss.in/herbal/categories/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => {
        let catsArray = [];
        if (Array.isArray(data)) {
          catsArray = data;
        } else if (data && Array.isArray(data.data)) {
          catsArray = data.data;
        }
        setApiCategories(catsArray);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setApiCategories([]);
      });
  }, []);

  // Update hero title based on active filters
  useEffect(() => {
    if (activeSearch) {
      setTranslatedHeroTitle(`${t('resultsFor') || 'Results for'} "${activeSearch}"`);
      return;
    }
    if (activeFilter === 'bestsellers') {
      setTranslatedHeroTitle(t('bestSellers') || 'Best Sellers');
      return;
    }
    if (activeFilter === 'offers') {
      setTranslatedHeroTitle(t('offers') || 'Special Offers');
      return;
    }
    if (activeBrand) {
      setTranslatedHeroTitle(`Brand: ${activeBrand}`);
      return;
    }
    if (activeCategory === 'All' || activeCategory === 'Hair' || !activeCategory) {
      setTranslatedHeroTitle(language === 'ta' ? 'எங்கள் தயாரிப்புகளை ஆராயுங்கள்' : 'Explore Our Products');
      return;
    }
    let active = true;
    if (language === 'ta') {
      translateText(activeCategory).then(res => { if (active) setTranslatedHeroTitle(res); });
    } else {
      setTranslatedHeroTitle(activeCategory);
    }
    return () => { active = false; };
  }, [language, activeCategory, activeBrand, activeFilter, activeSearch, t]);

  // Build full structured category list based only on real product categories
  const categoryPillsList = useMemo(() => {
    const rawNames = apiCategories.map(c => c.name);
    // Real categories in Dharani Herbals data
    const predefinedRealCats = [
      { id: 'hair', name: 'Hair', labelTa: 'கூந்தல்' },
      { id: 'skin', name: 'Skin', labelTa: 'சருமம்' },
      { id: 'body', name: 'Body', labelTa: 'உடல்' },
      { id: 'health', name: 'Health & Wellness', labelTa: 'உடல் நலம் & நல்வாழ்வு' },
      { id: 'food', name: 'Food', labelTa: 'உணவு' },
      { id: 'baby', name: 'Baby', labelTa: 'குழந்தை' },
      { id: 'poojas', name: 'Poojas', labelTa: 'பூஜை' },
      { id: 'beverages', name: 'Beverages', labelTa: 'பானங்கள்' }
    ];

    // Filter to only those that exist in either API categories or product data
    const existingCats = predefinedRealCats.filter(c =>
      rawNames.length === 0 || rawNames.some(rn => rn.toLowerCase() === c.name.toLowerCase())
    );

    return [
      { id: 'all', name: 'All' },
      { id: 'bestsellers', name: 'Best Sellers', isHot: true },
      ...existingCats,
      { id: 'offers', name: 'Offers', isOffer: true }
    ];
  }, [apiCategories]);

  // ── Product Filtering & Sorting ──
  const filteredProducts = useMemo(() => {
    let list = products || [];

    // 1. Search Query Filter
    const searchQuery = (activeSearch || searchInput).trim().toLowerCase();
    if (searchQuery) {
      list = list.filter(p => {
        const name = (p.name || '').toLowerCase();
        const tamilName = (p.tamil_name || '').toLowerCase();
        const cat = (p.category_name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        return name.includes(searchQuery) || tamilName.includes(searchQuery) || cat.includes(searchQuery) || brand.includes(searchQuery);
      });
    }

    // 2. Special Filter ('bestsellers' | 'offers')
    if (activeFilter === 'bestsellers') {
      list = list.filter(p => (p.rating >= 4.7) || (p.reviews > 100));
    } else if (activeFilter === 'offers') {
      list = list.filter(p => Boolean(p.discount || (p.originalPrice && p.originalPrice !== p.price)));
    }

    // 3. Category Filter
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category_name?.toLowerCase() === activeCategory.toLowerCase());
    }

    // 4. Brand Filter
    if (activeBrand) {
      const searchBrand = activeBrand.trim().toLowerCase();
      list = list.filter(p => {
        const pBrand = p.brand ? String(p.brand).trim().toLowerCase() : '';
        const pBrandId = p.brand_id ? String(p.brand_id).trim().toLowerCase() : '';
        return pBrand === searchBrand || pBrandId === searchBrand;
      });
    }

    // 5. Selected Filters Drawer (Availability, Product Type, Concern, Ingredient, Suitable For, Price)
    if (selectedFilters.availability && selectedFilters.availability.length > 0) {
      const hasInStock = selectedFilters.availability.includes('In Stock');
      const hasOutOfStock = selectedFilters.availability.includes('Out of Stock');
      if (hasInStock && !hasOutOfStock) {
        list = list.filter(p => p.in_stock !== false && (p.stock === undefined || p.stock > 0));
      } else if (!hasInStock && hasOutOfStock) {
        list = list.filter(p => p.in_stock === false || p.stock === 0);
      }
    }

    if (selectedFilters.productType && selectedFilters.productType.length > 0) {
      list = list.filter(p => {
        const pText = `${p.name || ''} ${p.tamil_name || ''} ${p.category_name || ''} ${p.description || ''}`.toLowerCase();
        return selectedFilters.productType.some(type => {
          const tLower = type.toLowerCase();
          if (tLower === 'others') {
            const known = ['powder', 'soap', 'oil', 'gel', 'shampoo', 'food', 'tea', 'malt', 'snack', 'lehyam'];
            return !known.some(k => pText.includes(k));
          }
          if (tLower === 'powder') return pText.includes('powder') || pText.includes('podi') || pText.includes('maavu') || pText.includes('churna');
          if (tLower === 'soap') return pText.includes('soap') || pText.includes('bath');
          if (tLower === 'oil') return pText.includes('oil') || pText.includes('thailam');
          if (tLower === 'gel') return pText.includes('gel');
          if (tLower === 'shampoo') return pText.includes('shampoo');
          if (tLower === 'tea') return pText.includes('tea');
          if (tLower === 'malt') return pText.includes('malt');
          if (tLower === 'snacks') return pText.includes('snack') || pText.includes('murukku') || pText.includes('chips') || pText.includes('laddu');
          if (tLower === 'lehyam') return pText.includes('lehyam') || pText.includes('legiyam');
          if (tLower === 'food') return pText.includes('food') || pText.includes('pickle') || pText.includes('syrup') || pText.includes('rice') || pText.includes('malt');
          return pText.includes(tLower);
        });
      });
    }

    if (selectedFilters.concern && selectedFilters.concern.length > 0) {
      list = list.filter(p => {
        const pText = `${p.name || ''} ${p.tamil_name || ''} ${p.category_name || ''} ${p.description || ''}`.toLowerCase();
        return selectedFilters.concern.some(c => {
          const cLower = c.toLowerCase();
          if (cLower.includes('hair')) return pText.includes('hair') || pText.includes('shampoo') || pText.includes('dandruff') || pText.includes('scalp') || pText.includes('kesa');
          if (cLower.includes('skin')) return pText.includes('skin') || pText.includes('soap') || pText.includes('gel') || pText.includes('glow') || pText.includes('face') || pText.includes('acne');
          if (cLower.includes('digest')) return pText.includes('digest') || pText.includes('stomach') || pText.includes('gastric') || pText.includes('lehyam') || pText.includes('sundi');
          if (cLower.includes('immun')) return pText.includes('immun') || pText.includes('amla') || pText.includes('kashayam') || pText.includes('wellness');
          if (cLower.includes('wellness')) return pText.includes('health') || pText.includes('wellness') || pText.includes('tea') || pText.includes('mix');
          if (cLower.includes('baby')) return pText.includes('baby') || pText.includes('child') || pText.includes('infant');
          return pText.includes(cLower);
        });
      });
    }

    if (selectedFilters.ingredient && selectedFilters.ingredient.length > 0) {
      list = list.filter(p => {
        const pText = `${p.name || ''} ${p.tamil_name || ''} ${p.description || ''}`.toLowerCase();
        return selectedFilters.ingredient.some(ing => {
          const ingLower = ing.toLowerCase();
          if (ingLower === 'kuppaimeni') return pText.includes('kuppaimeni');
          if (ingLower === 'vetiver') return pText.includes('vetiver') || pText.includes('vettiver');
          return pText.includes(ingLower);
        });
      });
    }

    if (selectedFilters.suitableFor && selectedFilters.suitableFor.length > 0) {
      list = list.filter(p => {
        const pText = `${p.name || ''} ${p.tamil_name || ''} ${p.category_name || ''} ${p.description || ''}`.toLowerCase();
        return selectedFilters.suitableFor.some(sf => {
          const sfLower = sf.toLowerCase();
          if (sfLower === 'kids') return pText.includes('baby') || pText.includes('kid') || pText.includes('child');
          if (sfLower === 'men') return !pText.includes('baby');
          if (sfLower === 'women') return !pText.includes('baby');
          return true;
        });
      });
    }

    if (selectedFilters.price && selectedFilters.price.length > 0) {
      list = list.filter(p => {
        const rawPriceStr = String(p.price || '').replace(/[^0-9.]/g, '');
        const price = parseFloat(rawPriceStr) || 0;
        return selectedFilters.price.some(range => {
          if (range === 'Under ₹100') return price < 100;
          if (range === '₹100–₹250' || range === '₹100 - ₹250') return price >= 100 && price <= 250;
          if (range === '₹250–₹500' || range === '₹250 - ₹500') return price > 250 && price <= 500;
          if (range === 'Above ₹500' || range === 'Over ₹500') return price > 500;
          return true;
        });
      });
    }

    if (selectedFilters.offers && selectedFilters.offers.length > 0) {
      list = list.filter(p => {
        const mrp = parseFloat(p.mrp || 0);
        const rawPriceStr = String(p.price || '').replace(/[^0-9.]/g, '');
        const price = parseFloat(rawPriceStr) || 0;
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

    // 6. Sorting
    const sorted = [...list];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => {
        const priceA = parseFloat(String(a.price || '').replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(String(b.price || '').replace(/[^0-9.]/g, '')) || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => {
        const priceA = parseFloat(String(a.price || '').replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(String(b.price || '').replace(/[^0-9.]/g, '')) || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else {
      // Featured / Default sort: Products with images first, end products to the end
      sorted.sort((a, b) => {
        const aHasImage = a.image && a.image.trim().length > 0;
        const bHasImage = b.image && b.image.trim().length > 0;
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();
        const aIsEnd = aName.includes("sowbakiya sundi") || aName.includes("thuthuvalai");
        const bIsEnd = bName.includes("sowbakiya sundi") || bName.includes("thuthuvalai");

        if (aHasImage && !bHasImage) return -1;
        if (!aHasImage && bHasImage) return 1;
        if (!aIsEnd && bIsEnd) return -1;
        if (aIsEnd && !bIsEnd) return 1;
        return 0;
      });
    }

    return sorted;
  }, [products, activeCategory, activeBrand, activeFilter, activeSearch, searchInput, selectedFilters, sortBy]);

  // Category Pill Click
  const handleCategoryPillClick = (cat) => {
    const newParams = {};
    if (activeSearch) newParams.search = activeSearch;

    if (cat.id === 'all') {
      // Clear category and filter
    } else if (cat.id === 'bestsellers') {
      newParams.filter = 'bestsellers';
    } else if (cat.id === 'offers') {
      newParams.filter = 'offers';
    } else {
      newParams.category = cat.name;
    }

    setSearchParams(newParams);
    setVisibleCount(16);
    sessionStorage.setItem('shopVisibleCount', 16);
    sessionStorage.removeItem('shopScrollPos');

    const shopGridSection = document.querySelector('.shop-main-content');
    if (shopGridSection) {
      const topPos = shopGridSection.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const val = searchInput.trim();
    const newParams = {};
    if (activeCategory !== 'All') newParams.category = activeCategory;
    if (activeFilter) newParams.filter = activeFilter;
    if (val) newParams.search = val;

    setSearchParams(newParams);
    setVisibleCount(16);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const newParams = {};
    if (activeCategory !== 'All') newParams.category = activeCategory;
    if (activeFilter) newParams.filter = activeFilter;
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    setSearchInput('');
    setSelectedFilters({});
    setSearchParams({});
    setVisibleCount(16);
  };

  const hasActiveFilters =
    activeCategory !== 'All' ||
    Boolean(activeFilter) ||
    Boolean(activeSearch) ||
    Boolean(activeBrand) ||
    Object.keys(selectedFilters).length > 0;

  const navType = useNavigationType();

  useEffect(() => {
    if (filteredProducts && filteredProducts.length > 0 && !scrollRestored.current) {
      const savedScroll = sessionStorage.getItem('shopScrollPos');
      if (savedScroll && navType === 'POP') {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        }, 100);
      }
      scrollRestored.current = true;
    }
  }, [filteredProducts, navType]);

  const currentBannerKey = activeFilter || (activeCategory !== 'All' ? activeCategory : 'All');
  const bannerMeta = CATEGORY_BANNERS[currentBannerKey] || CATEGORY_BANNERS[activeCategory] || CATEGORY_BANNERS['All'];
  const currentBadge = language === 'ta' && bannerMeta.badgeTa ? bannerMeta.badgeTa : bannerMeta.badge;
  const currentSubtitle = language === 'ta' && bannerMeta.subtitleTa ? bannerMeta.subtitleTa : bannerMeta.subtitle;
  const currentBgImage = bannerMeta.bgImage || bannerShowAll;

  const inlineSearchSuggestions = searchInput.trim()
    ? products.filter(p => {
        const query = searchInput.toLowerCase();
        const nameMatch = (p.name || '').toLowerCase().includes(query);
        const tamilMatch = (p.tamil_name || '').toLowerCase().includes(query);
        const catMatch = (p.category_name || '').toLowerCase().includes(query);
        return nameMatch || tamilMatch || catMatch;
      }).slice(0, 6)
    : [];

  return (
    <div className="shop-page-wrapper">
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      {/* ─── Hero Banner Card (Matches Reference Screenshot) ─── */}
      <section className="shop-hero-wrapper">
        <div
          className="shop-hero-card"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(12, 45, 15, 0.82) 0%, rgba(12, 45, 15, 0.42) 45%, rgba(0, 0, 0, 0) 72%), url(${currentBgImage})`
          }}
        >
          <div className="shop-hero-text-col">
            <div className="shop-hero-badge">
              <Leaf size={14} className="shop-hero-leaf" />
              <span>{currentBadge}</span>
            </div>
            <h1 className="shop-hero-heading">{translatedHeroTitle}</h1>
            <p className="shop-hero-subheading">{currentSubtitle}</p>
            <button
              type="button"
              className="shop-hero-cta-btn"
              onClick={() => {
                const target = document.querySelector('.shop-main-content');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span>{language === 'ta' ? 'இப்போதே வாங்குங்கள்' : 'Shop Now'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Translation Loading Banner ─── */}
      {isBulkLoading && (
        <div className="shop-translation-bar">
          <span className="shop-spinner" />
          <span>{t('translating') || 'Translating product names...'}</span>
        </div>
      )}

      {/* ─── Main Shop Container ─── */}
      <main className="shop-main-content">


        {/* ── Active Filter Tags & Results Count Bar ── */}
        <div className="shop-meta-bar">
          <div className="shop-count-indicator">
            <span className="shop-count-text">
              {t('showing') || 'Showing'} <strong>{filteredProducts.length}</strong> {t('of') || 'of'}{' '}
              <strong>{products.length}</strong> {t('products') || 'products'}
            </span>
          </div>

          {hasActiveFilters && (
            <div className="shop-active-filters-chips">
              {activeCategory !== 'All' && (
                <span className="shop-filter-chip">
                  <span>{activeCategory}</span>
                  <button type="button" onClick={() => handleCategoryPillClick({ id: 'all' })}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {activeFilter && (
                <span className="shop-filter-chip">
                  <span>{activeFilter === 'bestsellers' ? 'Best Sellers' : 'Special Offers'}</span>
                  <button type="button" onClick={() => handleCategoryPillClick({ id: 'all' })}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {activeSearch && (
                <span className="shop-filter-chip">
                  <span>"{activeSearch}"</span>
                  <button type="button" onClick={handleClearSearch}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {Object.entries(selectedFilters).map(([catKey, vals]) =>
                Array.isArray(vals) && vals.map(val => (
                  <span key={`${catKey}-${val}`} className="shop-filter-chip">
                    <span>{val}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilters(prev => ({
                          ...prev,
                          [catKey]: (prev[catKey] || []).filter(x => x !== val)
                        }));
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
              <button
                type="button"
                className="shop-clear-all-link"
                onClick={handleClearAllFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div className="shop-products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="shop-skeleton-card">
                <div className="shop-skeleton-img" />
                <div className="shop-skeleton-body">
                  <div className="shop-skeleton-line short" />
                  <div className="shop-skeleton-line title" />
                  <div className="shop-skeleton-line sub" />
                  <div className="shop-skeleton-line price" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && filteredProducts.length === 0 && (
          <div className="shop-empty-state">
            <div className="shop-empty-icon-wrap">
              <Leaf size={42} className="shop-empty-leaf" />
            </div>
            <h2 className="shop-empty-title">{t('noProductsFound') || 'No products found'}</h2>
            <p className="shop-empty-text">
              {t('noItemsAvailable') || 'We could not find any products matching your current search or filter criteria.'}
            </p>
            <button
              type="button"
              className="shop-empty-reset-btn"
              onClick={handleClearAllFilters}
            >
              {t('browseAll') || 'Browse All Products'}
            </button>
          </div>
        )}

        {/* ── Product Grid ── */}
        {!loading && filteredProducts.length > 0 && (
          <div className="shop-grid-section">
            <div className="shop-products-grid shop-grid">
              {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="shop-pagination-wrap">

                <button
                  type="button"
                  className="shop-load-more-btn"
                  onClick={() => setVisibleCount(prev => prev + 16)}
                >
                  {language === 'ta' ? 'மேலும் காண்க' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
