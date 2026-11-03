import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Search, X, ChevronDown, ChevronUp, HelpCircle, Phone, 
  MessageCircle, Mail, Truck, RefreshCw, ShieldCheck, Sparkles, ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import './Faq.css';

const FAQ_DATA = [
  // Category 1: Products & Ingredients
  {
    id: 1,
    category: 'products',
    questionEn: 'Are Dharani Herbbals products 100% natural and chemical-free?',
    questionTa: 'தாரணி ஹெர்பல்ஸ் தயாரிப்புகள் 100% இயற்கை மூலிகைகளால் செய்யப்பட்டவையா?',
    answerEn: 'Yes, absolutely! All Dharani Herbbals formulations are crafted using 100% pure herbal and botanical ingredients inspired by authentic Siddha and Ayurvedic traditions. We never use harsh sulfates (SLS/SLES), parabens, mineral oils, artificial coloring, or toxic synthetic additives.',
    answerTa: 'ஆம், நிச்சயமாக! தாரணி ஹெர்பல்ஸ் தயாரிப்புகள் அனைத்தும் பாரம்பரிய சித்த மருத்துவ முறையில் தூய இயற்கை மூலிகைகளால் மட்டுமே தயாரிக்கப்படுகின்றன. இதில் சல்பேட்டுகள் (SLS), பாராபென்கள், மினரல் ஆயில் அல்லது தீங்கு விளைவிக்கும் ரசாயனங்கள் எதுவும் சேர்க்கப்படுவதில்லை.'
  },
  {
    id: 2,
    category: 'products',
    questionEn: 'What is the shelf life / expiry period of your herbal powders and oils?',
    questionTa: 'உங்கள் மூலிகைப் பொடிகள் மற்றும் எண்ணெய்களின் ஆயுட்காலம் (Shelf Life) எவ்வளவு?',
    answerEn: 'Most of our authentic herbal powders, bath powders, and traditional cold-pressed herbal hair oils have a shelf life of 12 to 24 months from the manufacturing date. Always store containers tightly sealed in a cool, dry place away from direct sunlight and humidity.',
    answerTa: 'எங்களின் மூலிகைப் பொடிகள், நலங்கு மாவு மற்றும் பாரம்பரிய கூந்தல் எண்ணெய்கள் தயாரிப்பு தேதியிலிருந்து 12 முதல் 24 மாதங்கள் வரை பயன்படுத்தக்கூடியவை. ஈரப்பதம் படாதவாறு குளிர்ந்த மற்றும் உலர்ந்த இடத்தில் காற்று புகாதவாறு சேமிக்கவும்.'
  },
  {
    id: 3,
    category: 'products',
    questionEn: 'Do your products cause any allergies or side effects?',
    questionTa: 'இந்த மூலிகை தயாரிப்புகளால் ஏதேனும் பக்கவிளைவுகள் ஏற்படுமா?',
    answerEn: 'Since our products are formulated with authentic, botanical ingredients, they are gentle and well-tolerated. However, as with all natural botanical preparations, individuals with hyper-sensitive skin are advised to perform a simple 24-hour patch test on the inner elbow before full application.',
    answerTa: 'எங்கள் தயாரிப்புகள் தூய இயற்கை தாவர மூலிகைகளால் செய்யப்படுவதால் எவ்வித பக்கவிளைவுகளும் இல்லை. இருப்பினும் மிக மென்மையான சருமம் உள்ளவர்கள் முதன்முறை பயன்படுத்தும் போது முழங்கையின் உட்பகுதியில் சிறிய பேட்ச் டெஸ்ட் (Patch Test) செய்து கொள்ள பரிந்துரைக்கிறோம்.'
  },

  // Category 2: Directions for Use & Routines
  {
    id: 4,
    category: 'usage',
    questionEn: 'How should I use Chemparuthi Herbal Shampoo and Hair Oil for best results?',
    questionTa: 'செம்பருத்தி மூலிகை ஷாம்பூ மற்றும் கூந்தல் எண்ணெயை எவ்வாறு பயன்படுத்த வேண்டும்?',
    answerEn: 'For optimal hair strengthening and fall control, gently massage Dharani Herbal Hair Oil into your scalp and hair roots 2-3 times a week. Leave it on for at least 30-45 minutes (or overnight), then wash thoroughly with Chemparuthi Herbal Shampoo using normal water.',
    answerTa: 'சிறந்த முடி வளர்ச்சி மற்றும் முடி உதிர்வை கட்டுப்படுத்த, வாரத்திற்கு 2-3 முறை தாரணி கூந்தல் எண்ணெயை தலையில் வேர்க்கால்களில் தேய்த்து மசாஜ் செய்யவும். 30 முதல் 45 நிமிடங்கள் (அல்லது இரவு முழுவதும்) ஊறவைத்து, செம்பருத்தி ஷாம்பூ கொண்டு குளிர்ந்த நீரில் அலசவும்.'
  },
  {
    id: 5,
    category: 'usage',
    questionEn: 'How to use Nalangu Maavu (Herbal Bath Powder) daily?',
    questionTa: 'நலங்கு மாவு (Herbal Bath Powder) தினமும் எவ்வாறு உபயோகிப்பது?',
    answerEn: 'Take 1 to 2 tablespoons of Nalangu Maavu powder, mix with normal water (or rose water / milk for dry skin) to make a smooth paste. Apply over wet skin, gently massage in circular motions to exfoliate dead cells, and rinse with lukewarm water. It completely replaces chemical soaps.',
    answerTa: '1 முதல் 2 தேக்கரண்டி நலங்கு மாவை தண்ணீர் (அல்லது ரோஸ் வாட்டர் / பால்) சேர்த்து பேஸ்ட் போல் குழைத்துக் கொள்ளவும். ஈரமான உடலில் மென்மையாகத் தேய்த்து மிதமான வெந்நீரில் குளிக்கவும். இது செயற்கை சோப்பிற்கு சிறந்த மாற்றாகும்.'
  },
  {
    id: 6,
    category: 'usage',
    questionEn: 'Are Dharani Herbbals products safe for babies and children?',
    questionTa: 'குழந்தைகளுக்கு இந்த தயாரிப்புகளைப் பயன்படுத்தலாமா?',
    answerEn: 'Yes! Our traditional baby bath powder and gentle herbal formulations are specially made for delicate skin with mild ingredients like green gram, rose petals, and vettiver. For newborns under 6 months, always consult your pediatrician before introducing any new topical product.',
    answerTa: 'ஆம்! எங்களின் பாரம்பரிய குழந்தை நலங்கு மாவு பாசிப்பயறு, ரோஜா இதழ்கள் மற்றும் வெட்டிவேர் கொண்டு பிரத்யேகமாக தயாரிக்கப்படுகிறது. 6 மாதத்திற்கும் குறைவான பச்சிளம் குழந்தைகளுக்கு பயன்படுத்தும் முன் மருத்துவ ஆலோசனையைப் பெறவும்.'
  },

  // Category 3: Shipping & Delivery
  {
    id: 7,
    category: 'shipping',
    questionEn: 'What are your dispatch and delivery timelines across India?',
    questionTa: 'ஆர்டர் அனுப்பும் காலம் மற்றும் டெலிவரி அவகாசம் என்ன?',
    answerEn: 'All confirmed orders are packed and dispatched from our facility within 1 to 2 business days (excluding Sundays and holidays). Delivery typically takes 2 to 3 business days for Tamil Nadu & South India, and 3 to 7 business days for the rest of India.',
    answerTa: 'ஆர்டர் உறுதி செய்யப்பட்ட 1 முதல் 2 வேலை நாட்களுக்குள் பேக்கிங் செய்யப்பட்டு அனுப்பப்படும். தமிழ்நாட்டிற்குள் 2 முதல் 3 வேலை நாட்களிலும், இந்தியாவின் பிற பகுதிகளுக்கு 3 முதல் 7 வேலை நாட்களிலும் டெலிவரி செய்யப்படும்.'
  },
  {
    id: 8,
    category: 'shipping',
    questionEn: 'How can I track my order once it is shipped?',
    questionTa: 'ஆர்டர் அனுப்பப்பட்டதும் அதை எவ்வாறு டிராக் (Track) செய்வது?',
    answerEn: 'As soon as your shipment is dispatched, you will receive an automated SMS and email with your courier tracking number (AWB) and live tracking link. You can also visit our Track Order page at any time to see real-time transit status.',
    answerTa: 'பார்சல் கொரியரிடம் ஒப்படைக்கப்பட்டவுடன், உங்கள் மொபைல் எண் மற்றும் மின்னஞ்சலுக்கு டிராக்கிங் எண் அனுப்பப்படும். எங்கள் இணையதளத்தின் Track Order பக்கத்திலும் உங்கள் ஆர்டர் எண்ணை உள்ளிட்டு நிலையை அறியலாம்.'
  },
  {
    id: 9,
    category: 'shipping',
    questionEn: 'Which courier partners do you use for shipping?',
    questionTa: 'எந்தெந்த கொரியர் சேவைகள் மூலம் பார்சல் அனுப்பப்படுகிறது?',
    answerEn: 'We ship all parcels through verified, reliable courier partners including DTDC Express, The Professional Couriers, and India Post Speed Post to guarantee safe delivery across urban and rural pin codes.',
    answerTa: 'DTDC, Professional Couriers மற்றும் India Post (ஸ்பீட் போஸ்ட்) ஆகிய நம்பகமான கொரியர் நிறுவனங்கள் மூலமாக இந்தியா முழுவதும் பாதுகாப்பாக விநியோகிக்கப்படுகிறது.'
  },

  // Category 4: Payments & COD
  {
    id: 10,
    category: 'payments',
    questionEn: 'What payment methods do you accept? Is Cash on Delivery (COD) available?',
    questionTa: 'பணம் செலுத்த என்னென்ன வழிகள் உள்ளன? கேஷ் ஆன் டெலிவரி (COD) வசதி உண்டா?',
    answerEn: 'We support all major secure Indian payment methods: UPI (Google Pay, PhonePe, Paytm, BHIM), Debit & Credit Cards (Visa, MasterCard, RuPay), and Net Banking. Cash on Delivery (COD) is available for most serviceable PIN codes across India.',
    answerTa: 'கூகுள் பே, போன்பே, பேடிஎம் போன்ற UPI, டெபிட் மற்றும் கிரெடிட் கார்டுகள், நெட் பேங்கிங் மூலம் பணம் செலுத்தலாம். பெரும்பாலான பகுதிகளுக்கு கேஷ் ஆன் டெலிவரி (COD) வசதியும் உள்ளது.'
  },
  {
    id: 11,
    category: 'payments',
    questionEn: 'Is my online payment safe and encrypted?',
    questionTa: 'ஆன்லைன் பேமெண்ட் பாதுகாப்பானதா?',
    answerEn: 'Yes, 100%! All online payments are processed through RBI-authorized, 256-bit SSL encrypted payment gateways (Razorpay / Cashfree). Dharani Herbbals never stores your card number, CVV, or banking passwords.',
    answerTa: 'ஆம், 100% பாதுகாப்பானது! அனைத்து பரிவர்த்தனைகளும் 256-பிட் SSL குறியாக்கம் செய்யப்பட்ட அங்கீகரிக்கப்பட்ட கேட்வே வழியாகவே நடைபெறுகின்றன. உங்கள் கார்டு விபரங்கள் எங்கள் தளத்தில் சேமிக்கப்படுவதில்லை.'
  },

  // Category 5: Returns, Refunds & Cancellations
  {
    id: 12,
    category: 'returns',
    questionEn: 'What is your Return and Refund timeline policy?',
    questionTa: 'பொருட்கள் திருப்புதல் மற்றும் ரீபண்ட் பெறும் கால அவகாசம் என்ன?',
    answerEn: 'If you receive a damaged, leaked, expired, or incorrect product, please notify us within 48 hours of delivery with clear photographs or unboxing video. After quick verification, a free replacement or 100% refund will be credited to your original payment source within 7–10 business days.',
    answerTa: 'பொருள் சேதமடைந்திருந்தாலோ அல்லது தவறாக வந்திருந்தாலோ, டெலிவரி செய்யப்பட்ட 48 மணி நேரத்திற்குள் புகைப்படத்துடன் வாட்ஸ்அப் (+91 97881 22001) வழியாக தெரிவிக்கவும். சரிபார்ப்புக்குப் பின் 7-10 வேலை நாட்களில் உங்கள் வங்கிக் கணக்கில் முழுப் பணம் திரும்ப வழங்கப்படும்.'
  },
  {
    id: 13,
    category: 'returns',
    questionEn: 'Can I cancel my order after placing it?',
    questionTa: 'ஆர்டரை ரத்து செய்ய முடியுமா? ரத்து செய்வதற்கான வழிமுறை என்ன?',
    answerEn: 'Yes! You can cancel your order free of charge at any time BEFORE it is dispatched from our facility. Just call or WhatsApp us at +91 97881 22001 with your Order ID. A 100% full refund is credited back to you in 5–7 business days. Once dispatched, orders cannot be cancelled in transit.',
    answerTa: 'ஆம்! கிடங்கிலிருந்து அனுப்பப்படுவதற்கு (Before Dispatch) முன் எப்போது வேண்டுமானாலும் கட்டணமின்றி ரத்து செய்யலாம். ஆர்டர் எண்ணுடன் +91 97881 22001 எண்ணில் அழைக்கவும். 5-7 வேலை நாட்களில் முழு தொகையும் திருப்பித் தரப்படும்.'
  },

  // Category 6: Wholesale & Support
  {
    id: 14,
    category: 'wholesale',
    questionEn: 'Do you offer bulk, wholesale, or dealership partnerships?',
    questionTa: 'மொத்த விற்பனை (Wholesale) அல்லது விநியோகஸ்தர் வாய்ப்பு உள்ளதா?',
    answerEn: 'Yes! We supply directly to organic stores, Ayurvedic practitioners, pharmacies, and eco-friendly boutiques with attractive wholesale margins and verified batch purity. Contact us directly at +91 97881 22001 or email info@dharaniherbbals.in to discuss trade collaborations.',
    answerTa: 'ஆம்! இயற்கை அங்காடிகள், மூலிகை விற்பனையாளர்கள் மற்றும் மருத்துவர்களுக்கு சிறப்பான மொத்த விற்பனை விலையில் வழங்குகிறோம். +91 97881 22001 என்ற எண்ணில் தொடர்பு கொண்டு விபரங்களை அறியலாம்.'
  },
  {
    id: 15,
    category: 'support',
    questionEn: 'How can I reach Dharani Herbbals customer care?',
    questionTa: 'தாரணி ஹெர்பல்ஸ் வாடிக்கையாளர் சேவையை எவ்வாறு தொடர்பு கொள்வது?',
    answerEn: 'Our herbal wellness care team is available Monday through Saturday (9:00 AM – 7:00 PM IST). You can call or WhatsApp us at +91 97881 22001 / +91 99655 32001, or email us at info@dharaniherbbals.in.',
    answerTa: 'எங்கள் வாடிக்கையாளர் ஆதரவு குழு திங்கள் முதல் சனி வரை (காலை 9:00 முதல் இரவு 7:00 வரை) செயல்படுகிறது. தொலைபேசி / வாட்ஸ்அப்: +91 97881 22001 / +91 99655 32001, மின்னஞ்சல்: info@dharaniherbbals.in.'
  }
];

export default function Faq() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const CATEGORIES = useMemo(() => [
    { id: 'all', labelEn: 'All Questions', labelTa: 'அனைத்து கேள்விகள்' },
    { id: 'products', labelEn: 'Herbal Ingredients & Purity', labelTa: 'மூலிகைகள் & தரம்' },
    { id: 'usage', labelEn: 'Directions & Usage', labelTa: 'பயன்பாட்டு முறை' },
    { id: 'shipping', labelEn: 'Shipping & Delivery', labelTa: 'டெலிவரி & கால அவகாசம்' },
    { id: 'payments', labelEn: 'Payments & COD', labelTa: 'கட்டணம் & COD' },
    { id: 'returns', labelEn: 'Returns & Refunds', labelTa: 'ரீபண்ட் & ரத்து' },
    { id: 'wholesale', labelEn: 'Bulk & Wholesale', labelTa: 'மொத்த விற்பனை' },
    { id: 'support', labelEn: 'Helpline & Support', labelTa: 'உதவி மையம்' }
  ], []);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({ 1: true, 7: true, 12: true }); // Open key items by default

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allOpen = {};
    FAQ_DATA.forEach(f => { allOpen[f.id] = true; });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const qText = `${faq.questionEn} ${faq.questionTa}`.toLowerCase();
      const aText = `${faq.answerEn} ${faq.answerTa}`.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query === '' || qText.includes(query) || aText.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="faq-page">
      <SeoHead
        title="Frequently Asked Questions (FAQ) | Dharani Herbals"
        description="Find verified answers to common questions about Dharani Herbals products, 100% natural Siddha ingredients, delivery timelines, order tracking, and returns."
        canonicalUrl="https://www.dharaniherbbals.in/faqs"
        openGraph={{
          title: "Frequently Asked Questions (FAQ) | Dharani Herbals",
          description: "Find verified answers to common questions about Dharani Herbals products, 100% natural Siddha ingredients, delivery timelines, order tracking, and returns.",
          url: "https://www.dharaniherbbals.in/faqs",
          image: "https://www.dharaniherbbals.in/logo.png",
          type: "website"
        }}
        keywords={['dharani herbals faq', 'herbal questions', 'siddha shipping timelines', 'herbal product ingredients faq']}
      />
      {/* Header Banner */}
      <div className="faq-header">
        <div className="faq-header-inner">
          <Link to="/" className="faq-back-btn">
            <ArrowLeft size={18} />
            <span>{isTamil ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'}</span>
          </Link>

          <div className="faq-badge">
            <HelpCircle size={15} /> 
            <span>{isTamil ? 'உதவி மற்றும் அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Help Center & Knowledge Base'}</span>
          </div>

          <h1>{isTamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}</h1>
          <p className="faq-subtitle">
            {isTamil 
              ? 'எங்களின் இயற்கை மூலிகைப் பொருட்கள், பயன்பாட்டு முறை, டெலிவரி மற்றும் ரீபண்ட் பற்றிய அனைத்து தகவல்களையும் இங்கே தெரிந்து கொள்ளலாம்.'
              : 'Find clear, reliable answers regarding our authentic Siddha preparations, delivery timelines, payment options, and refund policies.'}
          </p>
        </div>
      </div>

      <div className="faq-content">
        {/* Quick Policy Timeline Cards Banner */}
        <div className="faq-policy-strip">
          <Link to="/shipping" className="faq-strip-item">
            <Truck size={18} className="strip-icon" />
            <div>
              <strong>1–2 {isTamil ? 'நாட்கள் அனுப்புதல்' : 'Days Dispatch'}</strong>
              <span>{isTamil ? '2–3 நாட்கள் (TN) | 3–7 நாட்கள் (இந்தியா)' : '2–3d TN / 3–7d India'}</span>
            </div>
          </Link>

          <Link to="/refunds" className="faq-strip-item">
            <RefreshCw size={18} className="strip-icon" />
            <div>
              <strong>{isTamil ? '48 மணி நேர அறிவிப்பு' : '48h Damage Notice'}</strong>
              <span>{isTamil ? '7–10 நாட்களில் முழு ரீபண்ட்' : '7–10 days refund credit'}</span>
            </div>
          </Link>

          <Link to="/policies" className="faq-strip-item">
            <ShieldCheck size={18} className="strip-icon" />
            <div>
              <strong>{isTamil ? '100% இயற்கை & பாதுகாப்பானது' : '100% Pure Botanicals'}</strong>
              <span>{isTamil ? 'அனைத்து கொள்கைகளையும் படிக்க' : 'View full policy center'}</span>
            </div>
          </Link>
        </div>

        {/* Search Input Bar */}
        <div className="faq-search-wrapper">
          <Search size={20} className="faq-search-icon" />
          <input
            type="text"
            className="faq-search-input"
            placeholder={isTamil 
              ? 'கேள்விகளைத் தேடவும் (எ.கா: டெலிவரி, ரீபண்ட், ஷாம்பூ, நலங்கு மாவு, COD)...' 
              : 'Search questions (e.g., delivery, refund, shampoo, bath powder, COD, tracking)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="faq-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Controls row: Category chips and expand/collapse */}
        <div className="faq-controls-row">
          <div className="faq-categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`faq-category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {isTamil ? cat.labelTa : cat.labelEn}
              </button>
            ))}
          </div>

          <div className="faq-expand-actions">
            <button className="expand-toggle-btn" onClick={expandAll}>
              <ChevronDown size={14} /> {isTamil ? 'அனைத்தையும் விரி' : 'Expand All'}
            </button>
            <button className="expand-toggle-btn" onClick={collapseAll}>
              <ChevronUp size={14} /> {isTamil ? 'மடக்கு' : 'Collapse All'}
            </button>
          </div>
        </div>

        {/* Result summary indicator */}
        <div className="faq-results-count">
          <span>{isTamil ? `${filteredFaqs.length} கேள்விகள் கிடைக்கின்றன` : `Showing ${filteredFaqs.length} questions`}</span>
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length > 0 ? (
          <div className="faq-accordion-list">
            {filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              const question = isTamil ? faq.questionTa : faq.questionEn;
              const answer = isTamil ? faq.answerTa : faq.answerEn;

              return (
                <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{question}</span>
                    <span className={`faq-chevron-box ${isOpen ? 'open' : ''}`}>
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="faq-empty-state">
            <HelpCircle size={44} className="empty-icon" />
            <h3>{isTamil ? 'பொருத்தமான கேள்விகள் எதுவும் கிடைக்கவில்லை' : 'No matching questions found'}</h3>
            <p>
              {isTamil 
                ? 'வேறு வார்த்தைகளைப் பயன்படுத்தி தேடவும் அல்லது அனைத்து வகைகளையும் பார்க்கவும்.' 
                : 'Try searching with different keywords or browse all categories.'}
            </p>
            <button
              className="faq-reset-btn"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              {isTamil ? 'அனைத்தையும் காட்டு' : 'Reset Filters'}
            </button>
          </div>
        )}

        {/* Contact & Support Help Box */}
        <div className="faq-contact-card">
          <div className="faq-contact-icon">
            <MessageCircle size={28} />
          </div>
          <h3>{isTamil ? 'இன்னும் உதவி தேவையா?' : 'Still have questions?'}</h3>
          <p>
            {isTamil 
              ? 'உங்கள் தயாரிப்பு அல்லது ஆர்டர் சந்தேகங்களுக்கு எங்கள் ஆதரவுக் குழு உங்களுக்கு உதவ தயாராக உள்ளது.' 
              : 'Our herbal wellness care and order support team is always delighted to assist you!'}
          </p>
          <div className="faq-contact-actions">
            <a
              href="https://wa.me/919788122001"
              target="_blank"
              rel="noopener noreferrer"
              className="faq-contact-btn whatsapp"
            >
              <MessageCircle size={18} /> {isTamil ? 'வாட்ஸ்அப்பில் பேசவும்' : 'WhatsApp Us'}
            </a>
            <a
              href="tel:+919788122001"
              className="faq-contact-btn secondary"
            >
              <Phone size={18} /> {isTamil ? 'அழைக்க +91 97881 22001' : 'Call +91 97881 22001'}
            </a>
            <Link to="/contact" className="faq-contact-btn primary">
              <Mail size={18} /> {isTamil ? 'தொடர்பு பக்கம்' : 'Contact Page'}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
