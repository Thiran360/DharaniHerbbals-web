import { useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Headphones as HeadphonesIcon, MessageCircle, ShieldCheck, User } from 'lucide-react';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

export default function Contact() {
  const { t } = useLanguage();
  const contactPhoneDisplay = '+91 97881 22001';
  const contactPhoneDial = '+919788122001';
  const whatsappNumber = '919788122001';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const subjectSelect = form.elements.subject;
    const selectedSubject = subjectSelect.options[subjectSelect.selectedIndex]?.text || formData.get('subject');

    const message = [
      'New enquiry from Dharani Herbbals website',
      '',
      `Name: ${formData.get('fullName')}`,
      `Phone: ${formData.get('phone')}`,
      `Email: ${formData.get('email')}`,
      `Subject: ${selectedSubject}`,
      '',
      `Message: ${formData.get('message')}`
    ].join('\n');

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>
            <span>{t('contactHeroTitle')}</span>
          </h1>
          <p>
            {t('contactHeroDesc')}
          </p>
        </div>
      </div>

      {/* Info Cards overlapping the hero */}
      <div className="contact-info-container">
        <div className="contact-info-grid">
          
          <div className="contact-card">
            <div className="contact-icon-circle green">
              <User size={24} color="#16a34a" />
            </div>
            <h3>Founder</h3>
            <p>
              <strong style={{ fontSize: '1.1rem', color: '#1f2937' }}>Mrs. A. Poonkodi</strong><br/>
              <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Founder & Brand Visionary</span>
            </p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon-circle green">
              <Phone size={24} color="#16a34a" />
            </div>
            <h3>{t('contactPhone')}</h3>
            <p>
              <a href="tel:+919788122001" style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>+91 97881 22001</a>
              <a href="tel:+919965532001" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>+91 99655 32001</a>
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-icon-circle blue">
              <Mail size={24} color="#2563eb" />
            </div>
            <h3>{t('contactEmail')}</h3>
            <p>info@dharaniherbbals.in</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon-circle red">
              <MapPin size={24} color="#dc2626" />
            </div>
            <h3>{t('contactAddress')}</h3>
            <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: '#4b5563' }}>
              {t('contactAddressLine1')} {t('contactAddressLine2')}<br/>
              {t('contactAddressLine3')} {t('contactAddressLine4')}<br/>
              {t('contactAddressLine5')}
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-icon-circle purple">
              <Clock size={24} color="#9333ea" />
            </div>
            <h3>{t('contactHours')}</h3>
            <p>{t('contactHoursDesc')}</p>
          </div>

        </div>
      </div>

      {/* Lower Section: Form + Sidebar */}
      <div className="contact-lower-section">
        <div className="contact-layout-grid">
          
          {/* Left Column: Form */}
          <div className="contact-form-container">
            <div className="contact-form-header">
              <h2><Send size={24} className="header-icon" /> {t('contactFormTitle')}</h2>
            </div>
            
            <div className="contact-form-body">
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('contactFullName')}</label>
                    <input type="text" name="fullName" placeholder={t('contactFullName')} autoComplete="name" required />
                  </div>
                  <div className="form-group">
                    <label>{t('contactPhoneLabel')}</label>
                    <input type="tel" name="phone" placeholder={t('contactPhoneLabel')} autoComplete="tel" required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>{t('contactEmailLabel')}</label>
                  <input type="email" name="email" placeholder={t('contactEmailLabel')} autoComplete="email" required />
                </div>
                
                <div className="form-group">
                  <label>{t('contactSubject')}</label>
                  <div className="select-wrapper">
                    <select name="subject" required defaultValue="">
                      <option value="" disabled>{t('contactSelectSubject')}</option>
                      <option value="general">{t('contactGeneralInquiry')}</option>
                      <option value="order">{t('contactOrderStatus')}</option>
                      <option value="product">{t('contactProductInfo')}</option>
                      <option value="other">{t('contactOther')}</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>{t('contactMessageLabel')}</label>
                  <textarea name="message" placeholder={t('contactMessagePlaceholder')} rows="5" required></textarea>
                </div>
                
                <button type="submit" className="btn-submit-contact">
                  <MessageCircle size={18} /> {t('contactSendBtn')}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="contact-sidebar">
            
            {/* Why Choose Us */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('contactWhyChooseUs')}</h3>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon"><HeadphonesIcon size={20} /></div>
                  <div className="feature-text">
                    <h4>{t('contactSupportTitle')}</h4>
                    <p>{t('contactSupportDesc')}</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><MessageCircle size={20} /></div>
                  <div className="feature-text">
                    <h4>{t('contactQuickResponseTitle')}</h4>
                    <p>{t('contactQuickResponseDesc')}</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><ShieldCheck size={20} /></div>
                  <div className="feature-text">
                    <h4>{t('contactExpertTitle')}</h4>
                    <p>{t('contactExpertDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Our Store */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('contactVisitStore')}</h3>
              <div className="map-container">
                <iframe 
                  src="https://maps.google.com/maps?q=11.3580361,77.166633&t=&z=17&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="250" 
                  style={{border:0, borderRadius: '12px'}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>

            {/* Follow Us */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('contactFollowUs')}</h3>
              <p className="follow-text">{t('contactFollowDesc')}</p>
              <div className="social-icons-row">
                <a href="https://www.facebook.com/share/r/1BMDikPZVT/" className="social-circle" target="_blank" rel="noopener noreferrer"><FbIcon /></a>
                <a href="https://www.instagram.com/dharani_herbbals?igsh=NG9sbTFidTdodzN2" className="social-circle" target="_blank" rel="noopener noreferrer"><InstaIcon /></a>
                <a href="https://youtube.com/@dharaniherbbalsppy?si=Ja0OqohcfBTEBJJf" className="social-circle" target="_blank" rel="noopener noreferrer"><YtIcon /></a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function FbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function InstaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function YtIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  );
}
