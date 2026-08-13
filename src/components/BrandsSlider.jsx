import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BrandsSlider.css';
import { useLanguage } from '../context/LanguageContext';

import makilImg from '../assets/brands_api/MAKIL.png';
import amuthuImg from '../assets/brands_api/Amuthu.png';
import ramcareImg from '../assets/brands_api/Ramcare.png';
import vanaArasiImg from '../assets/brands_api/VANA ARASI.png';
import divyamImg from '../assets/brands_api/Divyam.png';
import athiyamanImg from '../assets/brands_api/Athiyaman.png';
import vedanImg from '../assets/brands_api/Vedan.png';

const localBrandImages = {
  'MAKIL': makilImg,
  'Amuthu': amuthuImg,
  'Ramcare': ramcareImg,
  'VANA ARASI': vanaArasiImg,
  'Divyam': divyamImg,
  'Athiyaman': athiyamanImg,
  'Vedan ': vedanImg,
  'Vedan': vedanImg
};

const fallbackBrands = [
  { id: 'f1', name: 'MAKIL', logo: makilImg },
  { id: 'f2', name: 'Amuthu', logo: amuthuImg },
  { id: 'f3', name: 'Ramcare', logo: ramcareImg },
  { id: 'f4', name: 'VANA ARASI', logo: vanaArasiImg },
  { id: 'f5', name: 'Divyam', logo: divyamImg },
  { id: 'f6', name: 'Athiyaman', logo: athiyamanImg },
  { id: 'f7', name: 'Vedan', logo: vedanImg }
];

export default function BrandsSlider() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    fetch('https://api.codingboss.in/herbal/brands/', {
=======
    fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/brands/', {
>>>>>>> master
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
          const activeBrands = data.data.filter(b => b.status === 'active');
          const duplicated = [...activeBrands, ...activeBrands, ...activeBrands];
          setBrands(duplicated);
        } else {
          setBrands([...fallbackBrands, ...fallbackBrands, ...fallbackBrands]);
        }
      })
      .catch(err => {
        console.error('Error fetching brands:', err);
        setBrands([...fallbackBrands, ...fallbackBrands, ...fallbackBrands]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  let titleText = t('qualityAssuredBrands');
  if (!titleText || titleText === 'qualityAssuredBrands') {
    titleText = 'QUALITY ASSURED BRANDS';
  }

  // If still loading, we can optionally return null or just let it render empty (which will be brief)
  if (isLoading && brands.length === 0) return null;

  return (
    <div className="brands-slider-section">
      <div className="brands-slider-header">
        <h3 className="brands-title">
          <span className="title-highlight">{titleText}</span>
        </h3>
        <div className="brands-divider"></div>
      </div>

      <div className="brands-slider-container">
        {/* We use two identical tracks that move together for a seamless loop */}
        <div className="brands-track">
          {brands.map((brand, index) => (
            <div
              key={`track1-${brand.id}-${index}`}
              className="brand-item"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate(`/shop?brand=${encodeURIComponent(brand.name)}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="brand-logo-wrapper">
                <img
                  src={localBrandImages[brand.name] || brand.logo}
                  alt={brand.name}
                  className="brand-logo-image"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="brands-track" aria-hidden="true">
          {brands.map((brand, index) => (
            <div
              key={`track2-${brand.id}-${index}`}
              className="brand-item"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate(`/shop?brand=${encodeURIComponent(brand.name)}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="brand-logo-wrapper">
                <img
                  src={localBrandImages[brand.name] || brand.logo}
                  alt={brand.name}
                  className="brand-logo-image"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
