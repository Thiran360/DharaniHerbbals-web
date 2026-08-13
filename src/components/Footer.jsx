import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
<<<<<<< HEAD
=======
import BrandLogoVideo from './BrandLogoVideo';
>>>>>>> master

function InstaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  );
}

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('footer-animate-active');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      const elements = footerRef.current.querySelectorAll('.footer-animate');
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer-wrapper" ref={footerRef}>
      <div className="footer-content-centered">

        {/* Logo */}
        <div className="footer-logo-box footer-animate">
<<<<<<< HEAD
            <div className="brand-text-logo footer-brand-text">
              <div className="brand-text-line1">Dharani<span className="brand-reg">®</span></div>
              <div className="brand-text-line2">Herbbals</div>
            </div>
=======
          <Link to="/" className="footer-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
            <div className="brand-text-logo footer-brand-text">
              <div className="brand-text-line1" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: '1.0' }}>Vedan Mart<span className="brand-reg">®</span></div>
              
            </div>
          </Link>
>>>>>>> master
        </div>

        {/* Mission Statement */}
        <p className="footer-editorial-mission footer-animate">
          Rooted in Ancient Siddha Wisdom, Elevated by Modern Science. Experience the Pure Potency of Nature's Finest Botanicals.
        </p>

        {/* Single Row of Links */}
        <div className="footer-inline-links footer-animate">
          <Link to="/shop">Shop All</Link>
          <span className="separator">·</span>
          <Link to="/about">Our Story</Link>
          <span className="separator">·</span>
          <Link to="/contact">Contact</Link>
          <span className="separator">·</span>
          <Link to="/policies">POLICIES</Link>
          <span className="separator">·</span>
          <Link to="#">FAQS</Link>
        </div>

        {/* Contact Info (Inline) */}
        <div className="footer-inline-contact footer-animate">
<<<<<<< HEAD
          <a href="mailto:info@dharaniherbbals.in">info@dharaniherbbals.in</a>
=======
          <a href="mailto:info@dharanimart.in">info@dharanimart.in</a>
>>>>>>> master
          <span className="separator">|</span>
          <a href="tel:+919788122001">+91 97881 22001 / +91 99655 32001</a>
        </div>

        {/* Social Icons */}
        <div className="footer-social-row footer-animate">
<<<<<<< HEAD
          <a href="https://www.instagram.com/dharani_herbbals?igsh=NG9sbTFidTdodzN2" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Instagram"><InstaIcon /></a>
          <a href="https://www.facebook.com/profile.php?id=61574767123085" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Facebook"><FbIcon /></a>
          <a href="#" className="social-icon-link" title="Twitter"><TwitterIcon /></a>
          <a href="https://youtube.com/@dharaniherbbalsppy?si=MUDYw9IQF3rEdxt9" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Youtube"><YoutubeIcon /></a>
=======
          <a href="https://www.instagram.com/dharani_mart?igsh=NG9sbTFidTdodzN2" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Instagram"><InstaIcon /></a>
          <a href="https://www.facebook.com/profile.php?id=61574767123085" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Facebook"><FbIcon /></a>
          <a href="#" className="social-icon-link" title="Twitter"><TwitterIcon /></a>
          <a href="https://youtube.com/@dharanimartppy?si=MUDYw9IQF3rEdxt9" target="_blank" rel="noopener noreferrer" className="social-icon-link" title="Youtube"><YoutubeIcon /></a>
>>>>>>> master
        </div>

      </div>
    </footer>
  );
}
