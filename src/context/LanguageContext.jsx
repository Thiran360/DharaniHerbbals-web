import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../services/api';

const LanguageContext = createContext();

const BASE_TRANSLATE_URL = `${API_BASE_URL}/herbal`;

const UI_TRANSLATIONS = {
  en: {
    home: "Home",
    shopAll: "Shop All",
    aboutUs: "About Us",
    contact: "Contact",
    searchPlaceholder: "Search products...",
    cart: "Cart",
    allProducts: "All Products",
    filterBy: "Filter by",
    showing: "Showing",
    of: "of",
    products: "products",
    in: "in",
    noProductsFound: "No products found",
    noItemsAvailable: "No items available in this category yet.",
    browseAll: "Browse All Products",
    ourCollection: "Our Collection",
    herbalTag: "🌿 100% Natural & Herbal",
    handcraftedWellness: "Handcrafted wellness products rooted in nature and tradition.",
    quickView: "Quick View",
    addToCart: "Add to Cart",
    featuredTitle: "Our Most Loved Picks.",
    featuredSubtitle: "Immerse yourself in our quintessential collection of highly sought-after botanical remedies, meticulously crafted to deliver an uncompromised standard of holistic nourishment and transformative wellness.",
    topRated: "Top Rated",
    viewAll: "View All Products",
    itemsInCollection: "products in this collection",
    itemInCollection: "product in this collection",
    account: "Account",
    myAccount: "My Account",
    logout: "Log Out",
    login: "Log In",
    copyright: "Vedan Mart",
    quantity: "Quantity",
    subtotal: "Subtotal",
    checkout: "Checkout",
    emptyCart: "Your cart is empty",
    continueShopping: "Continue Shopping",
    translating: "Translating...",
    descriptionLabel: "Description",
    relatedProducts: "You May Also Like",
    naturalTag: "Pure & Organic",
    hairCareTitle: "Hair Care Collection",
    hairCareTag: "100% Natural Hair Care",
    hairCareDesc: "Nourish your locks with authentic herbal oils, natural shampoos, and traditional hair care remedies for strong, shiny, and healthy hair.",
    
    skinCareTitle: "Skin Care Collection",
    skinCareTag: "Pure & Radiant Skin Care",
    skinCareDesc: "Rejuvenate your skin with authentic herbal face packs, natural aloe gels, and traditional skin remedies.",
    
    bodyCareTitle: "Bath & Body Essentials",
    bodyCareTag: "100% Herbal Body Care",
    bodyCareDesc: "Pamper your skin with handcrafted organic herbal soaps and refreshing natural bath powders.",
    
    foodTitle: "Traditional Food & Pickles",
    foodTag: "Authentic Traditional Taste",
    foodDesc: "Savor authentic homemade herbal pickles, traditional spices, and wholesome natural foods.",
    
    healthTitle: "Health & Wellness Care",
    healthTag: "Pure Siddha & Ayurvedic Care",
    healthDesc: "Boost your daily vital energy with authentic herbal health powders and traditional wellness supplements.",
    
    babyTitle: "Gentle Baby Care",
    babyTag: "Gentle & Pure Herbal Care",
    babyDesc: "Nurture your little ones with 100% natural, mild herbal bath powders and gentle baby care remedies.",
    
    poojasTitle: "Divine Pooja Essentials",
    poojasTag: "Traditional Sacred Aromas",
    poojasDesc: "Elevate your spiritual ambiance with pure natural lamp oils, herbal incenses, and sacred pooja essentials.",
    
    beveragesTitle: "Herbal Teas & Beverages",
    beveragesTag: "Refreshing Natural Drinks",
    beveragesDesc: "Revitalize your body with traditional herbal teas, natural concoctions, and refreshing wellness drinks.",
    labTested: "Quality Assured",
    freeDelivery: "Secure Delivery",
    taxInclusive: "Inclusive of all taxes",
    sliderTitle1: "Rooted in Tradition, Crafted with Care from Handpicked Herbs for Pure and Timeless Wellness.",
    sliderOffer1: "PREMIUM QUALITY",
    sliderTitle2: "Craving the Goodness of Beetroot Without the Extra Effort ?",
    sliderOffer2: "LIMITED TIME DEAL",
    sliderTitle3: "A Heritage of Purity in Every Bath.",
    sliderOffer3: "FLAT 20% OFF",
    shopNow: "Shop Now >",
    apothecaryReserve: "The Apothecary Reserve.",
    apothecaryDesc: "Our finest botanical creations, expertly crafted in limited batches to deliver exceptional quality, purity, and tradition.",
    curatedOffers: "Curated Offers",
    curatedDesc: "Handpicked botanical remedies and wellness essentials at exclusive limited-time prices.",
    trendingProducts: "Trending Products",
    trendingDesc: "Explore our most popular and highly sought-after natural wellness products.",
    allCategory: "All",
    journeySub: "Our Journey",
    shopReelsTitle: "Watch Discover Shop.",
    shopReelsDesc: "Discover how our community has embraced natural wellness through trusted botanical remedies and time-honoured herbal care.",
    journeyIntro: "It didn't start with a product.<br/>It started with a question.",
    journeyQuote: "\"What if healing could be simple again?\"",
    journeyP1: "Our journey began in 2004 with dedicated research into Siddha and Ayurveda, exploring the depth of natural healing and time-tested traditions.",
    journeyP2: "In a world overwhelmed by artificial solutions and quick fixes, we chose a different path — one that returns to purity, to tradition, and to the quiet power of nature.",
    journeyP3: "Every product we create reflects this commitment, blending ancient wisdom with modern care to deliver safe, effective, and truly natural healing.",
    journeyClosing: "Back to roots. Forward to better living.",
    reviewsTitle: "Real Results",
    reviewsDesc: "Don't just take our word for it. Here is what our community of beautiful souls has to say about their transformation journey with us.",
    legacyOfTrust: "Legacy of Trust",
    customersServed: "Customers Served",
    productsCrafted: "Products Crafted",
    chemicalFree: "Nature-Powered Care",
    featureTitle1: "Pure by Nature",
    featureDesc1: "Every ingredient is thoughtfully sourced from trusted growers and carefully selected for its purity, potency, and natural goodness—bringing you authentic herbal care inspired by nature.",
    featureTitle2: "Crafted with Integrity",
    featureDesc2: "From responsible sourcing to meticulous testing, every product is crafted under strict quality standards to ensure purity, safety, consistency, and lasting trust.",
    featureTitle3: "Rooted in Tradition",
    featureDesc3: "Inspired by generations of Siddha wisdom and refined through modern expertise, our formulations unite timeless herbal traditions with contemporary quality to support natural wellness every day.",
    aboutBadge: "100% Natural Wellness",
    aboutTitle: "About Vedan Mart",
    aboutSubtitle: "Your trusted partner in natural wellness and herbal healthcare solutions",
    ourMission: "Our Mission",
    missionDesc: "To make traditional herbal wisdom accessible to everyone by creating carefully crafted products that promote a natural and balanced lifestyle.",
    ourHistory: "Our History",
    historyDesc: "Our journey began in 2004 with dedicated research into Siddha and Ayurvedic traditions, leading to the formal establishment of Vedan Mart in 2007.",
    coreValues: "Our Core Values",
    coreValuesDesc: "These values guide everything we do and shape our commitment to natural wellness",
    val1Title: "Quality First",
    val1Desc: "Maintaining consistent quality, authenticity, and care in every formulation.",
    val2Title: "Natural & Safe",
    val2Desc: "Crafted with carefully selected natural ingredients, ensuring quality and purity.",
    val3Title: "Certified Excellence",
    val3Desc: "Our products meet international quality standards and certifications.",
    val4Title: "Customer Focused",
    val4Desc: "We listen to our customers and continuously improve our products based on feedback.",
    stat1Val: "6L+",
    stat2Val: "350+",
    stat2Label: "Herbal Formulations",
    stat3Val: "100%",
    stat3Label: "100% Naturally Derived Ingredients",
    stat4Val: "15+",
    diffTitle: "What Makes Us Different",
    diffDesc: "Our commitment to excellence sets us apart in the herbal wellness industry",
    commitTitle: "Our Commitment to You",
    commit1Title: "Authentic Products",
    commit1Desc: "Every product is crafted with authentic ingredients and traditional methods.",
    commit2Title: "Expert Guidance",
    commit2Desc: "Our team is committed to helping customers make informed choices about our products.",
    commit3Title: "Customer Satisfaction",
    commit3Desc: "Your trust and satisfaction inspire everything we do, every day.",
    commit4Title: "Continuous Innovation",
    commit4Desc: "We continuously research and develop new products to meet evolving health needs.",
    commit5Title: "Sustainable Practices",
    commit5Desc: "We are committed to environmentally responsible sourcing and production.",
    commit6Title: "Transparent Communication",
    commit6Desc: "We believe in honest, transparent communication about our products and processes.",
    ctaTitle: "Join Our Wellness Journey",
    ctaDesc: "Experience the power of natural wellness with Vedan Mart. Let us be your partner in achieving optimal health through the wisdom of nature and the science of modern herbal medicine.",
    ctaBtn1: "Explore Our Products",
    ctaBtn2: "Get In Touch",
    contactHeroTitle: "Get In Touch",
    contactHeroDesc: "Have questions about our herbal products? We're here to help you on your wellness journey.",
    contactPhone: "Phone",
    contactEmail: "Email",
    contactAddress: "Address",
    contactAddressLine1: "7/470-1, Chemparuthi Street,",
    contactAddressLine2: "West Nehru Nagar,",
    contactAddressLine3: "Punjai Puliampatti,",
    contactAddressLine4: "Sathyamangalam(TALUK),",
    contactAddressLine5: "Erode - 638 459, TN, India",
    contactHours: "Store Hours",
    contactHoursDesc: "Mon - Sat: 9:00 AM - 7:00 PM",
    contactFormTitle: "Send us a Message",
    contactFullName: "Full Name *",
    contactPhoneLabel: "Phone Number *",
    contactEmailLabel: "Email Address *",
    contactSubject: "Subject *",
    contactSelectSubject: "Select a subject",
    contactGeneralInquiry: "General Inquiry",
    contactOrderStatus: "Order Status",
    contactProductInfo: "Product Information",
    contactOther: "Other",
    contactMessageLabel: "Message *",
    contactMessagePlaceholder: "Tell us how we can help you...",
    contactSendBtn: "Send via WhatsApp",
    contactWhyChooseUs: "Why Choose Vedan Mart?",
    contactSupportTitle: "24/7 Support",
    contactSupportDesc: "Round-the-clock customer support for all your queries",
    contactQuickResponseTitle: "Quick Response",
    contactQuickResponseDesc: "We respond to all inquiries within 2-4 hours",
    contactExpertTitle: "Expert Guidance",
    contactExpertDesc: "Get advice from our herbal wellness experts",
    contactVisitStore: "Visit Our Store",
    contactFollowUs: "Follow Us",
    contactFollowDesc: "Stay connected with us on social media for the latest updates, health tips, and product launches.",
  },
  ta: {
    home: "முகப்பு",
    shopAll: "கடை",
    aboutUs: "எங்களைப் பற்றி",
    contact: "தொடர்பு",
    searchPlaceholder: "தயாரிப்புகளைத் தேடுங்கள்...",
    cart: "கூடை",
    allProducts: "அனைத்து தயாரிப்புகள்",
    filterBy: "வடிகட்டு",
    showing: "காண்பிக்கிறது",
    of: "இல்",
    products: "தயாரிப்புகள்",
    in: "பிரிவில்",
    noProductsFound: "தயாரிப்புகள் எதுவும் கிடைக்கவில்லை",
    noItemsAvailable: "இந்த பிரிவில் இன்னும் பொருட்கள் இல்லை.",
    browseAll: "அனைத்து தயாரிப்புகளையும் காண்க",
    ourCollection: "எங்கள் சேகரிப்பு",
    herbalTag: "🌿 100% இயற்கை & மூலிகை",
    handcraftedWellness: "இயற்கை மற்றும் பாரம்பரியத்தில் வேரூன்றிய கைவினைமுறை ஆரோக்கிய தயாரிப்புகள்.",
    quickView: "விரைவு பார்வை",
    addToCart: "கூடையில் சேர்",
    featuredTitle: "எங்கள் சிறந்த தயாரிப்புகள்.",
    featuredSubtitle: "ஒப்பற்ற ஆரோக்கியத்தையும் ஊட்டச்சத்தையும் அளிக்கக்கூடிய எங்களின் மிகச்சிறந்த இயற்கை மூலிகை தயாரிப்புகள்.",
    topRated: "உயர்தரம்",
    viewAll: "அனைத்து தயாரிப்புகளையும் காண்க",
    itemsInCollection: "தயாரிப்புகள் உள்ளன",
    itemInCollection: "தயாரிப்பு உள்ளது",
    account: "கணக்கு",
    myAccount: "எனது கணக்கு",
    logout: "வெளியேறு",
    login: "உள்நுழை",
    copyright: "தரணி ஹெர்பல்ஸ்",
    quantity: "அளவு",
    subtotal: "மொத்தம்",
    checkout: "செலுத்துதல்",
    emptyCart: "உங்கள் கூடை காலியாக உள்ளது",
    continueShopping: "தொடர்ந்து ஷாப்பிங் செய்ய",
    translating: "மொழிபெயர்க்கிறது...",
    descriptionLabel: "விளக்கம்",
    relatedProducts: "நீங்கள் விரும்பக்கூடியவை",
    naturalTag: "தூய்மையான & இயற்கை",
    hairCareTitle: "கூந்தல் பராமரிப்பு தொகுப்பு",
    hairCareTag: "100% இயற்கை கூந்தல் பராமரிப்பு",
    hairCareDesc: "வலுவான, பளபளப்பான மற்றும் ஆரோக்கியமான கூந்தலுக்கு பாரம்பரிய மூலிகை எண்ணெய், இயற்கை ஷாம்பு மற்றும் மூலிகை பராமரிப்பு தயாரிப்புகள்.",
    
    skinCareTitle: "சரும பராமரிப்பு தொகுப்பு",
    skinCareTag: "தூய்மையான சரும பராமரிப்பு",
    skinCareDesc: "இயற்கை மூலிகை ஃபேஸ் பேக் மற்றும் சோற்றுக் கற்றாழை மூலம் உங்கள் சருமத்தை பொலிவாக வைத்துக் கொள்ளுங்கள்.",
    
    bodyCareTitle: "குளியல் & உடல் பராமரிப்பு",
    bodyCareTag: "100% மூலிகை உடல் பராமரிப்பு",
    bodyCareDesc: "பாரம்பரிய மூலிகை சோப்புகள் மற்றும் இயற்கை குளியல் பொடிகள் மூலம் உங்கள் உடலை பராமரியுங்கள்.",
    
    foodTitle: "பாரம்பரிய உணவு & ஊறுகாய்",
    foodTag: "உண்மையான பாரம்பரிய சுவை",
    foodDesc: "சுவையான பிரண்டைகாய் ஊறுகாய், பாரம்பரிய மசாலாக்கள் மற்றும் சத்தான இயற்கை உணவுகள்.",
    
    healthTitle: "சுகாதாரம் & ஆரோக்கிய கவனிப்பு",
    healthTag: "சித்த & ஆயுர்வேத ஆரோக்கியம்",
    healthDesc: "பாரம்பரிய சத்து மாவு மற்றும் மூலிகை சூரணங்கள் மூலம் உங்கள் உடலின் நோய் எதிர்ப்பு சக்தியை அதிகரிக்கவும்.",
    
    babyTitle: "குழந்தை பராமரிப்பு",
    babyTag: "மென்மையான மூலிகை கவனிப்பு",
    babyDesc: "100% இயற்கை நலங்கு மாவு மற்றும் மென்மையான மூலிகை தயாரிப்புகள் மூலம் உங்கள் குழந்தைகளை பராமரியுங்கள்.",
    
    poojasTitle: "பூஜை பொருட்கள்",
    poojasTag: "பாரம்பரிய ஆன்மீக நறுமணம்",
    poojasDesc: "தூய்மையான பஞ்ச தீப எண்ணெய் மற்றும் மூலிகை பூஜை பொருட்கள் மூலம் உங்கள் வீட்டை ஆன்மீக நறுமணத்தால் நிரப்புங்கள்.",
    
    beveragesTitle: "மூலிகை பானங்கள் & டீ",
    beveragesTag: "புத்துணர்ச்சி தரும் இயற்கை பானங்கள்",
    beveragesDesc: "பாரம்பரிய மூலிகை டீ மற்றும் ஆரோக்கிய பானங்கள் மூலம் உடலுக்கு புத்துணர்ச்சி அளிக்கவும்.",
    labTested: "தர உத்தரவாதம்",
    freeDelivery: "பாதுகாப்பான டெலிவரி",
    taxInclusive: "வரிகள் உட்பட",
    sliderTitle1: "பாரம்பரியத்தில் வேரூன்றிய, தூய்மையான மற்றும் காலத்தால் அழியாத ஆரோக்கியத்திற்காக கவனத்துடன் வடிவமைக்கப்பட்டுள்ளது.",
    sliderOffer1: "உயர்ந்த தரம்",
    sliderTitle2: "கூடுதல் முயற்சி இன்றி பீட்ரூட்டின் நன்மைகளை பெற விரும்புகிறீர்களா?",
    sliderOffer2: "குறுகிய கால சலுகை",
    sliderTitle3: "ஒவ்வொரு குளியலிலும் தூய்மையின் பாரம்பரியம்.",
    sliderOffer3: "20% தள்ளுபடி",
    shopNow: "இப்போதே வாங்குங்கள் >",
    apothecaryReserve: "தி அபோதெக்கரி ரிசர்வ்.",
    apothecaryDesc: "எங்களின் மிகச்சிறந்த தாவரவியல் படைப்புகள், விதிவிலக்கான தரம், தூய்மை மற்றும் பாரம்பரியத்தை வழங்க குறைந்த அளவில் நிபுணத்துவத்துடன் வடிவமைக்கப்பட்டுள்ளன.",
    curatedOffers: "சிறப்பு சலுகைகள்",
    curatedDesc: "பிரத்தியேகமான குறுகிய கால சலுகையில் தேர்ந்தெடுக்கப்பட்ட மூலிகை மற்றும் ஆரோக்கிய தயாரிப்புகள்.",
    trendingProducts: "பிரபலமான தயாரிப்புகள்",
    trendingDesc: "எங்கள் மிகவும் பிரபலமான மற்றும் அதிகம் விரும்பப்படும் இயற்கை ஆரோக்கிய தயாரிப்புகளை ஆராயுங்கள்.",
    allCategory: "அனைத்தும்",
    journeySub: "எங்கள் பயணம்",
    shopReelsTitle: "பாருங்கள் கண்டறியுங்கள் வாங்குங்கள்.",
    shopReelsDesc: "நம்பகமான மூலிகை வைத்தியம் மற்றும் காலத்தால் மதிக்கப்படும் மூலிகை பராமரிப்பு மூலம் எங்கள் சமூகம் எவ்வாறு இயற்கை ஆரோக்கியத்தை தழுவியுள்ளது என்பதைக் கண்டறியவும்.",
    journeyIntro: "இது ஒரு தயாரிப்புடன் தொடங்கவில்லை.<br/>இது ஒரு கேள்வியுடன் தொடங்கியது.",
    journeyQuote: "\"குணப்படுத்துவது மீண்டும் எளிமையாக இருந்தால் என்ன?\"",
    journeyP1: "எங்கள் பயணம் 2004 ஆம் ஆண்டில் சித்தா மற்றும் ஆயுர்வேதத்தில் அர்ப்பணிக்கப்பட்ட ஆராய்ச்சியோடு தொடங்கியது, இயற்கை குணமாகும் ஆற்றல் மற்றும் காலம் சோதித்த பாரம்பரியங்களின் ஆழத்தை ஆராய்ந்தது.",
    journeyP2: "செயற்கை தீர்வுகள் மற்றும் விரைவான தீர்வுகளால் நிரம்பிவழியும் உலகில், நாங்கள் ஒரு வித்தியாசமான பாதையைத் தேர்ந்தெடுத்தோம் - தூய்மை, பாரம்பரியம் மற்றும் இயற்கையின் அமைதியான சக்திக்கு திரும்பும் ஒரு பாதை.",
    journeyP3: "நாங்கள் உருவாக்கும் ஒவ்வொரு தயாரிப்பும் இந்த அர்ப்பணிப்பைப் பிரதிபலிக்கிறது, பாதுகாப்பான, பயனுள்ள மற்றும் உண்மையான இயற்கை குணமாகும் ஆற்றலை வழங்க பண்டைய ஞானத்தை நவீன கவனிப்புடன் கலக்கிறது.",
    journeyClosing: "வேர்களுக்கு திரும்புவோம். சிறந்த வாழ்க்கையை நோக்கி முன்னேறுவோம்.",
    reviewsTitle: "உண்மையான முடிவுகள்",
    reviewsDesc: "எங்கள் வார்த்தையை மட்டும் நம்ப வேண்டாம். தங்களுடைய மாற்றப் பயணத்தைப் பற்றி எங்கள் அழகிய வாடிக்கையாளர்கள் என்ன சொல்கிறார்கள் என்பதைப் பாருங்கள்.",
    legacyOfTrust: "நம்பிக்கையின் பாரம்பரியம்",
    customersServed: "சேவை செய்த வாடிக்கையாளர்கள்",
    productsCrafted: "உருவாக்கப்பட்ட தயாரிப்புகள்",
    chemicalFree: "இரசாயனமற்ற",
    featureTitle1: "100% இயற்கை மூலப்பொருட்கள்",
    featureDesc1: "நாங்கள் இயற்கையிலிருந்து பிரீமியம் மூலிகைகள் மற்றும் தாவரவியலை கவனமாகப் பெறுகிறோம், ஒவ்வொரு உருவாக்கத்திலும் விதிவிலக்கான தூய்மை, தரம் மற்றும் நம்பகத்தன்மையை உறுதிசெய்கிறோம்.",
    featureTitle2: "தர உறுதி",
    featureDesc2: "ஒவ்வொரு தயாரிப்பும் கடுமையான தரக் கட்டுப்பாடுகளின் கீழ் வடிவமைக்கப்பட்டுள்ளது மற்றும் பாதுகாப்பு, நிலைத்தன்மை மற்றும் சிறப்பை உறுதிப்படுத்த முழுமையான சோதனைக்கு உட்படுகிறது.",
    featureTitle3: "பாரம்பரிய ஞானம்",
    featureDesc3: "எங்கள் பிரத்தியேக சூத்திரங்கள் பண்டைய சித்த ஞானத்தை ஈர்க்கின்றன, தலைமுறைகளாக பாரம்பரிய அறிவின் மூலம் முழுமையாக்கப்படுகின்றன.",
    aboutBadge: "100% இயற்கை ஆரோக்கியம்",
    aboutTitle: "தரணி ஹெர்பல்ஸ் பற்றி",
    aboutSubtitle: "இயற்கை ஆரோக்கியம் மற்றும் மூலிகை சுகாதார தீர்வுகளில் உங்கள் நம்பகமான பங்குதாரர்",
    ourMission: "எங்கள் நோக்கம்",
    missionDesc: "இயற்கையான மற்றும் சமநிலையான வாழ்க்கை முறையை ஊக்குவிக்கும் கவனமாக வடிவமைக்கப்பட்ட தயாரிப்புகளை உருவாக்குவதன் மூலம் பாரம்பரிய மூலிகை ஞானத்தை அனைவருக்கும் கிடைக்கச் செய்வது.",
    ourHistory: "எங்கள் வரலாறு",
    historyDesc: "எங்கள் பயணம் 2004 இல் சித்தா மற்றும் ஆயுர்வேத மரபுகள் குறித்த அர்ப்பணிப்புடன் கூடிய ஆராய்ச்சியுடன் தொடங்கியது, இது 2007 இல் தரணி ஹெர்பல்ஸ் முறையாக நிறுவப்படுவதற்கு வழிவகுத்தது.",
    coreValues: "எங்கள் முக்கிய மதிப்புகள்",
    coreValuesDesc: "இந்த மதிப்புகள் நாங்கள் செய்யும் எல்லாவற்றிற்கும் வழிகாட்டி, இயற்கை ஆரோக்கியத்திற்கான எங்கள் அர்ப்பணிப்பை வடிவமைக்கின்றன",
    val1Title: "தரத்திற்கு முன்னுரிமை",
    val1Desc: "ஒவ்வொரு தயாரிப்பிலும் நிலையான தரம், நம்பகத்தன்மை மற்றும் கவனிப்பைப் பேணுதல்.",
    val2Title: "இயற்கையானது & பாதுகாப்பானது",
    val2Desc: "தரம் மற்றும் தூய்மையை உறுதிசெய்து, கவனமாக தேர்ந்தெடுக்கப்பட்ட இயற்கை பொருட்களால் வடிவமைக்கப்பட்டுள்ளது.",
    val3Title: "சான்றளிக்கப்பட்ட சிறப்பு",
    val3Desc: "எங்கள் தயாரிப்புகள் சர்வதேச தரத் தரநிலைகள் மற்றும் சான்றிதழ்களைப் பூர்த்தி செய்கின்றன.",
    val4Title: "வாடிக்கையாளர் மையம்",
    val4Desc: "நாங்கள் எங்கள் வாடிக்கையாளர்களுக்கு செவிசாய்க்கிறோம் மற்றும் கருத்துக்களின் அடிப்படையில் எங்கள் தயாரிப்புகளை தொடர்ந்து மேம்படுத்துகிறோம்.",
    stat1Val: "6 லட்சம்+",
    stat2Val: "350+",
    stat2Label: "மூலிகை தயாரிப்புகள்",
    stat3Val: "100%",
    stat3Label: "100% இயற்கையாக பெறப்பட்ட பொருட்கள்",
    stat4Val: "15+",
    diffTitle: "எங்களை வேறுபடுத்துவது எது",
    diffDesc: "சிறப்பிற்கான எங்கள் அர்ப்பணிப்பு மூலிகை ஆரோக்கியத் துறையில் எங்களை வேறுபடுத்துகிறது",
    commitTitle: "உங்களுக்கான எங்கள் அர்ப்பணிப்பு",
    commit1Title: "உண்மையான தயாரிப்புகள்",
    commit1Desc: "ஒவ்வொரு தயாரிப்பும் உண்மையான பொருட்கள் மற்றும் பாரம்பரிய முறைகளுடன் வடிவமைக்கப்பட்டுள்ளது.",
    commit2Title: "நிபுணர் வழிகாட்டுதல்",
    commit2Desc: "எங்கள் தயாரிப்புகளைப் பற்றி வாடிக்கையாளர்கள் தகவலறிந்த தேர்வுகளைச் செய்ய உதவுவதற்கு எங்கள் குழு உறுதிபூண்டுள்ளது.",
    commit3Title: "வாடிக்கையாளர் திருப்தி",
    commit3Desc: "உங்கள் நம்பிக்கையும் திருப்தியுமே ஒவ்வொரு நாளும் நாங்கள் செய்யும் எல்லாவற்றிற்கும் ஊக்கமளிக்கிறது.",
    commit4Title: "தொடர்ச்சியான கண்டுபிடிப்பு",
    commit4Desc: "வளர்ந்து வரும் சுகாதாரத் தேவைகளைப் பூர்த்தி செய்ய நாங்கள் தொடர்ந்து புதிய தயாரிப்புகளை ஆராய்ந்து உருவாக்குகிறோம்.",
    commit5Title: "நிலையான நடைமுறைகள்",
    commit5Desc: "சுற்றுச்சூழலுக்குப் பொறுப்பான ஆதாரங்களை உருவாக்குவதற்கும் உற்பத்தி செய்வதற்கும் நாங்கள் உறுதிபூண்டுள்ளோம்.",
    commit6Title: "வெளிப்படையான தொடர்பு",
    commit6Desc: "எங்கள் தயாரிப்புகள் மற்றும் செயல்முறைகள் பற்றிய நேர்மையான, வெளிப்படையான தகவல்தொடர்புகளில் நாங்கள் நம்புகிறோம்.",
    ctaTitle: "எங்கள் ஆரோக்கிய பயணத்தில் இணையுங்கள்",
    ctaDesc: "தரணி ஹெர்பல்ஸுடன் இயற்கை ஆரோக்கியத்தின் சக்தியை அனுபவியுங்கள். இயற்கையின் ஞானம் மற்றும் நவீன மூலிகை மருத்துவத்தின் அறிவியல் மூலம் உகந்த ஆரோக்கியத்தை அடைவதில் நாங்கள் உங்கள் பங்காளியாக இருப்போம்.",
    ctaBtn1: "எங்கள் தயாரிப்புகளை ஆராயுங்கள்",
    ctaBtn2: "தொடர்பு கொள்ளுங்கள்",
    contactHeroTitle: "தொடர்பு கொள்ளுங்கள்",
    contactHeroDesc: "எங்கள் மூலிகை தயாரிப்புகளைப் பற்றி ஏதேனும் கேள்விகள் உள்ளதா? உங்கள் ஆரோக்கிய பயணத்தில் உங்களுக்கு உதவ நாங்கள் இங்கே இருக்கிறோம்.",
    contactPhone: "தொலைபேசி",
    contactEmail: "மின்னஞ்சல்",
    contactAddress: "முகவரி",
    contactAddressLine1: "7/470-1, செம்பருத்தி வீதி,",
    contactAddressLine2: "மேற்கு நேரு நகர்,",
    contactAddressLine3: "புஞ்சை புளியம்பட்டி,",
    contactAddressLine4: "சத்தியமங்கலம் (தாலுகா),",
    contactAddressLine5: "ஈரோடு - 638 459, தமிழ்நாடு, இந்தியா",
    contactHours: "வேலை நேரம்",
    contactHoursDesc: "திங்கள் - சனி: காலை 9:00 - இரவு 7:00",
    contactFormTitle: "எங்களுக்கு ஒரு செய்தியை அனுப்புங்கள்",
    contactFullName: "முழு பெயர் *",
    contactPhoneLabel: "தொலைபேசி எண் *",
    contactEmailLabel: "மின்னஞ்சல் முகவரி *",
    contactSubject: "பொருள் *",
    contactSelectSubject: "ஒரு பொருளைத் தேர்ந்தெடுக்கவும்",
    contactGeneralInquiry: "பொதுவான விசாரணை",
    contactOrderStatus: "ஆர்டர் நிலை",
    contactProductInfo: "தயாரிப்பு தகவல்",
    contactOther: "மற்றவை",
    contactMessageLabel: "செய்தி *",
    contactMessagePlaceholder: "நாங்கள் உங்களுக்கு எப்படி உதவ முடியும் என்பதை எங்களிடம் கூறுங்கள்...",
    contactSendBtn: "வாட்ஸ்அப் மூலம் அனுப்பவும்",
    contactWhyChooseUs: "எங்களை ஏன் தேர்ந்தெடுக்க வேண்டும்?",
    contactSupportTitle: "24/7 ஆதரவு",
    contactSupportDesc: "உங்கள் அனைத்து கேள்விகளுக்கும் முழு நேர வாடிக்கையாளர் ஆதரவு",
    contactQuickResponseTitle: "விரைவான பதில்",
    contactQuickResponseDesc: "அனைத்து விசாரணைகளுக்கும் 2-4 மணி நேரத்திற்குள் பதிலளிப்போம்",
    contactExpertTitle: "நிபுணர் வழிகாட்டுதல்",
    contactExpertDesc: "எங்கள் மூலிகை ஆரோக்கிய நிபுணர்களிடமிருந்து ஆலோசனை பெறுங்கள்",
    contactVisitStore: "எங்கள் கடையைப் பார்வையிடவும்",
    contactFollowUs: "எங்களைப் பின்தொடரவும்",
    contactFollowDesc: "சமீபத்திய புதுப்பிப்புகள், சுகாதார குறிப்புகள் மற்றும் தயாரிப்பு வெளியீடுகளுக்கு சமூக ஊடகங்களில் எங்களுடன் இணைந்திருங்கள்.",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('dharani_lang') || 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Cache for text translations (text → translated text)
  const [translationCache, setTranslationCache] = useState(() => {
    try {
      const cached = localStorage.getItem('dharani_translations');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  });

  // Cache for bulk product translations (productId → name_tamil)
  const [bulkProductNames, setBulkProductNames] = useState(() => {
    try {
      const cached = localStorage.getItem('dharani_bulk_names');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  });

  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const hasAttemptedBulkFetch = useRef(false);

  // Persist text translation cache
  useEffect(() => {
    localStorage.setItem('dharani_translations', JSON.stringify(translationCache));
  }, [translationCache]);

  // Persist bulk names cache
  useEffect(() => {
    localStorage.setItem('dharani_bulk_names', JSON.stringify(bulkProductNames));
  }, [bulkProductNames]);

  // ── Bulk product translation ─────────────────────────────────────────────
  const fetchBulkProductTranslations = useCallback(async () => {
    if (isBulkLoading || hasAttemptedBulkFetch.current) return;
    setIsBulkLoading(true);
    hasAttemptedBulkFetch.current = true;

    try {
      const res = await fetch(
        `${BASE_TRANSLATE_URL}/translation/products/bulk-translate/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({})
        }
      );

      if (!res.ok) throw new Error('Bulk API Error');

      const data = await res.json();

      // Handle common response shapes:
      // { products: [{id, name_tamil}, ...] }
      // { results: [{id, name_tamil}, ...] }
      // [ {id, name_tamil}, ... ]
      const list = data?.products || data?.results || (Array.isArray(data) ? data : []);

      if (list.length > 0) {
        const nameMap = {};
        list.forEach(p => {
          const id = p.id || p.product_id;
          const tamil = p.name_tamil || p.translated_name || p.name;
          if (id && tamil) nameMap[id] = tamil;
        });

        setBulkProductNames(prev => ({ ...prev, ...nameMap }));
      }
    } catch (e) {
      console.warn('Bulk product translation failed:', e);
    } finally {
      setIsBulkLoading(false);
    }
  }, [isBulkLoading]);

  // ── Single product translation by ID ────────────────────────────────────
  const translateProduct = useCallback(async (productId) => {
    if (bulkProductNames[productId]) return bulkProductNames[productId];

    try {
      const res = await fetch(
        `${BASE_TRANSLATE_URL}/translation/product/${productId}/translate/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({})
        }
      );

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      // Handle various possible response shapes
      const nameTamil =
        data?.name_tamil ||
        data?.translated_name ||
        data?.name ||
        data?.product?.name_tamil ||
        null;

      if (nameTamil) {
        setBulkProductNames(prev => ({ ...prev, [productId]: nameTamil }));
        return nameTamil;
      }
    } catch (e) {
      console.warn(`Product ${productId} translation failed:`, e);
    }

    return null;
  }, [bulkProductNames]);

  // ── Single text translation ──────────────────────────────────────────────
  const translateText = useCallback(async (text, targetLang = language) => {
    if (!text) return '';
    if (targetLang === 'en') return text;

    const cacheKey = `${text}_${targetLang}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      const res = await fetch(`${BASE_TRANSLATE_URL}/translation/translate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ text, target: targetLang })
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      const translated = data?.translated_text || data?.translation || data?.result || null;

      if (translated) {
        setTranslationCache(prev => ({ ...prev, [cacheKey]: translated }));
        return translated;
      }
    } catch (e) {
      console.warn('Translation API failed:', e);
    }

    return text; // fallback to original
  }, [language, translationCache]);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem('dharani_lang', lang);
    // Trigger bulk translation if switching to Tamil and not yet fetched
    if (lang === 'ta' && Object.keys(bulkProductNames).length === 0 && !hasAttemptedBulkFetch.current) {
      fetchBulkProductTranslations();
    }
  }, [bulkProductNames, fetchBulkProductTranslations]);

  const t = useCallback((key) => {
    return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS['en']?.[key] || key;
  }, [language]);

  // Auto-fetch bulk translations on mount if language is already Tamil
  useEffect(() => {
    if (language === 'ta' && Object.keys(bulkProductNames).length === 0 && !hasAttemptedBulkFetch.current) {
      fetchBulkProductTranslations();
    }
  }, [language, bulkProductNames, fetchBulkProductTranslations]);


  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateText,
        translateProduct,
        fetchBulkProductTranslations,
        bulkProductNames,
        isBulkLoading
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
