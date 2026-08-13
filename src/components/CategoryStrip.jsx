import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './CategoryStrip.css';

// Import custom generated category images matching premium organic blob style
import imgHair from '../assets/chemparuthi_shampoo_transparent_v3.png';
import imgBody from '../assets/body_soap_transparent.png';
import imgFood from '../assets/pirandai_pickle_transparent_v2.png';
import imgSkin from '../assets/aloe_vera_face_pack_transparent.png';
import imgHealth from '../assets/sathu_maavu_transparent.png';
import imgBaby from '../assets/nalangu_powder_transparent_v2.png';
import imgPoojas from '../assets/pooja_oil_transparent_v2.png';
import imgBeverages from '../assets/beverage_transparent.png';

const LOCAL_CATEGORY_IMAGES = {
  "Hair": imgHair,
  "Body": imgBody,
  "Food": imgFood,
  "Skin": imgSkin,
  "Health & Wellness": imgHealth,
  "Baby": imgBaby,
  "Poojas": imgPoojas,
  "Beverages": imgBeverages
};

export default function CategoryStrip() {
  const location = useLocation();
  const [categories, setCategories] = useState(() => {
    try {
      const cached = localStorage.getItem('dharani_categories_cache');
      const parsed = cached ? JSON.parse(cached) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem('dharani_categories_cache');
      return cached ? false : true;
    } catch (e) {
      return true;
    }
  });
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const { t } = useLanguage();

  useEffect(() => {
    fetch('https://api.codingboss.in/herbal/categories/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => res.json())
      .then(data => {
        let catsArray = [];
        if (Array.isArray(data)) {
          catsArray = data;
        } else if (data && Array.isArray(data.categories)) {
          catsArray = data.categories;
        } else if (data && Array.isArray(data.data)) {
          catsArray = data.data;
        } else if (data && Array.isArray(data.results)) {
          catsArray = data.results;
        }
        const preferredOrder = [
          "Hair",
          "Skin",
          "Baby",
          "Body",
          "Food",
          "Health & Wellness",
          "Beverages",
          "Poojas"
        ];

        catsArray.sort((a, b) => {
          const indexA = preferredOrder.indexOf(a.name);
          const indexB = preferredOrder.indexOf(b.name);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return a.name.localeCompare(b.name);
        });

        setCategories(catsArray);
        try {
          localStorage.setItem('dharani_categories_cache', JSON.stringify(catsArray));
        } catch (e) { }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

  // ONLY show on Home Page and Shop Page
  if (location.pathname !== '/' && location.pathname !== '/shop') {
    return null;
  }

  if (loading) {
    return null;
  }

  return (
    <div className="category-strip-container">
      <div className="category-strip-scroll">

        {/* "All" pill — clears category filter */}
        <Link
          to="/shop"
          className={`category-item cat-animate-up ${!activeCategory ? 'category-item--active' : ''}`}
          style={{ animationDelay: '0s' }}
        >
          <div className="category-blob-wrapper">
            <div className="category-all-icon">{t('allCategory')}</div>
          </div>
          <div className="category-btn">
            <span>{t('allProducts')} &gt;</span>
          </div>
        </Link>

        {categories.map((category, index) => {
          const categoryImage = category.image || LOCAL_CATEGORY_IMAGES[category.name];
          return (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className={`category-item cat-animate-up ${activeCategory === category.name ? 'category-item--active' : ''}`}
              style={{ animationDelay: `${(index + 1) * 0.04}s` }}
            >
              <div className={`category-blob-wrapper ${[].includes(category.name) ? 'has-css-blob' : ''}`}>
                <img
                  src={categoryImage ? `${categoryImage}?v=42` : ''}
                  alt={category.name}
                  className="category-img"
                />
              </div>
              <div className="category-btn">
                <span>{category.name} &gt;</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
