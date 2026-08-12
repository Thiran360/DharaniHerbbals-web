import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Zap, X, Home, Info, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuthModal } from '../context/AuthModalContext';
import confetti from 'canvas-confetti';
import BrandLogoVideo from './BrandLogoVideo';
import './Navbar.css';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [user, setUser] = useState(null);
  const { toggleCart, cartCount } = useCart();
  const { products, refreshProducts } = useProducts();
  const { openLoginModal } = useAuthModal();
  const location = useLocation();

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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

        {/* Center: Navigation Links */}
        <div className="nav-links-center">
          <NavLink to="/" className="nav-link" end>
            <span className="nav-link-text">{t('home')}</span>
          </NavLink>
          <NavLink to="/shop" className="nav-link">
            <span className="nav-link-text">{t('shopAll')}</span>
          </NavLink>
          <NavLink to="/about" className="nav-link">
            <span className="nav-link-text">{t('aboutUs')}</span>
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            <span className="nav-link-text">{t('contact')}</span>
          </NavLink>
        </div>

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
            <Search size={18} strokeWidth={2} className="search-icon" />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="search-input" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && searchQuery && (
              <div className="search-suggestions-dropdown">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 5).map(p => (
                    <Link to={`/product/${p.id}`} key={p.id} className="search-suggestion-item">
                      <img src={p.image} alt={p.name} />
                      <div className="suggestion-info">
                        <span className="suggestion-name">{p.name}</span>
                        <span className="suggestion-price">{p.price}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="search-suggestion-item empty">{t('noProductsFound')}</div>
                )}
              </div>
            )}
          </div>
          <div className="action-capsule">
            {user ? (
              <Link to="/profile" className="capsule-btn icon-only user-btn" aria-label="Account">
                <User size={20} strokeWidth={2} />
              </Link>
            ) : (
              <button className="capsule-btn icon-only user-btn" aria-label="Account" onClick={openLoginModal}>
                <User size={20} strokeWidth={2} />
              </button>
            )}
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
      
      {/* Mobile Search Row */}
      <div className="mobile-search-row">
        <div className="mobile-search-bar">
          <Search size={18} strokeWidth={2} className="search-icon" />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className="search-input" 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && searchQuery && (
            <div className="search-suggestions-dropdown">
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 5).map(p => (
                  <Link to={`/product/${p.id}`} key={p.id} className="search-suggestion-item">
                    <img src={p.image} alt={p.name} />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{p.name}</span>
                      <span className="suggestion-price">{p.price}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="search-suggestion-item empty">{t('noProductsFound')}</div>
              )}
            </div>
          )}
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
          {user && (
            <NavLink to="/profile" className="mobile-nav-link" onClick={toggleMobileMenu} style={{ transitionDelay: '0.3s' }}>
              <div className="nav-icon-box"><User size={22} /></div>
              <span>{t('myAccount')}</span>
            </NavLink>
          )}
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
          <p className="mobile-copyright">© {new Date().getFullYear()} {t('copyright')}</p>
        </div>
      </div>
    </nav>
  );
}
