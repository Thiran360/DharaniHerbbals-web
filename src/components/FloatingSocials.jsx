import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Sparkles, HelpCircle } from 'lucide-react';
import Chatbot from './Chatbot';
import { useCart } from '../context/CartContext';
import { COMPANY_FACTS } from '../data/companyFacts';
import './FloatingSocials.css';

function InstaIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="float-icon-svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function FloatingSocials() {
  const { cartItems = [], cartTotal = 0 } = useCart();
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const containerRef = useRef(null);
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');
  const isCartPage = location.pathname === '/cart';
  const isCheckoutPage = location.pathname === '/checkout';


  const getWhatsAppChatUrl = () => {
    const rawNumber = COMPANY_FACTS.contact.whatsappNumber || '919788122001';
    let text = 'Hello Dharani Herbbals, I would like to inquire about your authentic herbal products and offers.';

    if (location.pathname === '/cart' && cartItems && cartItems.length > 0) {
      let itemsSummary = cartItems.slice(0, 4).map(i => `• ${i.name} (Qty: ${i.quantity})`).join('\n');
      if (cartItems.length > 4) {
        itemsSummary += `\n• ...and ${cartItems.length - 4} more item(s)`;
      }
      text = `Hello Dharani Herbbals,\n\nI have items in my shopping cart on your website:\n${itemsSummary}\n\nEstimated Total: ₹${cartTotal}\nPlease assist me with placing this order.`;
    } else if (location.pathname.startsWith('/product/')) {
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      text = `Hello Dharani Herbbals,\n\nI am interested in this herbal product from your website (${pageUrl}). Please share more details.`;
    } else if (location.pathname.startsWith('/combo/') || location.pathname.startsWith('/bundle/')) {
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      text = `Hello Dharani Herbbals,\n\nI would like to enquire about this combo offer on your website: ${pageUrl}`;
    }

    return `https://api.whatsapp.com/send?phone=${rawNumber}&text=${encodeURIComponent(text)}`;
  };

  // Close launcher on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsLauncherOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsLauncherOpen(false);
      }
    }

    if (isLauncherOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLauncherOpen]);

  // Close launcher on route change
  useEffect(() => {
    setIsLauncherOpen(false);
  }, [location.pathname]);

  const toggleLauncher = () => {
    if (isChatbotOpen) {
      setIsChatbotOpen(false);
      setIsLauncherOpen(false);
    } else {
      setIsLauncherOpen(prev => !prev);
    }
  };

  const handleOpenAssistant = () => {
    setIsChatbotOpen(true);
    setIsLauncherOpen(false);
  };

  if (isCheckoutPage || isCartPage) return null;

  return (
    <div
      ref={containerRef}
      className={`floating-socials-container ${isProductPage ? 'on-product-page' : ''} ${isLauncherOpen ? 'launcher-open' : ''} ${isChatbotOpen ? 'chatbot-active' : ''}`}
    >
      {/* Background scrim when launcher is open on mobile */}
      {isLauncherOpen && (
        <div
          className="floating-launcher-backdrop"
          onClick={() => setIsLauncherOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Embedded Chatbot Window */}
      <Chatbot
        isOpen={isChatbotOpen}
        setIsOpen={setIsChatbotOpen}
        hideTriggerButton={true}
      />

      {/* Expanded Speed-Dial Action Items */}
      <div
        className={`floating-actions-menu ${isLauncherOpen ? 'open' : ''}`}
        aria-hidden={!isLauncherOpen}
      >
        {/* 1. WhatsApp Chat */}
        <a
          href={getWhatsAppChatUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-action-item action-whatsapp"
          aria-label="Chat with Dharani Herbbals on WhatsApp"
          tabIndex={isLauncherOpen ? 0 : -1}
          onClick={() => setIsLauncherOpen(false)}
        >
          <span className="floating-action-label">WhatsApp Chat</span>
          <div className="floating-action-icon">
            <MessageCircle size={22} />
          </div>
        </a>

        {/* 2. Instagram */}
        <a
          href={COMPANY_FACTS.socials.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-action-item action-instagram"
          aria-label="Follow on Instagram"
          tabIndex={isLauncherOpen ? 0 : -1}
          onClick={() => setIsLauncherOpen(false)}
        >
          <span className="floating-action-label">Instagram</span>
          <div className="floating-action-icon">
            <InstaIcon />
          </div>
        </a>

        {/* 3. AI Assistant */}
        <button
          type="button"
          className="floating-action-item action-assistant"
          aria-label="Open Dharani Herbal Assistant"
          tabIndex={isLauncherOpen ? 0 : -1}
          onClick={handleOpenAssistant}
        >
          <span className="floating-action-label">Ask Assistant</span>
          <div className="floating-action-icon">
            <Sparkles size={22} />
          </div>
        </button>
      </div>

      {/* Main Single Floating Launcher Trigger */}
      {!isChatbotOpen && (
        <button
          type="button"
          className={`floating-launcher-trigger ${isLauncherOpen ? 'active' : ''}`}
          onClick={toggleLauncher}
          aria-label={isLauncherOpen ? 'Close support menu' : 'Open help, chat, and assistant options'}
          aria-expanded={isLauncherOpen}
        >
          <div className="launcher-icon-wrap">
            {isLauncherOpen ? (
              <X size={24} className="launcher-icon-close" />
            ) : (
              <div className="launcher-icon-combo">
                <div className="launcher-d-logo-badge">
                  <img
                    src="/favicon.png"
                    alt="Dharani Herbbals"
                    className="launcher-d-logo"
                    width="28"
                    height="28"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/videos/logo_transparent.webp';
                    }}
                  />
                </div>
                <span className="launcher-sparkle-pip" aria-hidden="true">
                  <Sparkles size={10} />
                </span>
              </div>
            )}
          </div>
        </button>
      )}
    </div>
  );
}
