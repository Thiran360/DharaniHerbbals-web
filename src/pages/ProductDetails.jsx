import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductCard } from './Shop';
import { ShoppingCart, ShieldCheck, Leaf, Truck, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Share2, MessageCircle, Camera, Copy, Check, Package, Plus, Star, MessageSquare, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import imgLifestyle from '../assets/herbal_lifestyle.png';
import imgIngredients from '../assets/herbal_ingredients.png';
import imgTexture from '../assets/herbal_texture.png';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../services/api';
import './ProductDetails.css';
const BENEFIT_TRANSLATIONS = {
  // Product 1255 & Hair care benefits
  'Hibiscus Hair Therapy': 'செம்பருத்தி கூந்தல் சிகிச்சை',
  'Silky Touch': 'பட்டு போன்ற மிருதுவான தொடுதல்',
  'Natural Hair Shine': 'இயற்கையான கூந்தல் பளபளப்பு',
  'Improved Hair Texture': 'மேம்பட்ட கூந்தல் அமைப்பு',
  'Vetiver Cooling Care': 'வெட்டிவேர் குளிர்ச்சி பராமரிப்பு',
  'Scalp Harmony': 'உச்சந்தலை சமநிலை',
  'Long-Lasting Freshness': 'நீடித்த புத்துணர்ச்சி',
  'Healthy Hair Defence': 'ஆரோக்கியமான கூந்தல் பாதுகாப்பு',
  'Supports Natural Hair Darkening': 'இயற்கையான கூந்தல் கருமைக்கு உதவுகிறது',
  'Natural Hair Darkening': 'இயற்கையான கூந்தல் கருமை',
  'Root-to-Tip Nourishment': 'வேர் முதல் நுனி வரை ஊட்டமளிக்கிறது',
  'Herbal Scalp Rejuvenation': 'மூலிகை உச்சந்தலை புத்துணர்ச்சி',
  'Botanical Hair Revival': 'மூலிகை கூந்தல் புத்துயிர்',
  'Baby-Safe Formula': 'குழந்தைகளுக்கு பாதுகாப்பானது',
  'Ultra-Gentle Cleansing': 'மிக மென்மையான தூய்மை',
  'Soft & Healthy Hair': 'மென்மையான ஆரோக்கியமான கூந்தல்',
  'Sensitive Scalp Care': 'உணர்திறன் உச்சந்தலை பராமரிப்பு',
  'Improves Scalp Circulation': 'உச்சந்தலை இரத்த ஓட்டத்தை மேம்படுத்துகிறது',
  'Balances Scalp Oil': 'உச்சந்தலை எண்ணெய் சமநிலை',
  'Activates Hair Follicles': 'கூந்தல் வேர்களை தூண்டுகிறது',
  'Soap-Free Herbal Cleansing': 'சோப் இல்லாத மூலிகை தூய்மை',
  'Scalp Detox Care': 'உச்சந்தலை நச்சு நீக்கம்',
  'Build-Up Free Scalp': 'அழுக்கற்ற சுத்தமான உச்சந்தலை',
  'Nature-Powered Cleansing': 'இயற்கை மூலிகை தூய்மை',
  'smooth hair': 'மிருதுவான கூந்தல்',
  'Soft & Hydrated Hair': 'மென்மையான ஈரப்பத கூந்தல்',
  'Deep Herbal Cleanse': 'ஆழ்ந்த மூலிகை தூய்மை',
  'Follicle Strengthening': 'கூந்தல் வேர்களை பலப்படுத்துதல்',
  'Glossy Hair Finish': 'பளபளப்பான கூந்தல் பொலிவு',
  'Growth-Focused Hair Care': 'முடி வளர்ச்சிக்கான பராமரிப்பு',
  'Intensive Hair Nutrition': 'தீவிர கூந்தல் ஊட்டச்சத்து',
  'Prevents Hair Breakage': 'முடி உடைவதை தடுக்கிறது',
  'Maintains Natural Oils': 'இயற்கை எண்ணெய்களை தக்கவைக்கிறது',
  'Reduces Scalp Itchiness': 'உச்சந்தலை அரிப்பை குறைக்கிறது',
  'Fuller-Looking Hair': 'அடர்த்தியான கூந்தல் தோற்றம்',
  'Detangles Hair Naturally': 'இயற்கையாக சிக்குகளை நீக்குகிறது',
  'Scalp Purity': 'உச்சந்தலை தூய்மை',
  'Silky Hair Finish': 'பட்டு போன்ற கூந்தல் பொலிவு',
  'Silky Hair Feel': 'பட்டு போன்ற கூந்தல் உணர்வு',
  'Soothes Scalp Irritation': 'உச்சந்தலை எரிச்சலை தணிக்கிறது',
  'Pure Scalp Care': 'தூய உச்சந்தலை பராமரிப்பு',
  'Vitamin C Hair Care': 'வைட்டமின் சி கூந்தல் பராமரிப்பு',
  'Repairs Damage': 'சேதத்தை சரிசெய்கிறது',
  'Chemical-Free Coloring': 'ரசாயனமற்ற நிறமூட்டல்',
  'Conditions Hair Naturally': 'கூந்தலுக்கு இயற்கை கண்டிஷனிங்',
  'Safe for Sensitive Scalps': 'உணர்திறன் உச்சந்தலைக்கு பாதுகாப்பானது',
  'Strengthens Hair Fibers (Unlike chemical dyes)': 'கூந்தல் இழைகளை வலுப்படுத்துகிறது',
  'Natural Hair Colour': 'இயற்கை கூந்தல் நிறம்',
  'Delays Premature Greying': 'இளநரையை தள்ளிப்போடுகிறது',
  'Controls Dandruff': 'பொடுகை கட்டுப்படுத்துகிறது',
  'Helps Prevent Lice': 'பேன் தொல்லையை தடுக்கிறது',
  'Strengthens Roots': 'வேர்களை வலுப்படுத்துகிறது',
  'Reduces Hair Fall': 'முடி உதிர்வை குறைக்கிறது',
  'Adds Natural Shine': 'இயற்கையான பளபளப்பை தருகிறது',
  'Improves Scalp Health': 'உச்சந்தலையின் ஆரோக்கியத்தை மேம்படுத்துகிறது',
  'Repairs Split Ends': 'பிளவுபட்ட முடிகளை சரிசெய்கிறது',
  'Nourishes Hair Follicles': 'முடி கால்களுக்கு ஊட்டமளிக்கிறது',
  'Promotes Hair Growth': 'முடி வளர்ச்சியை தூண்டுகிறது',
  'Adds Volume': 'முடிக்கு அடர்த்தியை தருகிறது',
  'Prevents Greying': 'நரை முடி வருவதை தடுக்கிறது',
  'Softens Hair Texture': 'முடியின் அமைப்பை மென்மையாக்குகிறது',
  'Detangles Frizz': 'சுருள் முடியை சீராக்குகிறது',
  'Healthy Hair Appearance': 'ஆரோக்கியமான கூந்தல் தோற்றம்',

  // Skin Care & Glow
  'Cooling Hydration': 'குளிர்ச்சியான நீரேற்றம்',
  'Soothing Care': 'ஆறுதலளிக்கும் கவனிப்பு',
  'Moisture Lock': 'ஈரப்பதம் பூட்டுதல்',
  'Daily Nourishment': 'தினசரி ஊட்டச்சத்து',
  'Youthful Care': 'இளமைப் பராமரிப்பு',
  'Rose Hydration': 'ரோஜா நீரேற்றம்',
  'Daily Refreshment': 'தினசரி புத்துணர்ச்சி',
  'Refreshing Aroma': 'புத்துணர்ச்சியூட்டும் நறுமணம்',
  'Lightweight Care': 'லேசான பராமரிப்பு',
  'smoothskin': 'மிருதுவான சருமம்',
  'good': 'சிறந்த தரம்',
  'Detoxifies Skin': 'சரும நச்சுக்களை நீக்குகிறது',
  'Improves Blood Circulation': 'இரத்த ஓட்டத்தை மேம்படுத்துகிறது',
  'Removes Excess Oil': 'அதிகப்படியான எண்ணெயை நீக்குகிறது',
  'Refines Pores': 'சரும துளைகளை சீராக்குகிறது',
  'Skin Comfort': 'சரும ஆறுதல்',
  'Soft Skin Feel': 'மென்மையான சரும உணர்வு',
  'Anti-inflammatory (Reduces swelling and irritation)': 'வீக்கம் மற்றும் எரிச்சல் குறைப்பு',
  'Controls Acne': 'பருக்களை கட்டுப்படுத்துகிறது',
  'Improves Texture': 'சரும அமைப்பை மேம்படுத்துகிறது',
  'Natural Astringent': 'இயற்கை சுருக்கி',
  'Fades Sun Damage': 'வெயில் பாதிப்பை நீக்குகிறது',
  'Vitamin C Boost': 'வைட்டமின் சி சத்து',
  'Supports collagen': 'கொலாஜன் உற்பத்திக்கு உதவுகிறது',
  'Brightens skin': 'சருமத்தை பொலிவாக்குகிறது',
  'Pimple Reduction': 'முகப்பரு குறைப்பு',
  'Dark Spot Minimization': 'கரும்புள்ளிகள் குறைப்பு',
  'Non-greasy Hydration': 'பிசுபிசுப்பற்ற நீரேற்றம்',
  'Skin Repair': 'சரும சீரமைப்பு',
  'Softens Skin': 'சருமத்தை மென்மையாக்குகிறது',
  'Natural Cleanser': 'இயற்கை சுத்தப்படுத்தி',
  'Gentle Exfoliation ( Removes dead cells without harsh scrubbing )': 'மென்மையான இறந்த செல்கள் நீக்கம்',
  'Balances Skin Tone': 'சரும நிறத்தை சீராக்குகிறது',
  'Vitamin-Rich Nourishment': 'வைட்டமின் ஊட்டச்சத்து',
  'pH Balance Support': 'pH சமநிலை பராமரிப்பு',
  'Gentle Hydration': 'மென்மையான நீரேற்றம்',
  'Skin Barrier Support': 'சரும பாதுகாப்பு அடுக்கு',
  'Soft & Supple Skin': 'மென்மையான பளபளப்பான சருமம்',
  'Reduces Facial Hair Appearance': 'தேவையற்ற முக முடிகளை குறைக்க உதவுகிறது',
  'Purifies skin': 'சருமத்தை தூய்மைப்படுத்துகிறது',
  'Anti-bacterial Action (Prevents pimples and infections)': 'பாக்டீரியா எதிர்ப்பு நடவடிக்கை',
  'Promotes healthy glow': 'ஆரோக்கியமான பொலிவை தருகிறது',
  'Natural Scrub': 'இயற்கை ஸ்க்ரப்',
  'Tan Remover': 'கருமை நீக்கி',
  'Oil & Pore Control': 'எண்ணெய் மற்றும் துளை கட்டுப்பாடு',
  'Balances sebum': 'செபம் சமநிலை',
  'Glow Provider': 'பளபளப்பான பொலிவு',
  'Skin Cooling Therapy': 'சரும குளிர்ச்சி சிகிச்சை',
  'Scar & Spot Reduction': 'தழும்புகள் & புள்ளிகள் குறைப்பு',
  'Complexion Brightener': 'சரும நிறத்தை பொலிவாக்கும்',
  'Acne Fighter': 'முகப்பரு எதிர்ப்பு',
  'Brightens Skin Tone': 'சரும நிறத்தை பொலிவாக்குகிறது',
  'Antioxidant Shield': 'ஆன்டிஆக்ஸிடன்ட் கவசம்',
  'Elasticity Boost': 'சரும நெகிழ்வுத்தன்மை அதிகரிப்பு',
  'Hydrates Skin': 'சருமத்திற்கு ஈரப்பதம் தருகிறது',
  'Anti Aging': 'முதுமை தடுப்பு',
  'Radiant Glow': 'பிரகாசமான பொலிவு',
  'Hydrating Toner': 'நீரேற்றும் டோனர்',
  'Oil-Free Freshness': 'எண்ணெய் பசை இல்லாத புத்துணர்ச்சி',
  'Daily Skin Mist': 'தினசரி சரும மிஸ்ட்',
  'Face Pack Booster': 'ஃபேஸ் பேக் ஊக்கி',
  'Dryness Relief': 'வறட்சி நிவாரணம்',
  'Chemical-Free Care': 'ரசாயனமற்ற பராமரிப்பு',
  'Redness Relief': 'சிவத்தல் நிவாரணம்',
  'Healing Aid': 'குணப்படுத்தும் உதவி',
  'Texture Refiner': 'சரும அமைப்பு சீராக்கி',
  'Anti-aging Support': 'முதுமை எதிர்ப்பு ஆதரவு',
  'Blemish Control': 'கரும்புள்ளி கட்டுப்பாடு',
  'Fights Acne & Blemishes': 'முகப்பரு & கரும்புள்ளி எதிர்ப்பு',
  'Deep Detox': 'ஆழ்ந்த நச்சு நீக்கம்',
  'Oil Control': 'எண்ணெய் கட்டுப்பாடு',
  'Fresh Matte Finish': 'மேட் ஃபினிஷ் பொலிவு',
  'Acne Care': 'முகப்பரு பராமரிப்பு',
  'Skin Purifying Care': 'சரும தூய்மை பராமரிப்பு',
  'Clear Skin Support': 'தெளிவான சரும ஆதரவு',
  'Fresh Skin Feel': 'புத்துணர்ச்சியான சரும உணர்வு',
  'Baby Skin Care': 'குழந்தை சரும பராமரிப்பு',
  'Gentle Skin Comfort': 'மென்மையான சரும இதம்',
  'Tender Skin Nourishment': 'மென்மையான சரும ஊட்டச்சத்து',
  'Sensitive Skin Friendly': 'உணர்திறன் சருமத்திற்கு ஏற்றது',
  'Natural Glow Enhancer': 'இயற்கை பொலிவு மேம்படுத்தி',
  'Mild Cleanser': 'மிதமான சுத்தப்படுத்தி',
  'Softening Effect': 'மென்மையாக்கும் விளைவு',
  'Vitamin Care': 'வைட்டமின் கவனிப்பு',
  'Creamy Moisture Care': 'கிரீமி ஈரப்பத பராமரிப்பு',
  'Anti-allergy Care': 'ஒவ்வாமை எதிர்ப்பு கவனிப்பு',
  'Even Tone Support': 'சமமான சரும நிறம்',
  'Herbal Blend': 'தூய மூலிகை கலவை',
  'Traditional Blend': 'பாரம்பரிய கலவை',
  'Skin Clarity': 'சரும தெளிவு',
  'Gentle Daily Wash': 'மென்மையான தினசரி குளியல்',
  'All-Day Freshness': 'நாள் முழுவதும் புத்துணர்ச்சி',
  'Pore Clearing': 'துளைகளை சுத்தப்படுத்துதல்',
  'Brightness Boost': 'பொலிவை அதிகரிக்கிறது',
  'Gentle Skin Exfoliation': 'மென்மையான சரும உரித்தல்',
  'Face Pack Base': 'ஃபேஸ் பேக் அடிப்படை',
  'Tone Refinement': 'சரும நிற சீரமைப்பு',
  'Balanced Cleanse': 'சமநிலையான தூய்மை',
  'Mineral Soothing': 'தாதுக்கள் ஊட்டமளிப்பு',
  'Anti-dullness': 'மங்கல் எதிர்ப்பு',
  'Contains papain enzyme': 'பப்பேன் என்சைம் நிறைந்தது',
  'Rich in Vitamins A & C': 'வைட்டமின் A & C நிறைந்தது',
  'Scar Lightening': 'தழும்புகளை மறைய செய்கிறது',
  'Gentle Brightening': 'மென்மையான பொலிவு',
  'Antibacterial': 'பாக்டீரியா எதிர்ப்பு',
  'Antifungal': 'பூஞ்சை எதிர்ப்பு',
  'Healing Support ( cuts and rashes )': 'காயங்கள் மற்றும் தடிப்புகள் குணமளிப்பு',
  'Healthy Skin Defense': 'ஆரோக்கியமான சரும பாதுகாப்பு',
  'Helps with acne-prone skin': 'பருக்கள் உள்ள சருமத்திற்கு சிறந்தது',
  'Complexion Enhancer': 'சரும நிற மேம்படுத்தி',
  'Blemish Reducer': 'கரும்புள்ளிகள் குறைப்பான்',
  'Calming Care': 'அமைதிப்படுத்தும் கவனிப்பு',
  'Traditional Glow': 'பாரம்பரிய பொலிவு',
  'Natural Antiseptic': 'இயற்கை கிருமி நாசினி',
  'Cooling Effect': 'குளிர்ச்சி விளைவு',
  'Anti-fungal Support': 'பூஞ்சை எதிர்ப்பு ஆதரவு',
  'Herbal Nourishment': 'மூலிகை ஊட்டச்சத்து',
  'Suitable for skin and hair': 'சருமம் மற்றும் கூந்தலுக்கு ஏற்றது',
  'Radiance Reviver': 'பொலிவை மீட்டெடுக்கும்',
  'Floral Indulgence': 'மலர் நறுமண மகிழ்ச்சி',
  'Pure Milk Goodness': 'தூய பால் நன்மைகள்',
  'Milk-Rich Nourishment': 'பால் சத்து ஊட்டச்சத்து',
  'Skin Revitalizing Care': 'சரும புத்துயிர் பராமரிப்பு',
  'Mild Skin Cleanser': 'மிதமான சரும சுத்தப்படுத்தி',
  'Multi-Purpose  (culinary and skincare purposes )': 'பல்நோக்கு பயன்பாடு',
  'Brightens Tone': 'நிறத்தை பொலிவாக்குகிறது',
  'Cooling Therapy': 'குளிர்ச்சி சிகிச்சை',
  'Soothes Irritation': 'எரிச்சலை தணிக்கிறது',
  'Sun Damage Care': 'சூரிய பாதிப்பு பராமரிப்பு',
  'Pigmentation Care': 'மங்கு மற்றும் நிறமி பராமரிப்பு',
  'Detoxifying Effect': 'நச்சு நீக்கும் விளைவு',
  'Removes skin dullness': 'சரும மங்கலை நீக்குகிறது',
  'Gentle daily cleanser': 'மென்மையான தினசரி சுத்தப்படுத்தி',
  'Reduces scar': 'தழும்புகளை குறைக்கிறது',
  'Gives youthful glow': 'இளமைப் பொலிவை தருகிறது',
  'Moisturizing': 'ஈரப்பதம் அளிக்கிறது',
  'Skin Softener': 'சருமத்தை மென்மையாக்குகிறது',
  'Dark Patch Reducer': 'கருந்திட்டு குறைப்பான்',
  'Odor Control': 'உடல் துர்நாற்ற கட்டுப்பாடு',
  'Purifying Action': 'தூய்மைப்படுத்தும் செயல்பாடு',
  'Inflammation Relief': 'அழற்சி நிவாரணம்',
  'Refreshing Cleanser': 'புத்துணர்ச்சியூட்டும் சுத்தப்படுத்தி',
  'Stress-Calming Bath': 'மன அழுத்தத்தை போக்கும் குளியல்',
  'Skin Immunity Boost': 'சரும நோய் எதிர்ப்பு சக்தி அதிகரிப்பு',

  // Health, Wellness & Oral Care
  'Digestive Cleanser': 'செரிமான தூய்மை',
  'Boosts Metabolism': 'வளர்சிதை மாற்றத்தை அதிகரிக்கிறது',
  'Supports Immunity': 'நோய் எதிர்ப்பு சக்தி ஆதரவு',
  'Anti-aging Wellness': 'முதுமை எதிர்ப்பு ஆரோக்கியம்',
  'Immune Booster': 'நோய் எதிர்ப்பு சக்தி ஊக்கி',
  'Digestive Aid': 'செரிமான உதவி',
  'Natural Refresher when added to tea': 'தேநீரில் சேர்க்கும் இயற்கை புத்துணர்ச்சி',
  'Natural Teeth Whitening': 'இயற்கையான பல் வெண்மையாக்கல்',
  'Removes Tooth Stains': 'பல் கறைகளை நீக்குகிறது',
  'Fresh Breath Care': 'புத்துணர்ச்சியான சுவாச பராமரிப்பு',
  'Gum & Enamel Strength': 'ஈறுகள் & எனாமல் உறுதி',
  'Absorbent Protection': 'உறிஞ்சும் பாதுகாப்பு',
  'Breathable comfort': 'சுவாச காற்றோட்ட வசதி',
  'Gentle on skin': 'சருமத்திற்கு மிகவும் மென்மையானது',
  'Helps Reduce Itching': 'அரிப்பை குறைக்க உதவுகிறது',
  'Leak Guard': 'கசிவு தடுப்பு',
  'Skin-Friendly Care': 'சருமத்திற்கு உகந்த பராமரிப்பு',
  'Convenience': 'பயன்படுத்த எளிதானது',
  'Joint Pain Relief': 'மூட்டு வலி நிவாரணம்',
  'Bone & Muscle Strengthener': 'எலும்பு மற்றும் தசை பலப்படுத்தி',
  'Multi-herbal Blend': 'பல்வேறு மூலிகை கலவை',
  'Circulation Support': 'இரத்த ஓட்ட ஆதரவு',
  'Healthy Gum Support': 'ஆரோக்கியமான ஈறுகள் ஆதரவு',
  'Oral Freshness': 'வாய் புத்துணர்ச்சி',
  'Plaque Control': 'பல் காரை கட்டுப்பாடு',
  'Dental Strength': 'பல் உறுதி',

  // Drinks, Sweets & Teas
  'Refreshing Daily Brew': 'புத்துணர்ச்சியூட்டும் தினசரி பானம்',
  'Natural Antioxidant Support': 'இயற்கை ஆன்டிஆக்ஸிடன்ட் ஆதரவு',
  'Boosts Focus & Alertness': 'கவனம் மற்றும் விழிப்புணர்வை அதிகரிக்கிறது',
  'Smooth Energy Lift': 'மென்மையான ஆற்றல் ஊக்கம்',
  'Natural Sweetener': 'இயற்கை இனிப்பூட்டி',
  'Rich in Minerals': 'தாதுக்கள் நிறைந்தது',
  'Made from Pure Sugarcane': 'தூய கரும்பில் இருந்து தயாரிக்கப்பட்டது',
  'Better Than Refined Sugar': 'சுத்திகரிக்கப்பட்ட சர்க்கரையை விட சிறந்தது',
  'Rose-Infused Hydration': 'ரோஜா கலந்த நீரேற்றம்',
  'Soothes Sensitive Skin': 'உணர்திறன் வாய்ந்த சருமத்தை அமைதிப்படுத்துகிறது',
  'Helps Reduce Blackheads': 'கரும்புள்ளிகளை குறைக்க உதவுகிறது',
  'Unclogs Pores': 'சரும துளைகளை அடைப்பை நீக்குகிறது',
  'Brightens Skin': 'சருமத்தை பொலிவாக்குகிறது',
  'Natural Face Pack Base': 'இயற்கையான ஃபேஸ் பேக் அடிப்படை',
  'Immune Shield': 'நோய் எதிர்ப்பு கவசம்',
  'Respiratory Care': 'சுவாச பாதுகாப்பு',
  'Throat Comfort': 'தொண்டை இதம்',
  'Liver Wellness': 'கல்லீரல் ஆரோக்கியம்',
  'Herbal Cold Relief ( Seasonal Wellness )': 'மூலிகை சளி நிவாரணம்',
  'Natural Body Warmth': 'இயற்கை உடல் கதகதப்பு',
  'Respiratory Comfort': 'சுவாச ஆறுதல்',
  'Digestive Support': 'செரிமான ஆதரவு',
  'Inner Body Cooling': 'உடல் குளிர்ச்சி',
  'Radiant Skin Support': 'பளபளப்பான சரும ஆதரவு',
  'Natural Body Cleanse': 'இயற்கை உடல் தூய்மை',
  'Herbal Rejuvenation': 'மூலிகை புத்துணர்ச்சி',
  'Polyphenol-Rich Goodness': 'பாலிபினால் நிறைந்த நன்மைகள்',
  'Supports Glucose Balance': 'குளுக்கோஸ் சமநிலைக்கு உதவுகிறது',
  'Heart-Friendly Botanicals': 'இதயத்திற்கு உகந்த மூலிகைகள்',
  'Metabolic Balance Support': 'வளர்சிதை மாற்ற சமநிலை ஆதரவு',
  'Deeply Moisturizes Skin': 'சருமத்திற்கு ஆழ்ந்த ஈரப்பதம் அளிக்கிறது',
  'Gently Cleanses Without Drying': 'வறட்சி இல்லாமல் மென்மையாக சுத்தம் செய்யும்',
  'Leaves Skin Soft & Smooth': 'சருமத்தை மென்மையாகவும் மிருதுவாகவும் மாற்றும்',
  'Suitable for Daily Use': 'தினசரி பயன்பாட்டிற்கு ஏற்றது',
  'Clears Blemishes': 'கரும்புள்ளிகளை நீக்குகிறது',
  'Deep Hydration': 'ஆழ்ந்த நீரேற்றம்',
  'Anti-aging Properties': 'முதுமை எதிர்ப்பு பண்புகள்',
  'Reduces Pigmentation': 'நிறமிகளை குறைக்கிறது',
  'Tightens Pores': 'துளைகளை இறுக்குகிறது',
  'Soothes Sunburns': 'சூரிய ஒளியினால் ஏற்படும் எரிச்சலை தணிக்கிறது',
  'Calms Irritated Skin': 'எரிச்சலூட்டும் சருமத்தை அமைதிப்படுத்துகிறது',
  'Removes Tan': 'சருமக் கருமையை நீக்குகிறது',
  'Fights Acne': 'முகப்பருவை எதிர்த்து போராடுகிறது',
  'Improves Skin Texture': 'சருமத்தின் அமைப்பை மேம்படுத்துகிறது',
  'Provides Radiant Glow': 'பளபளப்பான பொலிவைத் தருகிறது',
  'Exfoliates Dead Cells': 'இறந்த செல்களை நீக்குகிறது',
  'Boosts Immunity': 'நோய் எதிர்ப்பு சக்தியை அதிகரிக்கிறது',
  'Improves Digestion': 'செரிமானத்தை மேம்படுத்துகிறது',
  'Rich in Iron': 'இரும்புச்சத்து நிறைந்தது',
  'Increases Energy': 'ஆற்றலை அதிகரிக்கிறது',
  'Enhances Stamina': 'உடலின் வலிமையை அதிகரிக்கிறது',
  'Purifies Blood': 'இரத்தத்தை சுத்திகரிக்கிறது',
  'Supports Bone Health': 'எலும்பு ஆரோக்கியத்திற்கு உதவுகிறது',
  'Improves Metabolism': 'வளர்சிதை மாற்றத்தை மேம்படுத்துகிறது',
  'Rich in Antioxidants': 'ஆன்டிஆக்ஸிடன்ட்கள் நிறைந்தது',
  'Relieves Stress': 'மன அழுத்தத்தை குறைக்கிறது',
  'Promotes Overall Wellness': 'ஒட்டுமொத்த ஆரோக்கியத்தை மேம்படுத்துகிறது',
  '100% Natural Ingredients': '100% இயற்கை பொருட்கள்'
};

const translateBenefit = (benefit, lang) => {
  if (lang !== 'ta' || !benefit || typeof benefit !== 'string') return benefit;
  const trimmed = benefit.trim();
  if (BENEFIT_TRANSLATIONS[trimmed]) return BENEFIT_TRANSLATIONS[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [k, v] of Object.entries(BENEFIT_TRANSLATIONS)) {
    if (k.toLowerCase() === lower) return v;
  }

  const cleaned = lower.replace(/[()\-]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const [k, v] of Object.entries(BENEFIT_TRANSLATIONS)) {
    if (k.toLowerCase().replace(/[()\-]/g, ' ').replace(/\s+/g, ' ').trim() === cleaned) return v;
  }

  return trimmed;
};

const DESCRIPTION_TRANSLATIONS = {
  1217: "ஆவாரம்பூ மஞ்சள் சோப்பு என்பது சேதமடைந்த சருமத்தை மெதுவாக சரிசெய்ய வடிவமைக்கப்பட்ட ஒரு மூலிகை கலவையாகும், அதே நேரத்தில் ஒவ்வாமை மற்றும் எரிச்சலைக் குறைக்க உதவுகிறது. ஆவாரம்பூ மற்றும் மஞ்சளின் இயற்கையான நன்மையால் செறிவூட்டப்பட்ட இது, சருமத்தை குணப்படுத்த உதவுகிறது, வீக்கத்தைத் தணிக்கிறது, மேலும் சருமத்தின் நிறத்தை மேம்படுத்துகிறது."
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRefs = useRef([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [currentSlide, setCurrentSlide] = useState(0);


  useEffect(() => {
    
      const fetchReviewsAndSummary = async () => {
        if (!id) return;

        // INJECT HIBISCUS AND ONION AND RICE KANJI REVIEWS
        const currentProduct = products.find(p => p.id === parseInt(id));
        if (currentProduct && currentProduct.name) {
            const n = currentProduct.name.toLowerCase().trim();
            if (n === 'chemparuthi herbal shampoo') {
                const hardcodedReviews = [
                    { id: 'h1', name: 'Karthik', date: '1/29/2026', rating: 5.0, text: 'Super product', initial: 'K', color: '#3b82f6' },
                    { id: 'h2', name: 'haris raj', date: '3/31/2026', rating: 5.0, text: 'good natural product no side effects', initial: 'H', color: '#10b981' },
                    { id: 'h3', name: 'Sanjaykrish', date: '3/31/2026', rating: 5.0, text: 'Smells good and reduce hair fall', initial: 'S', color: '#f59e0b' },
                    { id: 'h4', name: 'Sivakami S', date: '4/1/2026', rating: 5.0, text: 'Really help to reduce hair fall and make hair very shine', initial: 'S', color: '#ef4444' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 4,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 4 }
                });
                return;
            }
            if (n === 'onion shampoo') {
                const hardcodedReviews = [
                    { id: 'o1', name: 'L kokila', date: '9/2/2025', rating: 5.0, text: 'Good', initial: 'L', color: '#8b5cf6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
            if (n === 'rice kanji shampoo') {
                const hardcodedReviews = [
                    { id: 'rk1', name: 'Geetha', date: '3/31/2026', rating: 5.0, text: 'I received a sample of their newly updated rice water shampoo, and I tried it immediately. It’s absolutely amazing! The texture feels smooth, it lathers well, and my hair feels nourished and refreshed.', initial: 'G', color: '#ec4899' },
                    { id: 'rk2', name: 'G K DHARUN RAJ', date: '4/2/2026', rating: 5.0, text: 'This shampoo is really good and consistency is nice', initial: 'G', color: '#14b8a6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 2,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 }
                });
                return;
            }
            if (n === 'avarampoo pusu manjal jar') {
                const hardcodedReviews = [
                    { id: 'av1', name: 'Karthikeyan', date: '2/12/2026', rating: 4.0, text: 'Nice product', initial: 'K', color: '#f59e0b' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 4.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 }
                });
                return;
            }
            if (n === 'multhani metti jar') {
                const hardcodedReviews = [
                    { id: 'm1', name: 'VARSHA C', date: '3/31/2026', rating: 5.0, text: 'I recently started using Multani Mitti, and even from the very beginning, I could see why it’s considered one of the best natural skincare ingredients. It leaves my skin feeling fresh, clean, and noticeably smoother after every use. I especially love how it absorbs excess oil without making my skin feel too dry.', initial: 'V', color: '#10b981' },
                    { id: 'm2', name: 'haris raj', date: '3/31/2026', rating: 5.0, text: 'I recently tried the 100 gm Mahil Multani Mitti and overall it’s a good budget-friendly skincare product', initial: 'H', color: '#3b82f6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 2,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2 }
                });
                return;
            }
            if (n === 'wild turmeric') {
                const hardcodedReviews = [
                    { id: 'wt1', name: 'Madhan', date: '4/1/2026', rating: 4.0, text: 'Amazing Product!', initial: 'M', color: '#f59e0b' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 4.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 }
                });
                return;
            }
            if (n === 'aloe vera facepack powder jar (for men)') {
                const hardcodedReviews = [
                    { id: 'avm1', name: 'Madhan', date: '4/1/2026', rating: 5.0, text: 'Amazing Product!', initial: 'M', color: '#3b82f6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
            if (n === 'facepack powder(jar)') {
                const hardcodedReviews = [
                    { id: 'fp1', name: 'Dharanya', date: '7/15/2025', rating: 5.0, text: 'The website is easy to navigate.', initial: 'D', color: '#ec4899' },
                    { id: 'fp2', name: 'Lavanya', date: '7/15/2025', rating: 5.0, text: 'Very useful and effective products.', initial: 'L', color: '#8b5cf6' },
                    { id: 'fp3', name: 'Sautanyha', date: '3/30/2026', rating: 5.0, text: 'I’ve been using Dharani Herbbals Facepack Powder for a few weeks now, and I can really see a nice glow on my skin. It feels gentle and has been working well for my daily routine.', initial: 'S', color: '#10b981' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 3,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 3 }
                });
                return;
            }
            if (n === 'nalangu powder jar') {
                const hardcodedReviews = [
                    { id: 'np1', name: 'Madhan', date: '9/24/2025', rating: 5.0, text: 'I’ve been using Nalangu Maavu regularly, and I can really see the difference in my skin. It feels much softer and smoother now. The natural coarse texture works as a gentle exfoliator, removing dead skin without any irritation. Over time, my skin has started to look fresher and has a natural glow. I love that it’s completely natural and chemical-free, making it safe for daily use. Definitely a great alternative to store-bought soaps and face washes!', initial: 'M', color: '#10b981' },
                    { id: 'np2', name: 'Sujatha', date: '7/22/2026', rating: 4.0, text: 'This product is great for regular use. Makes skin softer.', initial: 'S', color: '#f59e0b' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 4.5,
                    total_reviews: 2,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 }
                });
                return;
            }
            if (n === 'multhani metti soap') {
                const hardcodedReviews = [
                    { id: 'mms1', name: 'Sautanyha', date: '3/31/2026', rating: 5.0, text: 'Recently had the opportunity to visit the company during soap manufacturing. It was a great experience to see the process firsthand. I also tried the soaps , they are really good.', initial: 'S', color: '#8b5cf6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
            if (n === 'aloe vera soap') {
                const hardcodedReviews = [
                    { id: 'avs1', name: 'Geetha', date: '4/2/2026', rating: 5.0, text: 'Tried so many products until i found "DHARANI HERBBALS" for my skin issues, but this is one that truly made a difference. My skin feels healthier and more balanced now.', initial: 'G', color: '#10b981' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
            if (n === 'balloon plant oil') {
                const hardcodedReviews = [
                    { id: 'bpo1', name: 'Kasinathan', date: '9/8/2025', rating: 4.0, text: 'Good', initial: 'K', color: '#f59e0b' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 4.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 }
                });
                return;
            }
            if (n === 'amutham nattu charkkarai') {
                const hardcodedReviews = [
                    { id: 'anc1', name: 'Ravikumar', date: '7/17/2026', rating: 5.0, text: 'Good', initial: 'R', color: '#ec4899' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
            if (n === 'karuppu kavuni rice') {
                const hardcodedReviews = [
                    { id: 'kkr1', name: 'Geetha', date: '3/31/2026', rating: 5.0, text: 'As a student, I hardly get time to focus on proper nutrition. I tried Karuppu Kavuni rice to make up for essential vitamins and minerals, and it has been a wonderful choice.', initial: 'G', color: '#10b981' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
            if (n === 'kodo - moringa millet pongal mix 250g') {
                const hardcodedReviews = [
                    { id: 'km1', name: 'sowmiya', date: '7/7/2026', rating: 3.0, text: 'good quality', initial: 'S', color: '#f59e0b' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 3.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 }
                });
                return;
            }
            if (n === 'abc malt (jar)') {
                const hardcodedReviews = [
                    { id: 'abc1', name: 'Sautanyha', date: '3/31/2026', rating: 5.0, text: 'Genuinely delighted with this health mix, the natural aroma is simply wonderful. It gives a sense of purity and nourishment in every sip, and it has become my absolute favorite.', initial: 'S', color: '#10b981' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
            if (n === 'pirandai pickle') {
                const hardcodedReviews = [
                    { id: 'pp1', name: 'Pranesh S', date: '3/31/2026', rating: 5.0, text: 'Awesome Product', initial: 'P', color: '#f59e0b' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }
            if (n === 'ooty varkey') {
                const hardcodedReviews = [
                    { id: 'ov1', name: 'DHIVYA DHARSHINI S', date: '3/31/2026', rating: 5.0, text: 'Varkey for snacks is really delicious! The taste takes me back and beautifully resembles the nostalgic flavors of Ooty.', initial: 'D', color: '#8b5cf6' }
                ];
                setReviews(hardcodedReviews);
                setReviewSummary({
                    average_rating: 5.0,
                    total_reviews: 1,
                    rating_count: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 }
                });
                return;
            }















        }

      try {
        const [revRes, sumRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products/${id}/reviews/`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          }),
          fetch(`${API_BASE_URL}/products/${id}/review-summary/`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          })
        ]);

        if (revRes.ok) {
          const data = await revRes.json();
          if (data && data.reviews) {
            const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
            const mapped = data.reviews.map((r, i) => ({
              id: r.id || Date.now() + i,
              name: r.user_name || r.customer_name || `Customer ${r.user_id || ''}`.trim(),
              date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently',
              rating: r.rating || 5,
              text: r.review_text || r.text || '',
              initial: (r.user_name || r.customer_name || 'C').charAt(0).toUpperCase(),
              color: colors[i % colors.length]
            }));
            setReviews(mapped);
          }
        }

        if (sumRes.ok) {
          const sumData = await sumRes.json();
          setReviewSummary(sumData);
        }
      } catch (err) {
        console.error("Failed to fetch product reviews or summary", err);
      }
    };
    fetchReviewsAndSummary();
  }, [id]);

  const handleReviewSubmit = () => {
    if (!reviewText.trim()) return;
    const newReview = {
      id: Date.now(),
      name: 'You',
      date: 'Just now',
      rating: reviewRating,
      text: reviewText,
      initial: 'Y',
      color: '#10b981'
    };
    setReviews([newReview, ...reviews]);
    setReviewText('');
    setReviewRating(5);
    setCurrentSlide(0);
  };

  // Auto-scroll logic for the slider
  useEffect(() => {
      const slider = sliderRef.current;
      if (!slider || reviews.length <= 2) return;

    let isPaused = false;
    let animationId;

    const handleMouseEnter = () => isPaused = true;
    const handleMouseLeave = () => isPaused = false;

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('touchstart', handleMouseEnter, { passive: true });
    slider.addEventListener('touchend', handleMouseLeave);

    const scroll = () => {
      if (!isPaused) {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft += 0.5; // Decreased Speed adjustment
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
      if (slider) {
        slider.removeEventListener('mouseenter', handleMouseEnter);
        slider.removeEventListener('mouseleave', handleMouseLeave);
        slider.removeEventListener('touchstart', handleMouseEnter);
        slider.removeEventListener('touchend', handleMouseLeave);
      }
    };
  }, [reviews]);

  const { language, translateText, translateProduct, bulkProductNames, t } = useLanguage();

  const product = products.find(p => p.id === parseInt(id));

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (thumbRefs.current && thumbRefs.current[currentImgIndex]) {
      thumbRefs.current[currentImgIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentImgIndex]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [crmGalleryImages, setCrmGalleryImages] = useState([]);
  const [fetchedVariations, setFetchedVariations] = useState([]);
  const [fetchedKeyBenefits, setFetchedKeyBenefits] = useState([]);
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [pinCode, setPinCode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [benefitsExpanded, setBenefitsExpanded] = useState(true);
  const [ingredientsExpanded, setIngredientsExpanded] = useState(true);
  const [ingredientsTab, setIngredientsTab] = useState('key');
  const { addToCart } = useCart();

  const defaultDesc = "Experience the incredible benefits of our completely natural, 100% organic herbal formulation. Carefully crafted using traditional methods and sustainably sourced ingredients to ensure the highest quality for your holistic wellness journey. Free from harmful chemicals, parabens, and artificial preservatives.";

  // Translation states
  const [translatedName, setTranslatedName] = useState(product ? product.name : '');
  const [translatedSubtitle, setTranslatedSubtitle] = useState(product ? product.subtitle : '');
  const [translatedDesc, setTranslatedDesc] = useState(product ? (product.description || defaultDesc) : '');

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentImgIndex(0);
    setQuantity(1);
    setActiveTab('description'); setCrmGalleryImages([]); setFetchedVariations([]); setFetchedKeyBenefits([]);
    let active = true;

    if (id) {
      // Fetch CRM product images for Product Gallery section
      fetch(`${API_BASE_URL}/product-images/${id}/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => {
          if (!res.ok) {
            // Silently ignore 404s as it just means no extra images exist
            if (res.status === 404) return null;
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (active && data) {
            // Check if the response itself is an array, or if it's wrapped in data/success
            let imagesArray = [];
            if (Array.isArray(data)) {
              imagesArray = data;
            } else if (data.data && Array.isArray(data.data)) {
              imagesArray = data.data;
            } else if (data.images && Array.isArray(data.images)) {
              imagesArray = data.images;
            }

            setCrmGalleryImages(imagesArray);
          }
        })
        .catch(err => {
          if (active) console.warn("Failed to fetch CRM product images:", err.message);
        });

      // Fetch CRM product key benefits
      fetch(`${API_BASE_URL}/products/${id}/key-points/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => {
          if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (active && data) {
            // Check if it's an array of strings, or array of objects, or object with data array
            let points = [];
            if (Array.isArray(data)) {
              points = data;
            } else if (data.data && Array.isArray(data.data)) {
              points = data.data;
            } else if (data.key_points && Array.isArray(data.key_points)) {
              points = data.key_points;
            }
            // Map objects to strings if needed. Do not fallback to JSON.stringify if all fields are null.
            points = points.map(p => typeof p === 'object' ? (p.point || p.text || p.title || p.benefit || p.name || null) : p);

            // Filter out null or empty strings
            const validPoints = points.filter(p => p !== null && p !== undefined && p !== '');
            setFetchedKeyBenefits(validPoints);
          }
        })
        .catch(err => {
          if (active) console.warn("Failed to fetch CRM product key benefits:", err.message);
        });

      // Fetch CRM product variations
      fetch(`${API_BASE_URL}/products/${id}/variations/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => {
          if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (active && data && Array.isArray(data)) {
            const formattedVariations = data.map(v => {
              // Check if the user is a store member
              let isStoreMember = false;
              try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                  const userData = JSON.parse(storedUser);
                  isStoreMember = userData.is_store_login ||
                    userData.user?.role === 'staff' ||
                    userData.is_store_member ||
                    userData.role === 'store' ||
                    userData.role === 'store_member' ||
                    userData.user_type === 'store' ||
                    userData.user?.role === 'store' ||
                    userData.user?.role === 'store_member' ||
                    userData.user?.user_type === 'store' ||
                    userData.user?.is_store_member ||
                    userData.is_store;
                }
              } catch (e) { }

              let activePrice = 0;
              let originalPrice = 0;

              if (isStoreMember) {
                activePrice = parseFloat(v.store_price) || parseFloat(v.customer_price) || parseFloat(v.price) || parseFloat(v.sale_price) || parseFloat(v.mrp) || 0;
                originalPrice = parseFloat(v.mrp) || parseFloat(v.original_price) || activePrice;
              } else {
                activePrice = parseFloat(v.customer_price) || parseFloat(v.price) || parseFloat(v.sale_price) || parseFloat(v.mrp) || 0;
                originalPrice = parseFloat(v.mrp) || parseFloat(v.original_price) || activePrice;
              }

              let discount = '';
              if (originalPrice > activePrice) {
                discount = `${Math.round(((originalPrice - activePrice) / originalPrice) * 100)}% OFF`;
              }
              return {
                ...v,
                price: `₹${activePrice.toFixed(0)}`,
                originalPrice: originalPrice > activePrice ? `₹${originalPrice.toFixed(0)}` : '',
                discount: discount
              };
            });
            setFetchedVariations(formattedVariations);
            if (formattedVariations.length > 0) {
              setSelectedVariation(formattedVariations[0]);
            }
          }
        })
        .catch(err => {
          if (active) console.warn("Failed to fetch CRM product variations:", err.message);
        });
    }

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (fetchedVariations.length === 0) {
      if (product && product.variations && product.variations.length > 0) {
        setSelectedVariation(product.variations[0]);
      } else {
        setSelectedVariation(null);
      }
    }
  }, [product?.id, product?.variations, fetchedVariations.length]);

  const translatedRef = useRef(null); // tracks "productId:lang" already translated
  const shareMenuRef = useRef(null);

  useEffect(() => {
    if (!product) return;

    let active = true;

    // Direct assignment for product name
    setTranslatedName(language === 'ta' && product.tamil_name ? product.tamil_name : product.name);

    if (language === 'ta') {
      // 1. Description translation
      if (DESCRIPTION_TRANSLATIONS[product.id]) {
        setTranslatedDesc(DESCRIPTION_TRANSLATIONS[product.id]);
      } else {
        const descText = product.description || defaultDesc;
        translateText(descText).then(res => {
          if (active && res) setTranslatedDesc(res);
        });
      }

      // 2. Subtitle
      if (product.subtitle) {
        translateText(product.subtitle).then(res => {
          if (active && res) setTranslatedSubtitle(res);
        });
      }
    } else {
      setTranslatedSubtitle(product.subtitle);
      setTranslatedDesc(product.description || defaultDesc);
    }

    return () => { active = false; };
  }, [language, product?.id, product?.name, product?.description]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return <div className="pd-pro-wrapper"><div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div></div>;
  }

  if (!product) {
    return (
      <div className="pd-pro-wrapper empty">
        <h2>Product not found!</h2>
        <Link to="/shop" className="btn-pro-primary mt-4" style={{ width: 'auto', textDecoration: 'none', padding: '16px 32px' }}>Return to Shop</Link>
      </div>
    );
  }

  const mediaItems = [];

  if (product.image) {
    mediaItems.push({ type: 'image', src: product.image, thumb: product.image });
  }

  if (crmGalleryImages.length > 0) {
    mediaItems.push(...crmGalleryImages.map(imgObj => ({ type: 'image', src: imgObj.image, thumb: imgObj.image })));
  }

  const currentMedia = mediaItems[currentImgIndex];
  const getProductShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/product/${product.id}`;
  };

  const getShareText = () => {
    return `*${translatedName}* | Dharani Herbbals\n\nShop now on Dharani Herbbals!\n${getProductShareUrl()}`;
  };

  const copyShareLink = async () => {
    const shareUrl = getProductShareUrl();
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1800);
  };

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const shareToInstagram = async () => {
    await copyShareLink();
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const shareNative = async () => {
    const shareUrl = getProductShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: translatedName,
          text: translatedSubtitle || translatedName,
          url: shareUrl
        });
      } catch {
        // User cancelled the native share sheet.
      }
    } else {
      await copyShareLink();
    }
    setShowShareMenu(false);
  };

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (diff > threshold) {
      // Swiped left -> Next image
      const nextIdx = (currentImgIndex + 1) % mediaItems.length;
      setCurrentImgIndex(nextIdx);
    } else if (diff < -threshold) {
      // Swiped right -> Previous image
      const nextIdx = (currentImgIndex - 1 + mediaItems.length) % mediaItems.length;
      setCurrentImgIndex(nextIdx);
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const isFirstSlide = currentImgIndex === 0;
  const isLastSlide = currentImgIndex === mediaItems.length - 1;

  const handlePrevSlide = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isFirstSlide) return;
    setCurrentImgIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (isLastSlide) return;
    setCurrentImgIndex((prev) => Math.min(mediaItems.length - 1, prev + 1));
  };

  return (
    <div className="pd-pro-wrapper">
      {/* Breadcrumbs & Back Button */}
      <div className="pd-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#334155', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flexShrink: 0 }} 
          title="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/">{t('home')}</Link>
          <span className="separator" style={{ margin: '0 8px' }}>/</span>
          <span className="current">{translatedName}</span>
        </div>
      </div>

      <div className="pd-pro-container">
        {/* Left Column: Gallery (Professional Layout) */}
        <div className="pd-pro-gallery">

          {/* Main Media Container */}
          <div 
            className="pd-pro-main-image-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {mediaItems.length > 1 && (
              <>
                <button
                  type="button"
                  className={`pd-gallery-arrow pd-gallery-arrow-prev ${isFirstSlide ? 'disabled' : ''}`}
                  onClick={handlePrevSlide}
                  disabled={isFirstSlide}
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className={`pd-gallery-arrow pd-gallery-arrow-next ${isLastSlide ? 'disabled' : ''}`}
                  onClick={handleNextSlide}
                  disabled={isLastSlide}
                  aria-label="Next Image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <div
              className="pd-pro-image-track"
              ref={trackRef}
            >
              {mediaItems.map((media, idx) => (
                <div 
                  key={idx} 
                  className={`pd-pro-main-image-wrapper ${currentImgIndex === idx ? 'active' : ''}`}
                >
                  {media.type === '3d' ? (
                    <model-viewer
                      src={media.src}
                      alt={translatedName}
                      auto-rotate
                      camera-controls
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#f9fafb', borderRadius: '4px' }}
                    ></model-viewer>
                  ) : (
                    <img
                      src={media.src || '/logo.png'}
                      alt={`${translatedName} - Image ${idx + 1}`}
                      className={`pd-pro-main-image ${
                        media.src && (media.src.includes('/4.jpeg') || media.src.endsWith('4.jpeg') || product?.id === 1301 || (product?.name && product.name.toLowerCase().includes('keelanelli')))
                          ? 'pd-img-zoom-fit'
                          : ''
                      }`}
                      fetchPriority={idx === 0 ? "high" : "auto"}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (e.target.src !== window.location.origin + '/logo.png') {
                          e.target.src = '/logo.png';
                          e.target.style.objectFit = 'contain';
                          e.target.style.padding = '2rem';
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {product.badge && currentMedia && currentMedia.type !== '3d' && (
              <div className={`pro-badge badge-${product.badgeColor}`}>
                {product.badge}
              </div>
            )}

            <div className="pd-pro-image-share">
              <button
                type="button"
                className="pd-image-share-trigger"
                onClick={shareToWhatsApp}
                aria-label="Share on WhatsApp"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Horizontal Thumbnails - ONLY SHOW IF CRM IMAGES EXIST */}
          {crmGalleryImages.length > 0 && (
            <div className="pd-pro-thumbnails-horizontal">
              {mediaItems.map((media, idx) => (
                <div
                  key={idx}
                  ref={(el) => (thumbRefs.current[idx] = el)}
                  className={`pd-pro-thumb ${currentImgIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentImgIndex(idx)}
                >
                  <img
                    src={media.thumb}
                    alt={`Gallery ${idx + 1}`}
                    onError={(e) => {
                      if (!e.target.dataset.retried) {
                        e.target.dataset.retried = 'true';
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information */}
        <div className="pd-pro-info">
          <h1 className="pd-pro-title">{translatedName}</h1>

          <div className="pd-pro-rating">
            <div className="pro-stars">
              <span className="star">★</span>
              <span className="score">{product.rating ? Number(product.rating).toFixed(1) : "0.0"}</span>
            </div>
            <span className="reviews-link">{product.reviews} {language === 'ta' ? 'மதிப்புரைகள்' : 'Reviews'}</span>
          </div>

          <div className="pd-pro-price-block">
            <span className="pro-current-price">{selectedVariation ? selectedVariation.price : product.price}</span>
            {product.weight_volume && !selectedVariation && (
              <span style={{ fontSize: '1.2rem', color: '#6b7280', marginLeft: '10px', fontWeight: '500' }}>
                ({String(product.weight_volume).includes('.') ? parseFloat(product.weight_volume) * 1000 : product.weight_volume} {product.unit && product.unit.toUpperCase() === 'GM' ? 'g' : (product.unit ? product.unit.toLowerCase() : '')})
              </span>
            )}
            <p className="tax-inclusive">{t('taxInclusive')}</p>
          </div>

          {fetchedVariations && fetchedVariations.length > 0 && (
            <div className="pd-premium-variations-wrapper">
              <h4 className="variations-title">{product.variationLabel || (language === 'ta' ? 'எடை / அளவு' : 'Weight / Size')}</h4>
              <div className="premium-variations-grid">
                {fetchedVariations.map((v, idx) => (
                  <div
                    key={idx}
                    className={`premium-variation-card ${selectedVariation === v ? 'active' : ''}`}
                    onClick={() => setSelectedVariation(v)}
                  >
                    {selectedVariation === v && (
                      <div className="premium-variation-check">
                        <CheckCircle size={16} weight="fill" />
                      </div>
                    )}
                    <span className="premium-variation-name">{v.name || v.variation_name || v.weight || 'Variant'}</span>
                    <span className="premium-variation-price">{v.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pd-pro-divider"></div>

          {/* Add to Cart Actions */}
          <div className="pd-premium-actions-wrapper">
            <div className="premium-qty-selector">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="text" value={quantity} readOnly />
              <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <div className="pd-action-buttons-row">
              <button type="button" className="premium-add-btn" onClick={() => addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id)}>
              <ShoppingCart size={20} strokeWidth={2.5} />
              <span>{t('addToCart')}</span>
            </button>
            <button type="button" className="premium-buy-now-btn" onClick={async () => { await addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id, true); navigate('/checkout'); }}><span>{t('buyNow')}</span></button>
            </div>
          </div>

          {/* Ultra-Modern Bento Section */}
          <div className="pd-bento-grid">
            {/* Bento Box 1: Description */}
            <div className="pd-bento-cell bento-desc">
              <div className="pd-bento-header">
                <FileText size={18} className="pd-bento-icon text-indigo" />
                <h3>{t('descriptionLabel')}</h3>
              </div>
              <p className="pd-bento-text">
                {translatedDesc}
              </p>
            </div>

            {/* Bento Box 2: Trust Badges (Compact) */}
            <div className="pd-bento-cell bento-trust">
              <div className="bento-trust-item">
                <Leaf size={16} className="text-emerald" />
                <span>{t('naturalTag')}</span>
              </div>
              <div className="bento-trust-item">
                <ShieldCheck size={16} className="text-blue" />
                <span>{t('labTested')}</span>
              </div>
              <div className="bento-trust-item">
                <Truck size={16} className="text-amber" />
                <span>{t('freeDelivery')}</span>
              </div>
            </div>

            {/* Bento Box 3: Quick Benefits */}
            <div className="pd-bento-cell bento-benefits">
              <div className="pd-bento-header">
                <Star size={18} className="pd-bento-icon text-pink" />
                <h3>{language === 'ta' ? 'முக்கிய நன்மைகள்' : 'Key Benefits'}</h3>
              </div>
              <div className="bento-tags-wrapper">
                {(() => {
                  if (fetchedKeyBenefits && fetchedKeyBenefits.length > 0) {
                    return fetchedKeyBenefits.map((benefit, index) => (
                      <span key={index} className="bento-tag">
                        <CheckCircle size={12} weight="fill" />
                        {translateBenefit(benefit, language)}
                      </span>
                    ));
                  }

                  const name = (product.name || '').toLowerCase();
                  const category = (product.category_name || '').toLowerCase();
                  const idHash = product.id ? product.id : (product.name ? product.name.length : 1);

                  let pool = [];

                  if (name.includes('black tea')) {
                    pool = [
                      "Refreshing Daily Brew", "Natural Antioxidant Support", "Boosts Focus & Alertness", "Smooth Energy Lift"
                    ];
                  } else if (name.includes('jaggery')) {
                    pool = [
                      "Natural Sweetener", "Rich in Minerals", "Made from Pure Sugarcane", "Better Than Refined Sugar"
                    ];
                  } else if (name.includes('rose gel') || name.includes('rose')) {
                    pool = [
                      "Rose-Infused Hydration", "Oil-Free Freshness", "Soothes Sensitive Skin", "Helps Reduce Blackheads"
                    ];
                  } else if (name.includes('green gram')) {
                    pool = [
                      "Gentle Skin Exfoliation", "Unclogs Pores", "Brightens Skin", "Natural Face Pack Base"
                    ];
                  } else if (name.includes('herbal tea')) {
                    pool = [
                      "Immune Shield", "Respiratory Care", "Throat Comfort", "Liver Wellness"
                    ];
                  } else if (name.includes('ginger') && name.includes('coffee')) {
                    pool = [
                      "Herbal Cold Relief ( Seasonal Wellness )", "Natural Body Warmth", "Respiratory Comfort", "Digestive Support"
                    ];
                  } else if (name.includes('aavaram')) {
                    pool = [
                      "Inner Body Cooling", "Radiant Skin Support", "Natural Body Cleanse", "Herbal Rejuvenation"
                    ];
                  } else if (name.includes('guava')) {
                    pool = [
                      "Polyphenol-Rich Goodness", "Supports Glucose Balance", "Heart-Friendly Botanicals", "Metabolic Balance Support"
                    ];
                  } else if (name.includes('coconut') || name.includes('soap')) {
                    pool = [
                      "Deeply Moisturizes Skin", "Gently Cleanses Without Drying",
                      "Leaves Skin Soft & Smooth", "Suitable for Daily Use"
                    ];
                  } else if (name.includes('karisalankanni') || name.includes('karisalankanni shampoo')) {
                    pool = [
                      "Supports Natural Hair Darkening", "Root-to-Tip Nourishment", "Herbal Scalp Rejuvenation", "Botanical Hair Revival"
                    ];
                  } else if (name.includes('hair') || category.includes('hair') || name.includes('shampoo') || name.includes('oil')) {
                    pool = [
                      "Strengthens Roots", "Reduces Hair Fall", "Adds Natural Shine", "Improves Scalp Health",
                      "Controls Dandruff", "Repairs Split Ends", "Nourishes Hair Follicles", "Promotes Hair Growth",
                      "Adds Volume", "Prevents Greying", "Softens Hair Texture", "Detangles Frizz"
                    ];
                  } else if (name.includes('face') || name.includes('skin') || name.includes('glow') || category.includes('skin') || name.includes('maavu') || name.includes('gel')) {
                    pool = [
                      "Brightens Skin Tone", "Clears Blemishes", "Deep Hydration", "Anti-aging Properties",
                      "Reduces Pigmentation", "Tightens Pores", "Soothes Sunburns", "Calms Irritated Skin",
                      "Removes Tan", "Fights Acne", "Improves Skin Texture", "Provides Radiant Glow", "Exfoliates Dead Cells"
                    ];
                  } else {
                    pool = [
                      "Boosts Immunity", "Improves Digestion", "Rich in Iron", "Increases Energy",
                      "Enhances Stamina", "Purifies Blood", "Supports Bone Health", "Improves Metabolism",
                      "Rich in Antioxidants", "Relieves Stress", "Promotes Overall Wellness", "100% Natural Ingredients"
                    ];
                  }

                  let benefits = [];
                  if (pool.length <= 4) {
                    benefits = [...pool];
                  } else {
                    const maxStartIndex = Math.max(1, pool.length - 4);
                    const startIndex = idHash % maxStartIndex;
                    const step = (idHash % 3) + 1;

                    for (let i = 0; i < 4; i++) {
                      benefits.push(pool[(startIndex + (i * step)) % pool.length]);
                    }
                  }

                  return benefits.map((benefit, index) => (
                    <span key={index} className="bento-tag">
                      <CheckCircle size={12} weight="fill" />
                      {translateBenefit(benefit, language)}
                    </span>
                  ));
                })()}
              </div>
            </div>

            {/* Bento Box 4: Delivery */}
            <div className="pd-bento-cell bento-delivery">
              <div className="pd-bento-header">
                <Truck size={18} className="pd-bento-icon text-indigo" />
                <h3>{language === 'ta' ? 'டெலிவரி சரிபார்ப்பு' : 'Delivery Check'}</h3>
              </div>
              <div className="bento-pincode-wrapper">
                <input
                  type="text"
                  placeholder={language === 'ta' ? '6 இலக்க PIN எண்ணை உள்ளிடவும்' : 'Enter 6-digit PIN'}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bento-input"
                />
                <button
                  type="button"
                  className="bento-btn"
                  onClick={() => {
                    if (pinCode.length === 6) {
                      const firstDigit = pinCode.charAt(0);
                      if (firstDigit === '6') {
                        setDeliveryMessage(language === 'ta' ? '2-3 வேலை நாட்களில் டெலிவரி செய்யப்படும்.' : 'Delivery in 2-3 working days.');
                      } else if (firstDigit === '5') {
                        setDeliveryMessage(language === 'ta' ? '3-4 வேலை நாட்களில் டெலிவரி செய்யப்படும்.' : 'Delivery in 3-4 working days.');
                      } else if (['1', '2', '3', '4', '7', '8', '9'].includes(firstDigit)) {
                        setDeliveryMessage(language === 'ta' ? '5-7 வேலை நாட்களில் டெலிவரி செய்யப்படும்.' : 'Delivery in 5-7 working days.');
                      } else {
                        setDeliveryMessage(language === 'ta' ? '3-5 வேலை நாட்களில் டெலிவரி செய்யப்படும்.' : 'Delivery in 3-5 working days.');
                      }
                    }
                    else setDeliveryMessage(language === 'ta' ? 'சரியான 6 இலக்க PIN எண்ணை உள்ளிடவும்.' : 'Enter a valid 6-digit PIN.');
                  }}
                >
                  {language === 'ta' ? 'சரிபார்க்கவும்' : 'Verify'}
                </button>
              </div>
              {deliveryMessage && (
                <p className={`bento-delivery-msg ${deliveryMessage.includes('Enter') || deliveryMessage.includes('சரியான') ? 'error' : 'success'}`}>
                  {deliveryMessage}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="pd-pro-divider pd-reviews-divider"></div>

      {/* Modern Customer Reviews Section */}
      <div className="pd-reviews-section">
        <h2 className="pd-reviews-main-title">{language === 'ta' ? 'வாடிக்கையாளர் மதிப்புரைகள்' : 'Customer Reviews'}</h2>

        <div className="pd-reviews-layout">
          {/* Left Side: Rating Summary Card */}
          <div className="pd-summary-card-left">
            <span className="pd-big-rating">{reviewSummary ? Number(reviewSummary.average_rating).toFixed(1) : "0.0"}</span>
            <div className="pd-overall-stars">
              {[1, 2, 3, 4, 5].map((star) => {
                const avg = reviewSummary ? Number(reviewSummary.average_rating) : 0;
                const fill = star <= avg ? "#16a34a" : "transparent";
                return <Star key={star} className="pd-summary-star" fill={fill} color="#16a34a" />;
              })}
            </div>
            <div className="pd-summary-sentiment">
              {language === 'ta'
                ? ((reviewSummary && reviewSummary.average_rating >= 4) ? 'மிகச்சிறந்தது' : (reviewSummary && reviewSummary.average_rating >= 3) ? 'நல்லது' : 'சராசரி')
                : ((reviewSummary && reviewSummary.average_rating >= 4) ? 'Excellent' : (reviewSummary && reviewSummary.average_rating >= 3) ? 'Good' : 'Average')
              }
            </div>
            <div className="pd-summary-inner-divider"></div>
            <p className="pd-summary-count">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              {language === 'ta' ? (
                <>
                  <strong style={{ color: '#16a34a' }}>{reviewSummary ? reviewSummary.total_reviews : 0}</strong> மதிப்புரைகளின் அடிப்படையில்
                </>
              ) : (
                <>
                  Based on <strong style={{ color: '#16a34a' }}>{reviewSummary ? reviewSummary.total_reviews : 0}</strong> reviews
                </>
              )}
            </p>
          </div>

          {/* Right Side: Rating Bars */}
          <div className="pd-rating-bars-right" style={{ flex: '1 1 300px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[5, 4, 3, 2, 1].map(stars => {
              const count = reviewSummary && reviewSummary.rating_count ? reviewSummary.rating_count[stars] : 0;
              const total = reviewSummary ? reviewSummary.total_reviews : 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={stars} className="pd-bar-row" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span className="pd-bar-label" style={{ fontWeight: '700', color: '#334155', minWidth: '55px', fontSize: '1rem' }}>
                    {stars} {language === 'ta' ? 'நட்சத்திரம்' : 'Star'}
                  </span>
                  <div className="pd-bar-track" style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div className="pd-bar-fill" style={{ width: `${percent}%`, height: '100%', background: '#16a34a', borderRadius: '10px' }}></div>
                  </div>
                  <span className="pd-bar-percent" style={{ minWidth: '40px', textAlign: 'right', color: '#475569', fontSize: '0.95rem', fontWeight: '600' }}>{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Review Slider */}
        <div className="pd-reviews-bottom-slider">
          {reviews.length === 0 ? (
            <div className="pd-empty-reviews-card">
              <div className="pd-empty-icon-wrapper">
                <MessageSquare size={36} className="empty-icon" />
              </div>
              <h4>{language === 'ta' ? 'இன்னும் மதிப்புரைகள் இல்லை' : 'No reviews yet'}</h4>
              <p>{language === 'ta' ? 'இந்த தயாரிப்பு குறித்த உங்கள் அனுபவத்தைப் பகிர்ந்த முதல் நபராக இருங்கள்!' : 'Be the first to share your experience with this product!'}</p>
            </div>
          ) : (
            <div className="pd-reviews-grid-slider" ref={sliderRef} style={reviews.length <= 2 ? { overflow: 'hidden', flexWrap: 'wrap', justifyContent: 'flex-start' } : {}}>
                {(reviews.length > 2 ? [...reviews, ...reviews, ...reviews, ...reviews] : reviews).map((review, i) => (
                <div key={`${review.id}-${i}`} className="pd-review-slide-card">
                  <div className="pd-reviewer-header">
                    <div className="pd-reviewer-avatar" style={{ backgroundColor: review.color }}>
                      {review.initial}
                    </div>
                    <div className="pd-reviewer-info">
                      <h5>{review.name}</h5>
                      <span>{review.date}</span>
                    </div>
                    <div className="pd-google-icon-wrapper">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="pd-google-icon" />
                    </div>
                  </div>
                  <div className="pd-review-stars-display">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill={star <= review.rating ? "#fbbf24" : "transparent"} color={star <= review.rating ? "#fbbf24" : "#cbd5e1"} />
                    ))}
                  </div>
                  <p className="pd-review-text-display">"{review.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pd-pro-divider" style={{ marginTop: '60px', marginBottom: '20px' }}></div>

      <div className="related-products-section" style={{ maxWidth: '1200px', margin: '40px auto 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 800, marginBottom: 'clamp(20px, 4vw, 40px)', color: '#111827' }}>{t('relatedProducts')}</h2>
        <div className="shop-grid">
          {[
            ...products.filter(p => p.id !== product.id && p.category_name === product.category_name),
            ...products.filter(p => p.id !== product.id && p.category_name !== product.category_name)
          ].slice(0, 6).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {isFullscreen && (
        <div className="pd-fullscreen-modal" onClick={() => setIsFullscreen(false)}>
          <button className="pd-fullscreen-close" onClick={() => setIsFullscreen(false)}>×</button>

          <button
            className="pd-fullscreen-prev"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImgIndex(i => (i > 0 ? i - 1 : mediaItems.length - 1));
            }}
          >
            &#10094;
          </button>

          <div className="pd-fullscreen-content" onClick={e => e.stopPropagation()}>
            <img src={currentMedia?.src} alt="Fullscreen product" className="pd-fullscreen-image" />
          </div>

          <button
            className="pd-fullscreen-next"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImgIndex(i => (i < mediaItems.length - 1 ? i + 1 : 0));
            }}
          >
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}
