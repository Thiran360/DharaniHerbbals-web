import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, User, ShoppingBag, X, Home, Flame, Sparkles, Tag, ChevronRight, Menu, Check, Heart, SlidersHorizontal, Info, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuthModal } from '../context/AuthModalContext';
import confetti from 'canvas-confetti';
import BrandLogoVideo from './BrandLogoVideo';
import './Navbar.css';

// Direct product categories based ONLY on actual product data in the system
const NAV_CATEGORIES = [
  { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு', to: '/', isHome: true },
  { id: 'bestsellers', labelEn: 'Best Sellers', labelTa: 'அதிகம் விற்பனையானவை', to: '/shop?filter=bestsellers', isHot: true },
  { id: 'hair', labelEn: 'Hair', labelTa: 'கூந்தல்', to: '/shop?category=Hair', catKey: 'Hair' },
  { id: 'skin', labelEn: 'Skin', labelTa: 'சருமம்', to: '/shop?category=Skin', catKey: 'Skin' },
  { id: 'body', labelEn: 'Body', labelTa: 'உடல்', to: '/shop?category=Body', catKey: 'Body' },
  { id: 'health', labelEn: 'Health & Wellness', labelTa: 'உடல் நலம்', to: '/shop?category=Health %26 Wellness', catKey: 'Health & Wellness' },
  { id: 'food', labelEn: 'Food', labelTa: 'உணவு', to: '/shop?category=Food', catKey: 'Food' },
  { id: 'baby', labelEn: 'Baby', labelTa: 'குழந்தை', to: '/shop?category=Baby', catKey: 'Baby' },
  { id: 'poojas', labelEn: 'Poojas', labelTa: 'பூஜை', to: '/shop?category=Poojas', catKey: 'Poojas' },
  { id: 'beverages', labelEn: 'Beverages', labelTa: 'பானங்கள்', to: '/shop?category=Beverages', catKey: 'Beverages' },
  { id: 'offers', labelEn: 'Offers', labelTa: 'சலுகைகள்', to: '/shop?filter=offers', isOffer: true }
];

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [user, setUser] = useState(null);
  const { toggleCart, cartCount } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
  const { products, openFilterDrawer } = useProducts();
  const { openLoginModal } = useAuthModal();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentFilter = searchParams.get('filter') || '';

  // Filter products for instant autocomplete
  const displayProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return products.slice(0, 6);
    }
    return products.filter(p => {
      const nameMatch = (p.name || '').toLowerCase().includes(query);
      const tamilMatch = (p.tamil_name || '').toLowerCase().includes(query);
      const catMatch = (p.category_name || '').toLowerCase().includes(query);
      const brandMatch = (p.brand || '').toLowerCase().includes(query);
      const descMatch = (p.description || '').toLowerCase().includes(query);
      return nameMatch || tamilMatch || catMatch || brandMatch || descMatch;
    });
  }, [products, searchQuery]);

  const rafIdRef = useRef(null);
  const handleScroll = useCallback(() => {
    if (rafIdRef.current) return;
    rafIdRef.current = requestAnimationFrame(() => {
      setScrolled(window.scrollY > 15);
      rafIdRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [handleScroll]);

  // Sync search input if URL has search param
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && location.pathname === '/shop') {
      setSearchQuery(urlSearch);
    }
  }, [searchParams, location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSuggestions(false);

    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(prev => JSON.stringify(prev) !== storedUser ? parsed : prev);
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('user-login-status-changed', checkUser);
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('user-login-status-changed', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, [location.pathname]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-search-wrapper') && !e.target.closest('.mobile-search-wrapper')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    setShowSuggestions(false);
    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/shop');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    if (location.pathname === '/shop' && searchParams.get('search')) {
      navigate('/shop');
    }
  };

  const handleOpenFilter = () => {
    if (location.pathname !== '/shop') {
      navigate('/shop');
    }
    if (openFilterDrawer) {
      openFilterDrawer();
    }
  };

  const isNavActive = (item) => {
    if (item.isHome) {
      return location.pathname === '/' && !currentCategory && !currentFilter;
    }
    if (location.pathname !== '/shop') return false;
    if (item.isHot) return currentFilter === 'bestsellers';
    if (item.isOffer) return currentFilter === 'offers';
    if (item.catKey) return currentCategory.toLowerCase() === item.catKey.toLowerCase();
    return false;
  };

  return (
    <header className={`navbar-header-main ${scrolled ? 'is-scrolled' : ''}`}>
      {/* ─── Top Utility & Brand Bar ─── */}
      <div className="nav-top-bar">
        <div className="nav-inner-container">
          {/* Mobile Menu Button */}
          <button
            className="nav-mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Brand Logo */}
          <div className="nav-brand-section">
            <Link to="/" className="nav-brand-link" aria-label="Dharani Herbals / Vedan Mart Homepage">
              <BrandLogoVideo variant="nav" />
              <div className="nav-brand-texts">
                <div className="nav-brand-title">Dharani</div>
                <div className="nav-brand-sub">Herbbals<span className="nav-brand-reg">®</span></div>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="nav-search-wrapper">
            <form className="nav-search-form" onSubmit={handleSearchSubmit}>
              <Search size={18} className="nav-search-icon" />
              <input
                type="text"
                className="nav-search-input"
                placeholder={t('searchProducts') || 'Search product'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  setSelectedSuggestionIndex(0);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (!showSuggestions || !searchQuery.trim() || displayProducts.length === 0) return;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedSuggestionIndex((prev) => (prev + 1) % displayProducts.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedSuggestionIndex((prev) => (prev - 1 + displayProducts.length) % displayProducts.length);
                  } else if (e.key === 'Enter') {
                    if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < displayProducts.length) {
                      e.preventDefault();
                      const chosen = displayProducts[selectedSuggestionIndex];
                      setShowSuggestions(false);
                      setSearchQuery('');
                      navigate(`/product/${chosen.id}`);
                    }
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="nav-search-clear-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search query"
                >
                  <X size={15} />
                </button>
              )}
            </form>

            {/* Live Autocomplete Dropdown - Matches Screenshot 1 */}
            {showSuggestions && searchQuery.trim() && (
              <div className="search-suggestions-dropdown">
                {displayProducts.length > 0 ? (
                  displayProducts.slice(0, 6).map((p, idx) => {
                    const displayName = language === 'ta' && p.tamil_name ? p.tamil_name : p.name;
                    const rawPrice = String(p.price || '').replace(/[^0-9.]/g, '');
                    const priceFormatted = rawPrice ? `₹${rawPrice}` : (p.price || '');
                    const isActive = selectedSuggestionIndex === idx;

                    return (
                      <Link
                        to={`/product/${p.id}`}
                        key={p.id}
                        className={`search-suggestion-item ${isActive ? 'search-suggestion-active' : ''}`}
                        onMouseEnter={() => setSelectedSuggestionIndex(idx)}
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                      >
                        <img
                          src={p.image || '/logo.png'}
                          alt={displayName}
                          onError={(e) => {
                            e.target.src = '/logo.png';
                          }}
                        />
                        <div className="suggestion-info">
                          <span className="suggestion-name">{displayName}</span>
                          <span className="suggestion-price">{priceFormatted}</span>
                        </div>
                        {isActive && <span className="suggestion-kbd-hint">↵</span>}
                      </Link>
                    );
                  })
                ) : (
                  <div className="search-suggestion-item empty">
                    {t('noProductsFound') || 'No products found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons (Language, Profile, Cart) */}
          <div className="nav-actions-group">
            {/* Language Switcher Capsule */}
            <div className={`nav-lang-capsule ${language === 'ta' ? 'is-tamil' : ''}`}>
              <button
                type="button"
                className={`nav-lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-label="English"
              >
                EN
              </button>
              <button
                type="button"
                className={`nav-lang-btn ${language === 'ta' ? 'active' : ''}`}
                onClick={() => setLanguage('ta')}
                aria-label="Tamil"
              >
                தமிழ்
              </button>
              <div className="nav-lang-slider-pill"></div>
            </div>

            {/* Wishlist Icon Button */}
            <button
              type="button"
              className="nav-icon-action-btn nav-wishlist-btn"
              onClick={() => {
                if (user) {
                  navigate('/profile', { state: { activeTab: 'wishlist' } });
                } else {
                  openLoginModal();
                }
              }}
              aria-label="Wishlist"
              title={language === 'ta' ? 'விருப்பப்பட்டியல்' : 'Wishlist'}
            >
              <div className="nav-wishlist-icon-wrap">
                <Heart size={20} strokeWidth={2} />
                {wishlistCount > 0 && (
                  <span className="nav-wishlist-count-badge">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </div>
            </button>

            {/* User Profile / Account Icon */}
            {user ? (
              <Link
                to="/profile"
                className="nav-icon-action-btn nav-profile-btn has-user"
                aria-label="My Account"
                title={user.name || 'My Account'}
              >
                <div className="nav-profile-icon-wrap">
                  <User size={20} strokeWidth={2} />
                  <span className="nav-user-indicator"></span>
                </div>
                <span className="nav-action-label d-none-mobile">{t('account') || 'Account'}</span>
              </Link>
            ) : (
              <button
                type="button"
                className="nav-icon-action-btn nav-profile-btn"
                onClick={openLoginModal}
                aria-label="Log in or create account"
                title="Log In / Sign Up"
              >
                <div className="nav-profile-icon-wrap">
                  <User size={20} strokeWidth={2} />
                </div>
                <span className="nav-action-label d-none-mobile">{t('login') || 'Log In'}</span>
              </button>
            )}

            {/* Shopping Cart Icon */}
            <button
              type="button"
              className="nav-icon-action-btn nav-cart-btn"
              onClick={() => {
                toggleCart();
                confetti({
                  particleCount: 50,
                  spread: 45,
                  origin: { y: 0.1, x: 0.92 },
                  colors: ['#16a34a', '#22c55e', '#15803d', '#ffffff'],
                  zIndex: 99999
                });
              }}
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <div className="nav-cart-icon-wrap">
                <ShoppingBag size={20} strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="nav-cart-count-badge">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="nav-action-label d-none-mobile">{t('cart') || 'Cart'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Search Bar (Collapsible on Mobile) ─── */}
      <div className="nav-mobile-search-bar">
        <div className="nav-inner-container">
          <div className="mobile-search-wrapper">
            <form className="nav-search-form" onSubmit={handleSearchSubmit}>
              <Search size={17} className="nav-search-icon" />
              <input
                type="text"
                className="nav-search-input"
                placeholder={t('searchProducts') || 'Search products'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="nav-search-clear-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </form>

            {showSuggestions && searchQuery.trim() && (
              <div className="search-suggestions-dropdown mobile-dropdown">
                {displayProducts.length > 0 ? (
                  displayProducts.slice(0, 5).map((p, idx) => {
                    const displayName = language === 'ta' && p.tamil_name ? p.tamil_name : p.name;
                    const rawPrice = String(p.price || '').replace(/[^0-9.]/g, '');
                    const priceFormatted = rawPrice ? `₹${rawPrice}` : (p.price || '');
                    const isActive = selectedSuggestionIndex === idx;

                    return (
                      <Link
                        to={`/product/${p.id}`}
                        key={p.id}
                        className={`search-suggestion-item ${isActive ? 'search-suggestion-active' : ''}`}
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                      >
                        <img
                          src={p.image || '/logo.png'}
                          alt={displayName}
                          onError={(e) => { e.target.src = '/logo.png'; }}
                        />
                        <div className="suggestion-info">
                          <span className="suggestion-name">{displayName}</span>
                          <span className="suggestion-price">{priceFormatted}</span>
                        </div>
                        {isActive && <span className="suggestion-kbd-hint">↵</span>}
                      </Link>
                    );
                  })
                ) : (
                  <div className="search-suggestion-item empty">
                    {t('noProductsFound') || 'No products found'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bottom Category Navigation Row ─── */}
      <nav className="nav-category-bar" aria-label="Product categories navigation">
        <div className="nav-inner-container">
          <ul className="nav-category-list">
            {location.pathname === '/shop' && (
              <li className="nav-category-item nav-category-filter-item">
                <button
                  type="button"
                  className="nav-category-filter-btn"
                  onClick={handleOpenFilter}
                  aria-label="Filter products"
                >
                  <SlidersHorizontal size={14} className="nav-cat-filter-icon" />
                  <span>{language === 'ta' ? 'வடிகட்டு' : 'Filter by'}</span>
                </button>
              </li>
            )}
            {NAV_CATEGORIES.map((cat) => {
              const active = isNavActive(cat);
              const label = language === 'ta' ? cat.labelTa : cat.labelEn;
              return (
                <li key={cat.id} className="nav-category-item">
                  <Link
                    to={cat.to}
                    className={`nav-category-link ${active ? 'is-active' : ''} ${cat.isHot ? 'is-hot' : ''} ${cat.isOffer ? 'is-offer' : ''}`}
                  >
                    {cat.isHot && <Flame size={14} className="nav-cat-badge-icon" />}
                    {cat.isOffer && <Tag size={13} className="nav-cat-badge-icon" />}
                    <span className="nav-cat-label">{label}</span>
                    {active && <span className="nav-cat-active-pill" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ─── Mobile Drawer Menu ─── */}
      <div
        className={`nav-drawer-overlay ${isMobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <aside className={`nav-drawer ${isMobileMenuOpen ? 'is-open' : ''}`} aria-label="Mobile Navigation Menu">
        <div className="nav-drawer-header">
          <div className="nav-drawer-brand">
            <BrandLogoVideo variant="mobile-nav" />
            <div className="nav-brand-texts">
              <div className="nav-brand-title">
                <span>Dharani</span><span className="nav-brand-reg">®</span>
                <span className="nav-brand-sub">Herbbals</span>
              </div>
              <div className="nav-brand-tagline">VEDAN MART</div>
            </div>
          </div>
          <button
            className="nav-drawer-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="nav-drawer-body custom-mobile-drawer">
          <div className="nav-drawer-links custom-links">
            <Link to="/" className="nav-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="nav-drawer-link-icon-wrap"><Home size={20} strokeWidth={2} /></div>
              <span className="nav-drawer-link-text">{t('home') || 'Home'}</span>
            </Link>

            <Link to="/shop" className="nav-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="nav-drawer-link-icon-wrap"><ShoppingBag size={20} strokeWidth={2} /></div>
              <span className="nav-drawer-link-text">{language === 'ta' ? 'அனைத்தையும் வாங்குங்கள்' : 'Shop All'}</span>
            </Link>

            <Link to="/about" className="nav-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="nav-drawer-link-icon-wrap"><Info size={20} strokeWidth={2} /></div>
              <span className="nav-drawer-link-text">{t('aboutUs') || 'About Us'}</span>
            </Link>

            <Link to="/contact" className="nav-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="nav-drawer-link-icon-wrap"><Phone size={20} strokeWidth={2} /></div>
              <span className="nav-drawer-link-text">{t('contact') || 'Contact'}</span>
            </Link>

            <div 
              className="nav-drawer-link" 
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (user) navigate('/profile');
                else openLoginModal();
              }}
            >
              <div className="nav-drawer-link-icon-wrap"><User size={20} strokeWidth={2} /></div>
              <span className="nav-drawer-link-text">{t('account') || 'My Account'}</span>
            </div>
            
            <div 
              className="nav-drawer-link" 
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (user) navigate('/profile', { state: { activeTab: 'wishlist' } });
                else openLoginModal();
              }}
            >
              <div className="nav-drawer-link-icon-wrap" style={{ position: 'relative' }}>
                <Heart size={20} strokeWidth={2} />
                {wishlistCount > 0 && (
                  <span className="mobile-wishlist-badge">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </div>
              <span className="nav-drawer-link-text">{language === 'ta' ? 'விருப்பப்பட்டியல்' : 'Wishlist'}</span>
            </div>
          </div>
        </div>

        <div className="nav-drawer-footer">
          <div className="nav-drawer-lang-wrap">
            <div className={`nav-lang-capsule ${language === 'ta' ? 'is-tamil' : ''}`}>
              <button
                type="button"
                className={`nav-lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                English
              </button>
              <button
                type="button"
                className={`nav-lang-btn ${language === 'ta' ? 'active' : ''}`}
                onClick={() => setLanguage('ta')}
              >
                தமிழ்
              </button>
              <div className="nav-lang-slider-pill"></div>
            </div>
          </div>

          {user ? (
            <button
              className="nav-drawer-auth-btn logout"
              onClick={() => {
                localStorage.removeItem('user');
                setUser(null);
                setIsMobileMenuOpen(false);
              }}
            >
              {t('logout') || 'Log Out'}
            </button>
          ) : (
            <button
              className="nav-drawer-auth-btn login"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openLoginModal();
              }}
            >
              {t('login') || 'Log In / Sign Up'}
            </button>
          )}
        </div>
      </aside>
    </header>
  );
}
