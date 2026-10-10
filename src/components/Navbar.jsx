import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, X, Home, Info, Phone, Heart, Clock, Package, MapPin, RefreshCw, LogOut, ChevronDown, Flame, Tag, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useWishlist } from '../context/WishlistContext';
import confetti from 'canvas-confetti';
import BrandLogoVideo from './BrandLogoVideo';
import './Navbar.css';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [user, setUser] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dharani_recent_searches') || '[]'); } catch { return []; }
  });
  const { toggleCart, cartCount } = useCart();
  const { products, refreshProducts } = useProducts();
  const { openLoginModal } = useAuthModal();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;
  const location = useLocation();

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return false;
    const nameMatch = (p.name || '').toLowerCase().includes(q);
    const tamilNameMatch = (p.tamil_name || '').toLowerCase().includes(q);
    const catMatch = (p.category_name || '').toLowerCase().includes(q);
    const descMatch = (p.description || '').toLowerCase().includes(q);
    return nameMatch || tamilNameMatch || catMatch || descMatch;
  });
  // Max 5 for suggestions
  const visibleProducts = filteredProducts.slice(0, 5);

  const rafIdRef = useRef(null);
  const handleScroll = useCallback(() => {
    if (rafIdRef.current) return;
    rafIdRef.current = requestAnimationFrame(() => {
      setScrolled(window.scrollY > 20);
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

  // Close mobile menu when route changes and check user
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSuggestions(false);
    setSearchQuery('');

    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Only update state if stringified version changed to avoid infinite re-renders
          setUser(prev => JSON.stringify(prev) !== storedUser ? parsed : prev);
        } catch(e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    
    // Listen for custom event within the same tab
    window.addEventListener('user-login-status-changed', checkUser);
    // Listen for storage events across tabs instead of polling
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('user-login-status-changed', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, [location.pathname]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.desktop-search-bar') && !e.target.closest('.mobile-search-bar')) {
        setShowSuggestions(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Derive first letter of logged-in user's name
  const actualUser = user?.user || user;
  const userName = actualUser?.name || '';
  const userInitial = userName && !['Dharani Customer', 'Vedan Customer', 'Guest User', 'Store Member'].includes(userName)
    ? userName.trim().charAt(0).toUpperCase()
    : null;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowAccountMenu(false);
    if (refreshProducts) refreshProducts();
    window.dispatchEvent(new Event('user-login-status-changed'));
    navigate('/');
  };

  // ── Recent Searches helpers ──
  const saveSearch = (keyword) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(k => k.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      try { localStorage.setItem('dharani_recent_searches', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try { localStorage.removeItem('dharani_recent_searches'); } catch {}
  };

  // Called when user clicks a product suggestion
  const handleProductClick = (productName) => {
    saveSearch(productName);
    setShowSuggestions(false);
    setSearchQuery('');
    setActiveIndex(-1);
  };

  // Called when user clicks a recent search keyword
  const handleRecentClick = (keyword) => {
    setSearchQuery(keyword);
    setShowSuggestions(true);
    saveSearch(keyword);
    setActiveIndex(-1);
  };

  const executeSearch = (query) => {
    const q = (query !== undefined ? query : searchQuery).trim();
    if (!q) return;
    saveSearch(q);
    setShowSuggestions(false);
    setActiveIndex(-1);
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  // Full keyboard navigation handler
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && activeIndex >= 0 && visibleProducts[activeIndex]) {
        const p = visibleProducts[activeIndex];
        handleProductClick(p.name);
        navigate(`/product/${p.id}`);
      } else if (searchQuery.trim()) {
        executeSearch();
      }
      return;
    }

    if (!showSuggestions) return;

    if (searchQuery) {
      // Navigate product suggestions
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => {
          const next = prev < visibleProducts.length - 1 ? prev + 1 : 0;
          setTimeout(() => {
            const el = suggestionsRef.current?.querySelector(`[data-idx="${next}"]`);
            el?.scrollIntoView({ block: 'nearest' });
          }, 0);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => {
          const next = prev > 0 ? prev - 1 : visibleProducts.length - 1;
          setTimeout(() => {
            const el = suggestionsRef.current?.querySelector(`[data-idx="${next}"]`);
            el?.scrollIntoView({ block: 'nearest' });
          }, 0);
          return next;
        });
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    } else {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    }
  };

  // Shared dropdown renderer
  const renderDropdown = () => {
    if (!showSuggestions) return null;

    // Typing: show keyboard-navigable product suggestions (max 3)
    if (searchQuery) {
      return (
        <div className="search-suggestions-dropdown" ref={suggestionsRef}>
          {visibleProducts.length > 0 ? (
            visibleProducts.map((p, idx) => (
              <Link
                to={`/product/${p.id}`}
                key={p.id}
                data-idx={idx}
                className={`search-suggestion-item${activeIndex === idx ? ' search-suggestion-active' : ''}`}
                onClick={() => handleProductClick(p.name)}
                tabIndex={-1}
              >
                <img src={p.image} alt={p.name} />
                <div className="suggestion-info">
                  <span className="suggestion-name">{language === 'ta' && p.tamil_name ? p.tamil_name : p.name}</span>
                  <span className="suggestion-price">{p.price}</span>
                </div>
                {activeIndex === idx && (
                  <span className="suggestion-kbd-hint">↵</span>
                )}
              </Link>
            ))
          ) : (
            <div className="search-suggestion-item empty">{t('noProductsFound')}</div>
          )}
        </div>
      );
    }

    // Focused, empty query: show recent searches
    if (recentSearches.length === 0) return null;
    return (
      <div className="search-suggestions-dropdown">
        <div className="recent-searches-header">
          <span className="recent-searches-label">Recent Searches</span>
          <button className="recent-searches-clear" onClick={clearRecentSearches}>Clear All</button>
        </div>
        {recentSearches.map((kw, i) => (
          <button
            key={i}
            className="search-suggestion-item recent-search-item"
            onClick={() => handleRecentClick(kw)}
          >
            <Clock size={15} className="recent-search-icon" />
            <span className="suggestion-name">{kw}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <nav className={`navbar-ultra ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Mobile Menu Toggle Button */}
        <button className={`mobile-menu-btn ${isMobileMenuOpen ? 'hidden' : ''}`} onClick={toggleMobileMenu} aria-label="Toggle Menu">
          <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Left: Logo */}
        <div className="nav-brand-container">
          <Link to="/" className="nav-brand">
            <BrandLogoVideo variant="nav" />
            <div className="brand-text-logo">
              <div className="brand-text-line1">Dharani</div>
              <div className="brand-text-line2">Herbbals<span className="brand-reg">®</span></div>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links (Moved to secondary bar) */}

        {/* Right: Action Icons */}
        <div className="nav-icons-right">
          <div className={`lang-switcher-capsule ${language === 'ta' ? 'tamil' : ''}`}>
            <button 
              className={`lang-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              aria-label="Set language to English"
            >
              EN
            </button>
            <button 
              className={`lang-option ${language === 'ta' ? 'active' : ''}`}
              onClick={() => setLanguage('ta')}
              aria-label="Set language to Tamil"
            >
              தமிழ்
            </button>
            <div className="lang-slider-pill"></div>
          </div>
          
          <div className="desktop-search-bar">
            <button
              type="button"
              className="search-icon-btn"
              onClick={() => executeSearch()}
              aria-label="Search products"
              style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'inherit' }}
            >
              <Search size={18} strokeWidth={2} className="search-icon" />
            </button>
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="search-input" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); setActiveIndex(-1); }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleSearchKeyDown}
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              role="combobox"
            />
            {renderDropdown()}
          </div>
          <div className="action-capsule">
            {/* Wishlist Button */}
            <button
              className="capsule-btn icon-only wishlist-btn"
              aria-label="Wishlist"
              onClick={() => {
                if (user) {
                  navigate('/profile', { state: { activeTab: 'wishlist' } });
                } else {
                  openLoginModal();
                }
              }}
            >
              <div className="wishlist-icon-wrapper">
                <Heart size={20} strokeWidth={2} />
                {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
              </div>
            </button>
            {/* Account Avatar / Login Button */}
            <div className="nav-account-wrapper" ref={accountMenuRef}>
              {user ? (
                <>
                  <button
                    className="capsule-btn icon-only nav-avatar-btn"
                    aria-label="My Account"
                    onClick={() => navigate('/profile')}
                    onMouseEnter={() => setShowAccountMenu(true)}
                  >
                    {userInitial ? (
                      <span className="nav-user-avatar">{userInitial}</span>
                    ) : (
                      <User size={20} strokeWidth={2} />
                    )}
                  </button>

                  {showAccountMenu && (
                    <div className="nav-account-dropdown" onMouseLeave={() => setShowAccountMenu(false)}>
                      <div className="nav-account-dropdown-header" onClick={() => { navigate('/profile'); setShowAccountMenu(false); }} style={{ cursor: 'pointer' }}>
                        {userInitial && <span className="nav-account-avatar-lg">{userInitial}</span>}
                        <div>
                          <p className="nav-account-name">{userName || 'My Account'}</p>
                          <p className="nav-account-sub">{t('myAccount')}</p>
                        </div>
                      </div>
                      <div className="nav-account-divider" />
                      <button className="nav-account-item" onClick={() => { navigate('/profile', { state: { activeTab: 'orders' } }); setShowAccountMenu(false); }}>
                        <Package size={15} /> My Orders
                      </button>
                      <button className="nav-account-item" onClick={() => { navigate('/profile', { state: { activeTab: 'wishlist' } }); setShowAccountMenu(false); }}>
                        <Heart size={15} /> {t('wishlist')}
                      </button>
                      <button className="nav-account-item" onClick={() => { navigate('/shop'); setShowAccountMenu(false); }}>
                        <RefreshCw size={15} /> Buy Again
                      </button>
                      <button className="nav-account-item" onClick={() => { navigate('/profile', { state: { activeTab: 'addresses' } }); setShowAccountMenu(false); }}>
                        <MapPin size={15} /> Saved Addresses
                      </button>
                      <button className="nav-account-item" onClick={() => { navigate('/profile', { state: { activeTab: 'account' } }); setShowAccountMenu(false); }}>
                        <User size={15} /> Account Details
                      </button>
                      <div className="nav-account-divider" />
                      <button className="nav-account-item nav-account-logout" onClick={handleLogout}>
                        <LogOut size={15} /> {t('logout')}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="capsule-btn icon-only user-btn"
                  aria-label="Account"
                  onClick={() => openLoginModal()}
                >
                  <User size={20} strokeWidth={2} />
                </button>
              )}
            </div>
            <button 
              className="capsule-btn cart-btn" 
              aria-label="Shopping Bag" 
              onClick={() => {
                toggleCart();
                confetti({
                  particleCount: 80,
                  spread: 60,
                  origin: { y: 0.1, x: 0.9 }, // Top right corner where the icon is
                  colors: ['#22c55e', '#fbbf24', '#f87171', '#a855f7', '#ffffff'],
                  zIndex: 100000
                });
              }}
            >
              <div className="cart-icon-wrapper">
                <ShoppingBag size={20} strokeWidth={2} />
                {cartCount > 0 && <span className="cart-pulse-badge"></span>}
              </div>
              <span className="cart-text">{t('cart')} {cartCount > 0 ? `(${cartCount})` : ''}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop Secondary Navbar */}
      <div className="secondary-navbar-wrapper">
        <div className="secondary-navbar-container">
          <NavLink to="/" className="sec-nav-item home-item" end>
            {t('home')}
          </NavLink>
          <NavLink to="/shop?sort=bestsellers" className="sec-nav-item bestsellers-item">
            <Flame size={18} /> {t('bestSellers')}
          </NavLink>
          <NavLink to="/shop?category=Hair" className="sec-nav-item">{t('catHair')}</NavLink>
          <NavLink to="/shop?category=Skin" className="sec-nav-item">{t('catSkin')}</NavLink>
          <NavLink to="/shop?category=Body" className="sec-nav-item">{t('catBody')}</NavLink>
          <NavLink to="/shop?category=Health%20%26%20Wellness" className="sec-nav-item">{t('catHealth')}</NavLink>
          <NavLink to="/shop?category=Food" className="sec-nav-item">{t('catFood')}</NavLink>
          <NavLink to="/shop?category=Baby" className="sec-nav-item">{t('catBaby')}</NavLink>
          <NavLink to="/shop?category=Poojas" className="sec-nav-item">{t('catPoojas')}</NavLink>
          <NavLink to="/shop?category=Beverages" className="sec-nav-item">{t('catBeverages')}</NavLink>
          <NavLink to="/shop?category=Offers" className="sec-nav-item offers-item">
            <Tag size={18} /> {t('offers')}
          </NavLink>
          {/* Filter By Button - right corner */}
          <button
            className="sec-nav-filter-btn"
            onClick={() => navigate('/shop?filter=open')}
            aria-label="Filter Products"
          >
            <SlidersHorizontal size={15} />
            {t('filterBy')}
          </button>
        </div>
      </div>
      
      {/* Mobile Search Row */}
      <div className="mobile-search-row">
        <div className="mobile-search-bar">
          <button
            type="button"
            className="search-icon-btn"
            onClick={() => executeSearch()}
            aria-label="Search products"
            style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'inherit' }}
          >
            <Search size={18} strokeWidth={2} className="search-icon" />
          </button>
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className="search-input" 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); setActiveIndex(-1); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleSearchKeyDown}
          />
          {renderDropdown()}
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}></div>
      
      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <BrandLogoVideo variant="mobile-nav" />
            <div className="brand-text-logo">
              <div className="brand-text-line1">Dharani</div>
              <div className="brand-text-line2">Herbbals<span className="brand-reg">®</span></div>
            </div>
          </div>
          <button className="close-drawer-btn" onClick={toggleMobileMenu}>
            <X size={24} />
          </button>
        </div>
        <div className="mobile-menu-links">
          <NavLink to="/" className="mobile-nav-link" onClick={toggleMobileMenu} end>
            <div className="nav-icon-box"><Home size={22} /></div>
            <span>{t('home')}</span>
          </NavLink>
          <NavLink to="/shop" className="mobile-nav-link" onClick={toggleMobileMenu}>
            <div className="nav-icon-box"><ShoppingBag size={22} /></div>
            <span>{t('shopAll')}</span>
          </NavLink>
          <NavLink to="/about" className="mobile-nav-link" onClick={toggleMobileMenu}>
            <div className="nav-icon-box"><Info size={22} /></div>
            <span>{t('aboutUs')}</span>
          </NavLink>
          <NavLink to="/contact" className="mobile-nav-link" onClick={toggleMobileMenu}>
            <div className="nav-icon-box"><Phone size={22} /></div>
            <span>{t('contact')}</span>
          </NavLink>
          {user ? (
            <NavLink to="/profile" className="mobile-nav-link" onClick={toggleMobileMenu} style={{ transitionDelay: '0.3s' }}>
              <div className="nav-icon-box">
                {userInitial ? (
                  <span className="mobile-nav-avatar">{userInitial}</span>
                ) : (
                  <User size={22} />
                )}
              </div>
              <span>{t('myAccount')}</span>
            </NavLink>
          ) : (
            <button
              className="mobile-nav-link"
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
              onClick={() => {
                toggleMobileMenu();
                openLoginModal();
              }}
            >
              <div className="nav-icon-box"><User size={22} /></div>
              <span>{t('login')} / {t('account')}</span>
            </button>
          )}
          <NavLink
            to={user ? '/profile' : '#'}
            state={{ activeTab: 'wishlist' }}
            className="mobile-nav-link"
            onClick={(e) => {
              if (!user) { e.preventDefault(); openLoginModal(); }
              toggleMobileMenu();
            }}
            style={{ transitionDelay: '0.35s' }}
          >
            <div className="nav-icon-box" style={{ position: 'relative' }}>
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="mobile-wishlist-badge">{wishlistCount}</span>
              )}
            </div>
            <span>{t('wishlist')}</span>
          </NavLink>
        </div>
        
        <div className="mobile-drawer-footer">
          <div className="mobile-lang-container">
            <div className={`lang-switcher-capsule ${language === 'ta' ? 'tamil' : ''}`}>
              <button 
                className={`lang-option ${language === 'en' ? 'active' : ''}`}
                onClick={() => { setLanguage('en'); toggleMobileMenu(); }}
                aria-label="Set language to English"
              >
                English
              </button>
              <button 
                className={`lang-option ${language === 'ta' ? 'active' : ''}`}
                onClick={() => { setLanguage('ta'); toggleMobileMenu(); }}
                aria-label="Set language to Tamil"
              >
                தமிழ்
              </button>
              <div className="lang-slider-pill"></div>
            </div>
          </div>
          <div className="mobile-auth-buttons">
            {user ? (
              <button 
                className="btn-mobile-login" 
                style={{ background: '#ef4444', border: 'none', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}
                onClick={() => {
                  localStorage.removeItem('user');
                  setUser(null);
                  if (refreshProducts) refreshProducts();
                  toggleMobileMenu();
                }}
              >
                {t('logout')}
              </button>
            ) : (
              <button className="btn-mobile-login" style={{ border: 'none', background: 'none', color: '#15803d', fontWeight: 'bold' }} onClick={() => { toggleMobileMenu(); openLoginModal(); }}>{t('login')}</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

