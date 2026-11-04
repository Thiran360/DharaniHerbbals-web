import { useMemo } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';
import './HandpickedDeals.css';

export default function HandpickedDeals() {
  const { products } = useProducts();
  const { t } = useLanguage();
  
  // Select specific curated products based on user request
  const curatedOffersNames = [
    "multani mitti soap",
    "multhani metti soap",
    "aloe vera shampoo",
    "avarmpoo hair wash powder",
    "ashwagandha powder jar",
    "kesa raksha herbal hair oil",
    "sprouted multigrain health mix",
    "badam pisin",
    "rose water",
    "nannari syrup",
    "moringa powder",
    "arappu shampoo",
    "deepa oil"
  ];

  const dealProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const result = [];
    const seenNames = new Set();
    
    curatedOffersNames.forEach(searchName => {
      const product = products.find(p => p.name && p.name.toLowerCase().replace(/\s+/g, ' ').includes(searchName));
      if (product) {
        const canonicalName = product.name.toLowerCase().trim();
        if (!seenNames.has(canonicalName)) {
          result.push(product);
          seenNames.add(canonicalName);
        }
      }
    });

    return result;
  }, [products]);

  return (
    <div className="deals-container">
      <div className="reveal bento-header" style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(34,197,94,0.1) 100%)', borderColor: 'rgba(74,222,128,0.3)' }}>
          {/* Decorative background blob */}
          <div className="bento-header-blob right"></div>
          
          <div className="bento-title-col">
            <h2 className="bento-title-text">
              <div>{t('trendingProducts')}</div>
            </h2>
          </div>
          
          <div className="bento-desc-col">
            <p className="bento-desc-text">
              {t('trendingDesc')}
            </p>
          </div>
        </div>

      <div className="deals-grid reveal">
        {dealProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
