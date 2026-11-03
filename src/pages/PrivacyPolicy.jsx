import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Truck, RefreshCw, XCircle, FileText, Phone, 
  Mail, MapPin, Clock, CheckCircle2, AlertTriangle, ExternalLink, HelpCircle, 
  MessageCircle, Lock, Eye, Database, Cookie, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import { COMPANY_FACTS } from '../data/companyFacts';
import './PrivacyPolicy.css';

export default function PrivacyPolicy({ initialTab = 'privacy' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  // Determine active tab from prop, location search param, or path
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['privacy', 'shipping', 'refunds', 'cancellation', 'terms', 'contact'].includes(tabParam)) {
      return tabParam;
    }
    if (location.pathname.includes('shipping')) return 'shipping';
    if (location.pathname.includes('refund') || location.pathname.includes('return')) return 'refunds';
    if (location.pathname.includes('cancellation')) return 'cancellation';
    if (location.pathname.includes('terms')) return 'terms';
    if (location.pathname.includes('contact')) return 'contact';
    return initialTab || 'privacy';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl);

  useEffect(() => {
    const tab = getTabFromUrl();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search, initialTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/policies?tab=${tabId}`, { replace: true });
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const policyTitles = {
    privacy: 'Privacy Policy | Dharani Herbals',
    shipping: 'Shipping & Delivery Policy | Dharani Herbals',
    refunds: 'Refund & Returns Policy | Dharani Herbals',
    cancellation: 'Order Cancellation Policy | Dharani Herbals',
    terms: 'Terms of Service | Dharani Herbals'
  };
  const activeTitle = policyTitles[activeTab] || 'Policies & Legal | Dharani Herbals';
  const canonicalUrl = `https://www.dharaniherbbals.in/${activeTab === 'privacy' ? 'privacy' : (activeTab === 'refunds' ? 'refund' : activeTab)}`;

  return (
    <div className="privacy-policy-page">
      <SeoHead
        title={activeTitle}
        description="Official Dharani Herbals policies regarding customer privacy, pan-India delivery, order cancellations, and hassle-free returns."
        canonicalUrl={canonicalUrl}
        openGraph={{
          title: activeTitle,
          description: "Official Dharani Herbals policies regarding customer privacy, pan-India delivery, order cancellations, and hassle-free returns.",
          url: canonicalUrl,
          image: "https://www.dharaniherbbals.in/logo.png",
          type: "website"
        }}
      />
      {/* Header Banner */}
      <div className="privacy-policy-header">
        <div className="policy-header-inner">
          <Link to="/" className="policy-back-btn">
            <ArrowLeft size={18} />
            <span>{isTamil ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'}</span>
          </Link>

          <div className="policy-header-badge">
            <ShieldCheck size={16} />
            <span>{isTamil ? 'உறுதிப்படுத்தப்பட்ட விதிமுறைகள்' : 'Verified Policies & Timelines'}</span>
          </div>

          <h1>{isTamil ? 'உதவி மற்றும் கொள்கை வழிகாட்டி' : 'Help & Policies Center'}</h1>
          <p className="effective-date">
            {isTamil 
              ? 'வெளிப்படையான ஷிப்பிங், ரீபண்ட் மற்றும் ரகசியத்தன்மைக் கொள்கைகள் • அமலுக்கு வரும் தேதி: ஜூலை 11, 2026'
              : 'Transparent Shipping, Refund & Privacy Information • Effective Date: July 11, 2026'}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="policy-hub-container">
        {/* Navigation Tabs Bar */}
        <div className="policy-tabs-nav" role="tablist">
          <button 
            className={`policy-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => handleTabChange('privacy')}
            role="tab"
            aria-selected={activeTab === 'privacy'}
          >
            <Lock size={17} />
            <span>{isTamil ? 'ரகசியத்தன்மை (Privacy)' : 'Privacy Policy'}</span>
          </button>

          <button 
            className={`policy-tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => handleTabChange('shipping')}
            role="tab"
            aria-selected={activeTab === 'shipping'}
          >
            <Truck size={17} />
            <span>{isTamil ? 'ஷிப்பிங் & டெலிவரி' : 'Shipping & Delivery'}</span>
          </button>

          <button 
            className={`policy-tab-btn ${activeTab === 'refunds' ? 'active' : ''}`}
            onClick={() => handleTabChange('refunds')}
            role="tab"
            aria-selected={activeTab === 'refunds'}
          >
            <RefreshCw size={17} />
            <span>{isTamil ? 'திருப்புதல் & ரீபண்ட்' : 'Return & Refund'}</span>
          </button>

          <button 
            className={`policy-tab-btn ${activeTab === 'cancellation' ? 'active' : ''}`}
            onClick={() => handleTabChange('cancellation')}
            role="tab"
            aria-selected={activeTab === 'cancellation'}
          >
            <XCircle size={17} />
            <span>{isTamil ? 'ஆர்டர் ரத்து' : 'Cancellation'}</span>
          </button>

          <button 
            className={`policy-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => handleTabChange('terms')}
            role="tab"
            aria-selected={activeTab === 'terms'}
          >
            <FileText size={17} />
            <span>{isTamil ? 'விதிமுறைகள் (Terms)' : 'Terms of Service'}</span>
          </button>

          <button 
            className={`policy-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => handleTabChange('contact')}
            role="tab"
            aria-selected={activeTab === 'contact'}
          >
            <Phone size={17} />
            <span>{isTamil ? 'தொடர்பு விவரங்கள்' : 'Contact Us'}</span>
          </button>

          <Link to="/faqs" className="policy-tab-btn faq-quicklink">
            <HelpCircle size={17} />
            <span>{isTamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ) ↗' : 'View FAQs ↗'}</span>
          </Link>
        </div>

        {/* Highlighted Timelines Strip */}
        <div className="policy-timelines-card">
          <div className="timeline-item">
            <div className="timeline-icon-box dispatch">
              <Clock size={20} />
            </div>
            <div className="timeline-text">
              <span className="timeline-label">{isTamil ? 'கிடங்கு அனுப்புதல்' : 'Dispatch Time'}</span>
              <strong className="timeline-value">1–2 {isTamil ? 'வேலை நாட்கள்' : 'Business Days'}</strong>
              <span className="timeline-sub">{isTamil ? 'ஆர்டர் உறுதி செய்யப்பட்டதும்' : 'Fast processing'}</span>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon-box delivery">
              <Truck size={20} />
            </div>
            <div className="timeline-text">
              <span className="timeline-label">{isTamil ? 'டெலிவரி காலம்' : 'Delivery Timeline'}</span>
              <strong className="timeline-value">2–3 {isTamil ? 'நாட்கள் (TN) / 3–7 நாட்கள் (இந்தியா)' : 'Days (TN) / 3–7 Days (India)'}</strong>
              <span className="timeline-sub">{isTamil ? 'நேரடி SMS டிராக்கிங் வசதியுடன்' : 'With live SMS tracking'}</span>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon-box notify">
              <AlertTriangle size={20} />
            </div>
            <div className="timeline-text">
              <span className="timeline-label">{isTamil ? 'சேதம் / தவறு தகவல்' : 'Damage Notice'}</span>
              <strong className="timeline-value">{isTamil ? '48 மணி நேரத்திற்குள்' : 'Within 48 Hours'}</strong>
              <span className="timeline-sub">{isTamil ? 'புகைப்படத்துடன் தெரிவிக்கவும்' : 'With clear item photos'}</span>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon-box refund">
              <RefreshCw size={20} />
            </div>
            <div className="timeline-text">
              <span className="timeline-label">{isTamil ? 'ரீபண்ட் வரவு' : 'Refund Processing'}</span>
              <strong className="timeline-value">7–10 {isTamil ? 'வேலை நாட்கள்' : 'Business Days'}</strong>
              <span className="timeline-sub">{isTamil ? 'வங்கி கணக்கில் வரவு வைக்கப்படும்' : 'Direct to original payment'}</span>
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="policy-tab-content-area">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="tab-pane active" id="tab-privacy">
              <div className="section-header-row">
                <div>
                  <h2>{isTamil ? 'தாரணி ஹெர்பல்ஸ் ரகசியத்தன்மைக் கொள்கை' : 'Dharani Herbbals Privacy Policy'}</h2>
                  <p className="section-subtext">
                    {isTamil 
                      ? 'உங்கள் தனிப்பட்ட தகவல்கள் இந்திய டிஜிட்டல் தனிநபர் தரவு பாதுகாப்பு சட்டம் 2023-ன் படி 100% பாதுகாப்பாக நிர்வகிக்கப்படுகிறது.'
                      : 'We are committed to safeguarding your personal information in strict compliance with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.'}
                  </p>
                </div>
              </div>

              {/* Card 1: About Us */}
              <div className="policy-card">
                <div className="policy-card-header">
                  <div className="card-badge-num">01</div>
                  <h3>{isTamil ? 'தாரணி ஹெர்பல்ஸ் பற்றி' : '1. About Dharani Herbbals'}</h3>
                </div>
                <p>
                  {isTamil
                    ? 'தாரணி ஹெர்பல்ஸில், உங்கள் தனியுரிமையை நாங்கள் பெரிதும் மதிக்கிறோம். நீங்கள் எங்கள் வலைத்தளத்தைப் பார்வையிடும்போது அல்லது மூலிகை தயாரிப்புகளை வாங்கும் போது உங்கள் தரவை நாங்கள் எவ்வாறு சேகரிக்கிறோம், பயன்படுத்துகிறோம் மற்றும் பாதுகாக்கிறோம் என்பதை இந்தக் கொள்கை விளக்குகிறது.'
                    : 'At Dharani Herbbals, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website (https://www.dharaniherbbals.in) or make a purchase.'}
                </p>
              </div>

              {/* Card 2: Information We Collect */}
              <div className="policy-card">
                <div className="policy-card-header">
                  <div className="card-badge-num">02</div>
                  <h3>{isTamil ? 'நாங்கள் சேகரிக்கும் தகவல்கள்' : '2. Information We Collect'}</h3>
                </div>
                <p>{isTamil ? 'எங்கள் சேவைகளை நீங்கள் பயன்படுத்தும்போது பின்வரும் விபரங்களை சேகரிக்கலாம்:' : 'We may collect the following details when you use our website or services:'}</p>

                <div className="policy-info-grid">
                  <div className="info-box">
                    <h4><Eye size={16} /> {isTamil ? 'தனிப்பட்ட தகவல்கள்' : 'A. Personal Information'}</h4>
                    <ul>
                      <li>{isTamil ? 'முழு பெயர்' : 'Full Name'}</li>
                      <li>{isTamil ? 'மொபைல் எண் மற்றும் மின்னஞ்சல்' : 'Mobile Number & Email Address'}</li>
                      <li>{isTamil ? 'டெலிவரி முகவரி மற்றும் பின்கோடு' : 'Shipping Address, State & PIN Code'}</li>
                      <li>{isTamil ? 'பயனர் கணக்கு விபரங்கள்' : 'User Account Credentials (optional)'}</li>
                    </ul>
                  </div>

                  <div className="info-box">
                    <h4><Truck size={16} /> {isTamil ? 'ஆர்டர் & பரிவர்த்தனை விபரம்' : 'B. Order & Payment Info'}</h4>
                    <ul>
                      <li>{isTamil ? 'ஆர்டர் செய்யப்பட்ட மூலிகைப் பொருட்கள்' : 'Purchased Products & Variations'}</li>
                      <li>{isTamil ? 'பரிவர்த்தனை குறிப்பு எண்' : 'Transaction Reference Numbers'}</li>
                      <li>{isTamil ? 'பணம் செலுத்திய நிலை (Paid/COD)' : 'Payment Status & Delivery Method'}</li>
                      <li><em>{isTamil ? 'கார்டு விபரங்கள் பாதுகாப்பான கேட்வே வழியாகவே செயல்படுத்தப்படுகிறது' : 'Card numbers are NEVER stored on our servers'}</em></li>
                    </ul>
                  </div>

                  <div className="info-box">
                    <h4><Database size={16} /> {isTamil ? 'தொழில்நுட்ப விபரங்கள்' : 'C. Technical Information'}</h4>
                    <ul>
                      <li>{isTamil ? 'IP முகவரி & உலாவி வகை (Browser)' : 'IP Address & Browser Type'}</li>
                      <li>{isTamil ? 'சாதன வகை (Mobile / Desktop)' : 'Device Type & Operating System'}</li>
                      <li>{isTamil ? 'பார்வையிட்ட தேதி மற்றும் நேரம்' : 'Date, Time & Navigation Logs'}</li>
                    </ul>
                  </div>

                  <div className="info-box">
                    <h4><Cookie size={16} /> {isTamil ? 'வலைத்தள பயன்பாடு' : 'D. Usage & Cookies'}</h4>
                    <ul>
                      <li>{isTamil ? 'பார்வையிட்ட தயாரிப்புகள் & தேடல் விபரம்' : 'Products Viewed & Search History'}</li>
                      <li>{isTamil ? 'ஷாப்பிங் கார்ட் & விஷ்லிஸ்ட் சேமிப்பு' : 'Shopping Cart & Wishlist Storage'}</li>
                      <li>{isTamil ? 'வாடிக்கையாளர் ஆதரவு கோரிக்கைகள்' : 'Customer Support & Chat History'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 3: Use of Information */}
              <div className="policy-card">
                <div className="policy-card-header">
                  <div className="card-badge-num">03</div>
                  <h3>{isTamil ? 'தகவல் பயன்பாடு' : '3. Use of Information'}</h3>
                </div>
                <p>{isTamil ? 'சேகரிக்கப்பட்ட தகவல்கள் பின்வரும் நன்மைகளுக்காக மட்டுமே பயன்படுத்தப்படுகின்றன:' : 'The information collected is strictly used to:'}</p>
                <ul className="check-list">
                  <li><CheckCircle2 size={16} className="icon-check" /> {isTamil ? 'உங்கள் மூலிகை தயாரிப்பு ஆர்டர்களை பேக்கிங் செய்து உரிய நேரத்தில் டெலிவரி செய்தல்.' : 'Process, package, and deliver your orders on time.'}</li>
                  <li><CheckCircle2 size={16} className="icon-check" /> {isTamil ? 'பாதுகாப்பான பரிவர்த்தனைகள் மற்றும் பேமெண்ட்களை சரிபார்த்தல்.' : 'Verify payments and transactions securely.'}</li>
                  <li><CheckCircle2 size={16} className="icon-check" /> {isTamil ? 'SMS மற்றும் மின்னஞ்சல் மூலம் இன்வாய்ஸ், டிராக்கிங் இணைப்புகளை அனுப்புதல்.' : 'Send order confirmations, invoices, and live tracking updates via SMS & Email.'}</li>
                  <li><CheckCircle2 size={16} className="icon-check" /> {isTamil ? 'வாடிக்கையாளர் சேவையை மேம்படுத்துதல் மற்றும் தேவைகளுக்கு பதிலளித்தல்.' : 'Provide responsive customer support and resolve product queries.'}</li>
                  <li><CheckCircle2 size={16} className="icon-check" /> {isTamil ? 'போலி மற்றும் மோசடி நடவடிக்கைகளைத் தடுத்தல்.' : 'Detect, prevent, and investigate fraudulent or unauthorized activities.'}</li>
                  <li><CheckCircle2 size={16} className="icon-check" /> {isTamil ? 'இந்திய வரி மற்றும் சட்ட விதிமுறைகளுக்கு இணங்குதல்.' : 'Comply with legal, regulatory, GST, and accounting obligations in India.'}</li>
                </ul>
              </div>

              {/* Card 4: Third-Party & Security */}
              <div className="policy-card">
                <div className="policy-card-header">
                  <div className="card-badge-num">04</div>
                  <h3>{isTamil ? 'மூன்றாம் தரப்பு பகிர்வு & பாதுகாப்பு' : '4. Third-Party Sharing & Security'}</h3>
                </div>
                <div className="callout-box success">
                  <strong>{isTamil ? 'எங்கள் உறுதிமொழி:' : 'Our Strict Guarantee:'}</strong>{' '}
                  {isTamil 
                    ? 'தாரணி ஹெர்பல்ஸ் உங்கள் தனிப்பட்ட தரவுகளை எந்தவொரு காரணத்திற்காகவும் விற்பனை செய்வதோ, வாடகைக்கு விடுவதோ கிடையாது.'
                    : 'Dharani Herbbals does NOT sell, rent, or trade your personal information with anyone under any circumstances.'}
                </div>
                <p>{isTamil ? 'உங்கள் ஆர்டரை நிறைவேற்ற தேவையான நம்பகமான கூட்டாளர்களுடன் மட்டுமே விபரங்கள் பகிரப்படும்:' : 'Data is shared only with trusted operational partners strictly necessary to fulfill your order:'}</p>
                <ul>
                  <li>{isTamil ? 'அங்கீகரிக்கப்பட்ட பேமெண்ட் கேட்வே (Razorpay / Cashfree)' : 'Authorized Payment Gateways (Razorpay / Cashfree)'}</li>
                  <li>{isTamil ? 'கொரியர் மற்றும் லாஜிஸ்டிக்ஸ் கூட்டாளர்கள் (DTDC, Professional Couriers, India Post)' : 'Courier & Logistics Partners (DTDC, Professional Couriers, India Post)'}</li>
                  <li>{isTamil ? 'பாதுகாப்பான கிளவுட் ஹோஸ்டிங் & எஸ்.எம்.எஸ் கேட்வே' : 'Secure Cloud Infrastructure & Transactional SMS Providers'}</li>
                </ul>
              </div>

              {/* Card 5: User Rights */}
              <div className="policy-card">
                <div className="policy-card-header">
                  <div className="card-badge-num">05</div>
                  <h3>{isTamil ? 'பயனர் உரிமைகள் & கட்டுப்பாடுகள்' : '5. Your Rights & Data Retention'}</h3>
                </div>
                <p>{isTamil ? 'இந்திய சட்ட விதிகளின்படி உங்களுக்கு உள்ள உரிமைகள்:' : 'Under Indian data protection laws, you retain the full right to:'}</p>
                <ul>
                  <li>{isTamil ? 'உங்கள் சுயவிவர விபரங்களைப் பார்வையிடுதல் மற்றும் புதுப்பித்தல்.' : 'Access and review your stored personal information.'}</li>
                  <li>{isTamil ? 'தவறான முகவரி அல்லது மொபைல் எண்ணை திருத்தம் செய்தல்.' : 'Request corrections to any inaccurate contact details or address.'}</li>
                  <li>{isTamil ? 'விளம்பர செய்திகளைப் பெறுவதில் இருந்து விலகுதல் (Opt-out).' : 'Withdraw consent for promotional communications anytime.'}</li>
                  <li>{isTamil ? 'விபரங்களை நீக்கக் கோருதல் (சட்ட கடமைகளுக்கு உட்பட்டு).' : 'Request deletion of your data subject to statutory tax retention guidelines.'}</li>
                </ul>
                <div className="law-tag">
                  {isTamil ? 'சட்ட வரம்பு: தமிழ்நாடு மாநில நீதிமன்றங்கள், இந்தியா' : 'Governing Law: Jurisdiction of Tamil Nadu, India (DPDP Act, 2023)'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHIPPING & DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="tab-pane active" id="tab-shipping">
              <div className="section-header-row">
                <div>
                  <h2>{isTamil ? 'ஷிப்பிங் மற்றும் டெலிவரி கொள்கை' : 'Shipping & Delivery Policy'}</h2>
                  <p className="section-subtext">
                    {isTamil 
                      ? 'அனைத்து மூலிகைப் பொருட்களும் தரமான பேக்கிங் செய்யப்பட்டு சரியான நேரத்தில் உங்கள் இல்லம் வந்து சேரும்.'
                      : 'Authentic Siddha & herbal preparations packed with utmost care and delivered reliably across India.'}
                  </p>
                </div>
              </div>

              {/* Shipping Timeline Steps */}
              <div className="policy-card highlight-card">
                <div className="policy-card-header">
                  <Truck size={22} className="card-header-icon" />
                  <h3>{isTamil ? 'டெலிவரி வழிமுறைகள் & கால அவகாசம்' : 'Delivery Workflow & Timelines'}</h3>
                </div>

                <div className="workflow-steps">
                  <div className="workflow-step">
                    <div className="step-circle">1</div>
                    <h4>{isTamil ? 'ஆர்டர் உறுதி' : 'Order Placed'}</h4>
                    <p>{isTamil ? 'உடனடி SMS மற்றும் உறுதிப்படுத்தும் மின்னஞ்சல்.' : 'Instant SMS & email notification.'}</p>
                  </div>
                  <div className="workflow-arrow"><ChevronRight size={20} /></div>
                  <div className="workflow-step">
                    <div className="step-circle highlight">2</div>
                    <h4>{isTamil ? 'கிடங்கு அனுப்புதல்' : '1–2 Days Dispatch'}</h4>
                    <p>{isTamil ? '1-2 வேலை நாட்களில் பேக்கிங் செய்யப்பட்டு கொரியரிடம் ஒப்படைக்கப்படும்.' : 'Packed securely & handed over to courier.'}</p>
                  </div>
                  <div className="workflow-arrow"><ChevronRight size={20} /></div>
                  <div className="workflow-step">
                    <div className="step-circle highlight">3</div>
                    <h4>{isTamil ? 'டெலிவரி' : 'Doorstep Delivery'}</h4>
                    <p>{isTamil ? 'தமிழ்நாடு: 2–3 நாட்கள் | பிற மாநிலங்கள்: 3–7 நாட்கள்.' : 'Tamil Nadu: 2–3 Days | Rest of India: 3–7 Days.'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Details Cards */}
              <div className="policy-card">
                <div className="policy-card-header">
                  <Clock size={20} className="card-header-icon" />
                  <h3>{isTamil ? 'முக்கிய ஷிப்பிங் விதிமுறைகள்' : 'Key Shipping Guidelines'}</h3>
                </div>
                <ul className="guidelines-list">
                  <li>
                    <strong>{isTamil ? 'அனுப்பும் காலம் (Processing Time):' : 'Order Processing Time:'}</strong>{' '}
                    {isTamil 
                      ? 'ஞாயிறு மற்றும் அரசு விடுமுறை நாட்களைத் தவிர்த்து, ஆர்டர் உறுதி செய்யப்பட்ட 1 முதல் 2 வேலை நாட்களுக்குள் அனைத்துப் பார்சல்களும் அனுப்பப்படுகின்றன.'
                      : 'All orders are processed and dispatched within 1 to 2 business days (excluding Sundays and national public holidays) after receiving order confirmation.'}
                  </li>
                  <li>
                    <strong>{isTamil ? 'டெலிவரி காலம் (Delivery Timeline):' : 'Delivery Timeline:'}</strong>{' '}
                    {isTamil 
                      ? 'தமிழ்நாடு மற்றும் தென்னிந்தியப் பகுதிகளுக்கு அனுப்பப்பட்ட தேதியிலிருந்து 2 முதல் 3 வேலை நாட்களிலும், இந்தியாவின் பிற பகுதிகளுக்கு 3 முதல் 7 வேலை நாட்களிலும் டெலிவரி செய்யப்படுகிறது.'
                      : 'Depending on your destination in India, delivery usually takes 2 to 3 business days for Tamil Nadu / South India, and 3 to 7 business days for other states from the date of dispatch.'}
                  </li>
                  <li>
                    <strong>{isTamil ? 'ஷிப்பிங் கட்டணம் (Shipping Charges):' : 'Shipping Charges:'}</strong>{' '}
                    {isTamil 
                      ? 'ஆர்டர் செய்யும் போது செக்அவுட் பக்கத்தில் ஷிப்பிங் கட்டணம் வெளிப்படையாகக் காட்டப்படும்.'
                      : 'Shipping charges for your order are calculated transparently and clearly shown during checkout before payment.'}
                  </li>
                  <li>
                    <strong>{isTamil ? 'நேரடி டிராக்கிங் (Live Order Tracking):' : 'Live Order Tracking:'}</strong>{' '}
                    {isTamil 
                      ? 'பார்சல் அனுப்பப்பட்டவுடன், உங்கள் கைபேசி எண் மற்றும் மின்னஞ்சலுக்கு டிராக்கிங் எண் அனுப்பப்படும். எங்கள் Track Order பக்கத்திலும் நிலையை அறிந்து கொள்ளலாம்.'
                      : 'Once dispatched, you will receive an SMS and email with your AWB tracking number and link. You can also track your shipment live on our Track Order page.'}
                  </li>
                  <li>
                    <strong>{isTamil ? 'கொரியர் கூட்டாளர்கள் (Logistics Partners):' : 'Courier Partners:'}</strong>{' '}
                    {isTamil 
                      ? 'DTDC, Professional Couriers, மற்றும் India Post மூலம் பாதுகாப்பாக விநியோகம் செய்யப்படுகிறது.'
                      : 'We ship through trusted partners such as DTDC, Professional Couriers, and India Post for reliable pan-India delivery.'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: RETURNS & REFUNDS */}
          {activeTab === 'refunds' && (
            <div className="tab-pane active" id="tab-refunds">
              <div className="section-header-row">
                <div>
                  <h2>{isTamil ? 'பொருட்கள் திருப்புதல் & ரீபண்ட் கொள்கை' : 'Return & Refund Policy'}</h2>
                  <p className="section-subtext">
                    {isTamil 
                      ? 'வாடிக்கையாளர் திருப்தியே எங்களின் முதல் நோக்கம். சேதமடைந்த அல்லது தவறான பொருட்களுக்கு எளிதான ரீபண்ட் வசதி.'
                      : 'Customer satisfaction is our highest priority. Honest, straightforward refund and replacement support.'}
                  </p>
                </div>
              </div>

              {/* 48-Hour Alert Box */}
              <div className="callout-box alert">
                <AlertTriangle size={24} className="callout-icon" />
                <div>
                  <h4>{isTamil ? '48 மணி நேர அறிவிப்பு காலக்கெடு' : 'Important 48-Hour Notification Window'}</h4>
                  <p>
                    {isTamil 
                      ? 'நீங்கள் பெற்ற பொருள் சேதமடைந்திருந்தாலோ அல்லது தவறாக இருந்தாலோ, டெலிவரி செய்யப்பட்ட 48 மணி நேரத்திற்குள் புகைப்படம் அல்லது அன்பாக்சிங் வீடியோவுடன் எங்களை தொடர்பு கொள்ள வேண்டும்.'
                      : 'If you receive a damaged, defective, expired, or incorrect product, you must notify our support team within 48 hours of delivery with clear photographs or unboxing video.'}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Return Process */}
              <div className="policy-card">
                <div className="policy-card-header">
                  <RefreshCw size={20} className="card-header-icon" />
                  <h3>{isTamil ? 'ரீபண்ட் பெறும் எளிய 3 படிகள்' : 'Simple 3-Step Refund Process'}</h3>
                </div>

                <div className="steps-container">
                  <div className="step-card">
                    <div className="step-num">Step 1</div>
                    <h4>{isTamil ? 'புகைப்படம் எடுக்கவும்' : 'Take Clear Photos'}</h4>
                    <p>{isTamil ? 'சேதமடைந்த பொருள் மற்றும் பார்சல் லேபிளை தெளிவாக படம் எடுக்கவும்.' : 'Capture clear photos of the damaged product and parcel label within 48 hours.'}</p>
                  </div>

                  <div className="step-card">
                    <div className="step-num">Step 2</div>
                    <h4>{isTamil ? 'தொடர்பு கொள்ளவும்' : 'Send via WhatsApp'}</h4>
                    <p>
                      {isTamil 
                        ? 'உங்கள் ஆர்டர் எண்ணுடன் வாட்ஸ்அப் (+91 97881 22001) அல்லது info@dharaniherbbals.in மின்னஞ்சலுக்கு அனுப்பவும்.'
                        : 'Send photos with your Order ID to WhatsApp (+91 97881 22001) or email info@dharaniherbbals.in.'}
                    </p>
                  </div>

                  <div className="step-card">
                    <div className="step-num">Step 3</div>
                    <h4>{isTamil ? 'ரீபண்ட் அல்லது மாற்று பொருள்' : 'Instant Resolution'}</h4>
                    <p>
                      {isTamil 
                        ? 'சரிபார்ப்புக்குப் பின் 7–10 வேலை நாட்களில் உங்கள் வங்கி கணக்கில் முழு தொகை வரவு வைக்கப்படும்.'
                        : 'Once verified, full refund is credited to your original payment source within 7–10 business days.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Eligibility Matrix */}
              <div className="policy-card">
                <div className="policy-card-header">
                  <CheckCircle2 size={20} className="card-header-icon" />
                  <h3>{isTamil ? 'ரீபண்ட் தகுதி விதிமுறைகள்' : 'Refund & Return Eligibility'}</h3>
                </div>

                <div className="eligibility-grid">
                  <div className="eligibility-col eligible">
                    <h4>✔ {isTamil ? 'ரீபண்ட் வழங்கப்படும் நிகழ்வுகள்' : 'Eligible for Refund / Replacement'}</h4>
                    <ul>
                      <li>{isTamil ? 'கொரியரில் சேதமடைந்து அல்லது கசிந்து வந்த பொருட்கள்.' : 'Items damaged, cracked, or leaked during transit.'}</li>
                      <li>{isTamil ? 'காலாவதியான அல்லது தவறாக அனுப்பப்பட்ட பொருட்கள்.' : 'Expired or incorrect products sent by mistake.'}</li>
                      <li>{isTamil ? 'பேக்கிங் சீல் பிரிக்கப்படாத, பயன்படுத்தப்படாத பொருட்கள்.' : 'Unopened, seal-intact items reported within return window.'}</li>
                    </ul>
                  </div>

                  <div className="eligibility-col not-eligible">
                    <h4>✖ {isTamil ? 'ரீபண்ட் வழங்கப்படாத நிகழ்வுகள்' : 'Not Eligible for Refund'}</h4>
                    <ul>
                      <li>{isTamil ? 'சீல் பிரிக்கப்பட்ட, பயன்படுத்தப்பட்ட மூலிகை மற்றும் அழகு சாதனப் பொருட்கள்.' : 'Products that have been unsealed, opened, or used (due to hygiene safety).'}</li>
                      <li>{isTamil ? 'தவறான முறையில் சேமித்து வைப்பதால் ஏற்படும் சேதங்கள்.' : 'Damages caused by improper storage, moisture, or customer handling.'}</li>
                      <li>{isTamil ? 'டெலிவரி முடிந்து 48 மணி நேரத்திற்குப் பின் தெரிவிக்கப்படும் புகார்கள்.' : 'Issues reported after the 48-hour delivery notification window.'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CANCELLATION */}
          {activeTab === 'cancellation' && (
            <div className="tab-pane active" id="tab-cancellation">
              <div className="section-header-row">
                <div>
                  <h2>{isTamil ? 'ஆர்டர் ரத்து கொள்கை' : 'Order Cancellation Policy'}</h2>
                  <p className="section-subtext">
                    {isTamil 
                      ? 'ஆர்டர் செய்த பிறகு ஏதேனும் மாற்றம் செய்ய விரும்பினால் எளிதாக ரத்து செய்யலாம்.'
                      : 'Hassle-free cancellation options before your order leaves our herbal processing center.'}
                  </p>
                </div>
              </div>

              <div className="policy-card">
                <div className="policy-card-header">
                  <XCircle size={20} className="card-header-icon" />
                  <h3>{isTamil ? 'ரத்து செய்வதற்கான வழிகாட்டுதல்கள்' : 'Cancellation Guidelines'}</h3>
                </div>

                <div className="cancellation-boxes">
                  <div className="cancel-box approved">
                    <h4>{isTamil ? 'அனுப்பப்படுவதற்கு முன் (Before Dispatch)' : 'Before Dispatch: 100% Free Cancellation'}</h4>
                    <p>
                      {isTamil 
                        ? 'உங்கள் ஆர்டர் கிடங்கில் இருந்து அனுப்பப்படுவதற்கு முன் எப்போது வேண்டுமானாலும் கட்டணமின்றி ரத்து செய்யலாம். உடனடியாக எங்களை வாட்ஸ்அப் அல்லது தொலைபேசி மூலம் தொடர்பு கொள்ளவும். நீங்கள் ஏற்கனவே செலுத்திய தொகை 5–7 வேலை நாட்களில் முழுமையாக உங்கள் வங்கிக் கணக்கிற்குத் திருப்பி அனுப்பப்படும்.'
                        : 'You can cancel your order free of charge at any time before it has been dispatched from our facility. Please notify us immediately via WhatsApp or call at +91 97881 22001. If prepaid, a 100% full refund will be initiated to your original payment method within 5–7 business days.'}
                    </p>
                  </div>

                  <div className="cancel-box warning">
                    <h4>{isTamil ? 'அனுப்பப்பட்ட பிறகு (After Dispatch)' : 'After Dispatch: In Transit'}</h4>
                    <p>
                      {isTamil 
                        ? 'பார்சல் கொரியரிடம் ஒப்படைக்கப்பட்ட பிறகு வழியில் ரத்து செய்ய இயலாது. பார்சலை டெலிவரி செய்யும் போது பெற்றுக் கொண்ட பின் எங்களின் ரீபண்ட் கொள்கைப்படி திரும்ப அனுப்பலாம்.'
                        : 'Once an order has been dispatched or handed over to our courier partner, it cannot be cancelled in transit. You may refer to our Return & Refund Policy upon receiving the package.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="tab-pane active" id="tab-terms">
              <div className="section-header-row">
                <div>
                  <h2>{isTamil ? 'பயன்பாட்டு விதிமுறைகள் மற்றும் நிபந்தனைகள்' : 'Terms of Service'}</h2>
                  <p className="section-subtext">
                    {isTamil 
                      ? 'எங்கள் சேவைகளைப் பயன்படுத்துவதன் மூலம் இந்த விதிமுறைகளுக்கு உடன்படுகிறீர்கள்.'
                      : 'By accessing and ordering from Dharani Herbbals, you agree to comply with our verified terms.'}
                  </p>
                </div>
              </div>

              <div className="policy-card">
                <div className="policy-card-header">
                  <FileText size={20} className="card-header-icon" />
                  <h3>{isTamil ? 'பொதுவான விதிமுறைகள்' : 'Standard Terms & Conditions'}</h3>
                </div>

                <ul className="guidelines-list">
                  <li>
                    <strong>{isTamil ? 'இயற்கை மூலிகை மாறுபாடுகள்:' : 'Natural Botanical Variation:'}</strong>{' '}
                    {isTamil 
                      ? 'எங்களின் தயாரிப்புகள் அனைத்தும் தூய இயற்கை மூலிகைகளால் ஆனவை. பருவகால விளைச்சலுக்கு ஏற்ப நிறம், மணம் ஆகியவற்றில் சிறிய இயற்கை மாறுபாடுகள் இருக்கலாம்; ஆனால் தரம் மற்றும் செயல்திறன் எப்போதும் மாறாது.'
                      : 'Our products are crafted using authentic natural herbs and botanical oils. Minor variations in aroma, color, or texture may occur between natural batches without compromising efficacy or purity.'}
                  </li>
                  <li>
                    <strong>{isTamil ? 'விலை மற்றும் வரி:' : 'Pricing & Taxes:'}</strong>{' '}
                    {isTamil 
                      ? 'வலைத்தளத்தில் உள்ள அனைத்து விலைகளும் இந்திய ரூபாயில் (INR) குறிப்பிடப்பட்டு உரிய வரிகள் சேர்க்கப்பட்டவை.'
                      : 'All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. Shipping fees are specified at checkout.'}
                  </li>
                  <li>
                    <strong>{isTamil ? 'ஆர்டர் உறுதிப்படுத்தல்:' : 'Order Confirmation:'}</strong>{' '}
                    {isTamil 
                      ? 'பொருட்கள் இருப்பைப் பொறுத்து ஆர்டர்கள் உறுதி செய்யப்படும். ஏதேனும் எதிர்பாராத இருப்புக் குறைவு ஏற்பட்டால் உடனடியாக வாடிக்கையாளருக்கு தெரிவிக்கப்பட்டு மாற்று அல்லது முழு ரீபண்ட் வழங்கப்படும்.'
                      : 'All orders are subject to product availability. In the rare event an item is out of stock, we notify customers immediately and issue a full refund.'}
                  </li>
                  <li>
                    <strong>{isTamil ? 'அறிவுசார் சொத்துரிமை:' : 'Intellectual Property:'}</strong>{' '}
                    {isTamil 
                      ? 'தாரணி ஹெர்பல்ஸ் இணையதளத்தில் உள்ள படங்கள், லோகோ, தயாரிப்பு பெயர்கள் மற்றும் விளக்கங்கள் அனைத்தும் சட்டப்படி பாதுகாக்கப்பட்டவை.'
                      : 'All website text, images, logos, graphics, and trademarks are the exclusive property of Dharani Herbbals and may not be reproduced without prior consent.'}
                  </li>
                  <li>
                    <strong>{isTamil ? 'சட்ட வரம்பு:' : 'Governing Law:'}</strong>{' '}
                    {isTamil 
                      ? 'அனைத்து விவகாரங்களும் இந்திய சட்டங்களுக்கும், தமிழ்நாடு மாநில நீதிமன்ற வரம்பிற்கும் உட்பட்டவை.'
                      : 'These terms are governed by the laws of India and subject to the exclusive jurisdiction of the courts of Tamil Nadu, India.'}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT & LEGAL */}
          {activeTab === 'contact' && (
            <div className="tab-pane active" id="tab-contact">
              <div className="section-header-row">
                <div>
                  <h2>{isTamil ? 'தொடர்பு மற்றும் பதிவு அலுவலக முகவரி' : 'Contact Us & Legal Information'}</h2>
                  <p className="section-subtext">
                    {isTamil 
                      ? 'ஏதேனும் கேள்விகள், சந்தேகங்கள் அல்லது உதவிகளுக்கு எங்களை எப்போது வேண்டுமானாலும் தொடர்பு கொள்ளலாம்.'
                      : 'Our support team is here to assist you with order queries, returns, and wholesale assistance.'}
                  </p>
                </div>
              </div>

              <div className="contact-hub-grid">
                <div className="contact-hub-card">
                  <div className="contact-hub-icon"><MapPin size={24} /></div>
                  <h3>{isTamil ? 'பதிவு செய்யப்பட்ட தலைமை அலுவலகம்' : 'Registered Office'}</h3>
                  <p><strong>{COMPANY_FACTS.brandName}</strong></p>
                  <p>{isTamil ? COMPANY_FACTS.address.fullFormattedTa : COMPANY_FACTS.address.fullFormattedEn}</p>
                  <p className="founder-note">{isTamil ? 'நிறுவனர்:' : 'Founder:'} <strong>{COMPANY_FACTS.founder}</strong></p>
                </div>

                <div className="contact-hub-card">
                  <div className="contact-hub-icon"><Phone size={24} /></div>
                  <h3>{isTamil ? 'தொலைபேசி & வாட்ஸ்அப்' : 'Phone & WhatsApp'}</h3>
                  <p>{isTamil ? `வாடிக்கையாளர் உதவி (${COMPANY_FACTS.contact.supportHours.ta})` : `Customer Helpline (${COMPANY_FACTS.contact.supportHours.en})`}</p>
                  <div className="phone-links">
                    <a href={`tel:${COMPANY_FACTS.contact.primaryPhoneRaw}`} className="phone-link">{COMPANY_FACTS.contact.primaryPhone}</a>
                    <a href={`tel:${COMPANY_FACTS.contact.secondaryPhoneRaw}`} className="phone-link">{COMPANY_FACTS.contact.secondaryPhone}</a>
                  </div>
                  <a 
                    href={COMPANY_FACTS.contact.whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="contact-action-btn whatsapp-btn"
                  >
                    <MessageCircle size={18} /> {isTamil ? 'வாட்ஸ்அப்பில் பேசவும்' : 'Chat on WhatsApp'}
                  </a>
                </div>

                <div className="contact-hub-card">
                  <div className="contact-hub-icon"><Mail size={24} /></div>
                  <h3>{isTamil ? 'மின்னஞ்சல் முகவரி' : 'Official Email'}</h3>
                  <p>{isTamil ? 'ஆர்டர்கள் மற்றும் விசாரணைகளுக்கு:' : 'For orders, support and tracking:'}</p>
                  <div className="email-links">
                    <a href={`mailto:${COMPANY_FACTS.contact.primaryEmail}`} className="email-link">{COMPANY_FACTS.contact.primaryEmail}</a>
                  </div>
                  <Link to="/contact" className="contact-action-btn primary-btn">
                    <Mail size={18} /> {isTamil ? 'தொடர்பு படிவம் செல்லவும்' : 'Visit Contact Page'}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Support Banner */}
        <div className="policy-bottom-support">
          <div className="support-banner-content">
            <HelpCircle size={32} className="support-banner-icon" />
            <div>
              <h3>{isTamil ? 'இன்னும் கேள்விகள் உள்ளதா?' : 'Still have questions or need guidance?'}</h3>
              <p>
                {isTamil 
                  ? 'எங்கள் அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ) பக்கத்தைப் பார்க்கவும் அல்லது எங்கள் ஹெர்பல் நிபுணர்களுடன் வாட்ஸ்அப்பில் உரையாடவும்.'
                  : 'Check our comprehensive FAQs or chat directly with our botanical wellness team on WhatsApp.'}
              </p>
            </div>
          </div>
          <div className="support-banner-actions">
            <Link to="/faqs" className="banner-faq-btn">
              <HelpCircle size={18} /> {isTamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)' : 'Browse FAQs'}
            </Link>
            <a 
              href="https://wa.me/919788122001" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="banner-wa-btn"
            >
              <MessageCircle size={18} /> WhatsApp +91 97881 22001
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
