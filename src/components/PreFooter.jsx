import { useState, useEffect, useRef } from 'react';
import { Leaf, Truck, Lock, Star, MessageCircle } from 'lucide-react';
import './PreFooter.css';

export default function PreFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="prefooter-wrapper" ref={containerRef}>
      
      {/* Top Section: Features (Light Green) */}
      <div className="pf-features-section">
        <div className="pf-features-grid">
          
          <div className={`pf-feature-item pf-hover-green ${isVisible ? 'pf-animate-up-1' : 'opacity-0'}`}>
            <div className="pf-icon-circle">
              <Leaf size={24} color="#22c55e" className="pf-icon-inner" />
            </div>
            <h4 className="pf-feature-title">100% Natural</h4>
            <p className="pf-feature-desc">Pure herbal products</p>
          </div>

          <div className={`pf-feature-item pf-hover-orange ${isVisible ? 'pf-animate-up-2' : 'opacity-0'}`}>
            <div className="pf-icon-circle">
              <Truck size={24} color="#f97316" className="pf-icon-inner" />
            </div>
            <h4 className="pf-feature-title">Free Delivery</h4>
            <p className="pf-feature-desc">On orders above ₹750 (Tamil Nadu) / ₹1000 (Other States)</p>
          </div>

          <div className={`pf-feature-item pf-hover-yellow ${isVisible ? 'pf-animate-up-3' : 'opacity-0'}`}>
            <div className="pf-icon-circle">
              <Lock size={24} color="#eab308" className="pf-icon-inner" />
            </div>
            <h4 className="pf-feature-title">Secure Payment</h4>
            <p className="pf-feature-desc">Safe & encrypted</p>
          </div>

          <div className={`pf-feature-item pf-hover-yellow ${isVisible ? 'pf-animate-up-4' : 'opacity-0'}`}>
            <div className="pf-icon-circle">
              <Star size={24} color="#eab308" className="pf-icon-inner" />
            </div>
            <h4 className="pf-feature-title">Quality Assured</h4>
            <p className="pf-feature-desc">Lab tested products</p>
          </div>

        </div>
      </div>

      {/* Bottom Section: WhatsApp Signup (Solid Green) */}
      <div className="pf-signup-section">
        {/* Animated Background Orbs */}
        <div className="pf-orb pf-orb-1"></div>
        <div className="pf-orb pf-orb-2"></div>
        <div className="pf-orb pf-orb-3"></div>

        <div className="pf-signup-content">
          <h2 className="pf-signup-title">
            <div className="pf-waving-leaf">
              <Leaf size={28} fill="#fbbf24" color="#fbbf24" />
            </div>
            STAY CONNECTED WITH NATURAL WELLNESS
          </h2>
          <p className="pf-signup-subtitle">
            Receive Herbal Tips, Product Updates, and Exclusive Offers Directly on WhatsApp
          </p>

          <form className="pf-signup-form" onSubmit={(e) => e.preventDefault()}>
            <div className="pf-input-group">
              <input 
                type="tel" 
                placeholder="Enter your WhatsApp number" 
                className="pf-whatsapp-input"
              />
              <button type="submit" className="pf-whatsapp-btn pf-shiny-btn">
                <MessageCircle size={20} className="pf-btn-icon" />
                <span>JOIN NOW ON WHATSAPP</span>
              </button>
            </div>
            
            <label className="pf-checkbox-label">
              <input type="checkbox" defaultChecked className="pf-checkbox" />
              <span className="pf-checkbox-text">I Agree to Receive WhatsApp Updates</span>
            </label>
          </form>
        </div>
      </div>

    </div>
  );
}
