/**
 * companyFacts.js
 * Single Source of Truth for Dharani Herbals Company Facts, Contact Details,
 * Social Media Accounts, and Verified Business Information.
 *
 * All components across the application (Navbar, Footer, Contact, About, Policies,
 * FAQ, and Chatbot) must reference this configuration to maintain consistency.
 */

export const COMPANY_FACTS = {
  // Brand & Legal Identity
  brandName: 'Dharani Herbbals',
  brandNameRegistered: 'Dharani Herbbals®',
  legalName: 'Dharani Herbbals',
  tagline: "Rooted in Ancient Siddha Wisdom, Elevated by Modern Science.",
  domain: 'https://www.dharaniherbbals.in',
  founder: 'Mrs. A. Poonkodi',
  founderRole: 'Founder & Brand Visionary',
  establishmentYear: 2007,
  researchStartedYear: 2004,

  // Verified Physical Address
  address: {
    line1: '7/470-1, Chemparuthi Street, West Nehru Nagar',
    line2: 'Punjai Puliampatti, Sathyamangalam (Taluk)',
    district: 'Erode',
    state: 'Tamil Nadu',
    pincode: '638 459',
    country: 'India',
    fullFormattedEn: '7/470-1, Chemparuthi Street, West Nehru Nagar, Punjai Puliampatti, Sathyamangalam (Taluk), Erode - 638 459, Tamil Nadu, India',
    fullFormattedTa: '7/470-1, செம்பருத்தி வீதி, மேற்கு நேரு நகர், புஞ்சை புளியம்பட்டி, சத்தியமங்கலம் (தாலுகா), ஈரோடு - 638 459, தமிழ்நாடு, இந்தியா',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=11.3580361,77.166633&t=&z=17&ie=UTF8&iwloc=&output=embed',
    latitude: '11.3580361',
    longitude: '77.166633'
  },

  // Verified Contact & Support Channels
  contact: {
    primaryPhone: '+91 97881 22001',
    primaryPhoneRaw: '+919788122001',
    secondaryPhone: '+91 99655 32001',
    secondaryPhoneRaw: '+919965532001',
    whatsappNumber: '919788122001',
    whatsappLink: 'https://api.whatsapp.com/send?phone=919788122001&text=Hello%20Dharani%20Herbbals%2C%20I%20have%20an%20enquiry%20regarding%20your%20products.',
    primaryEmail: 'info@dharaniherbbals.in',
    secondaryEmail: 'info@dharanimart.in',
    supportHours: {
      en: 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
      ta: 'திங்கள் – சனி: காலை 9:00 – இரவு 7:00'
    }
  },

  // Verified Social Media Profiles
  socials: {
    instagram: {
      url: 'https://www.instagram.com/dharani_herbbals?igsh=NG9sbTFidTdodzN2',
      handle: '@dharani_herbbals'
    },
    facebook: {
      url: 'https://www.facebook.com/profile.php?id=61574767123085',
      handle: 'Dharani Herbbals'
    },
    youtube: {
      url: 'https://youtube.com/@dharaniherbbalsppy?si=Ja0OqohcfBTEBJJf',
      handle: '@dharaniherbbalsppy'
    }
    // Twitter/X: Not currently active / no verified profile. Removed broken '#' link.
  },

  // Shipping & Delivery Policy Constants
  shipping: {
    freeShippingThreshold: 750, // INR (Free above ₹749)
    standardShippingFee: 50,    // INR
    defaultDispatchWindow: '24–48 hours',
    localZoneTimeline: '2–3 business days',      // Tamil Nadu, Kerala, Pondicherry
    southZoneTimeline: '3–4 business days',      // Karnataka, AP, Telangana
    restOfIndiaTimeline: '5–7 business days'     // North, West, East, Central
  }
};
