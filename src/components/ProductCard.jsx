import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { resolveMediaUrl } from '../services/api';
import { formatProductPackSize, formatProductDisplayName, formatCurrency } from '../utils/productFormatters';
import { getVerifiedReviewData } from '../utils/productReviews';

export const ProductCard = memo(({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { language, t } = useLanguage();

  const navigate = useNavigate();

  const translatedName = formatProductDisplayName(language === 'ta' && product.tamil_name ? product.tamil_name : product.name);

  const verifiedReviewData = getVerifiedReviewData(product);
  const hasValidRating = Boolean(
    verifiedReviewData && 
    typeof verifiedReviewData.rating === 'number' && 
    verifiedReviewData.rating > 0 && 
    typeof verifiedReviewData.reviews === 'number' && 
    verifiedReviewData.reviews > 0
  );
  const displayRating = hasValidRating ? verifiedReviewData.rating.toFixed(1) : null;
  const displayReviews = hasValidRating ? verifiedReviewData.reviews : null;

  const openProduct = () => {
    sessionStorage.setItem('shopScrollPos', window.scrollY);
    navigate(`/product/${product.id}`);
  };

  const handleCardKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProduct();
    }
  };

  const handleImageError = (e) => {
    if (e.target.src !== window.location.origin + '/logo.png') {
      e.target.src = '/logo.png';
      e.target.style.objectFit = 'contain';
      e.target.style.padding = '1rem';
    }
  };

  let displayImage = '/logo.png';
  if (product.id === 1255 || (product.name && product.name.toLowerCase().includes('chemparuthi herbal shampoo'))) {
    displayImage = '/images/chemparuthi_shampoo_single.png';
  } else if (product.image) {
    if (typeof product.image === 'string' && product.image.includes(',')) {
      displayImage = product.image.split(',')[0].trim();
    } else {
      displayImage = product.image;
    }
    displayImage = resolveMediaUrl(displayImage) || '/logo.png';
  }

  const isSpecialZoomImage = false;

  return (
    <div
      className="uc-card"
      role="link"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={handleCardKeyDown}
      aria-label={`Open ${translatedName}`}
    >
      <div className="uc-info-section">
        <div className="uc-category-tag">
          <Leaf size={12} className="uc-tag-icon" />
          <span>{product.category_name || 'Snacks'}</span>
        </div>

        <h3 className="uc-title">
          <Link
            to={`/product/${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              sessionStorage.setItem('shopScrollPos', window.scrollY);
            }}
          >
            {translatedName}
          </Link>
        </h3>
        <p className="uc-subtitle">{language === 'ta' && product.tamil_description ? product.tamil_description : (product.description || 'Authentic Natural Herbal Product')}</p>

        {hasValidRating && (
          <div className="uc-meta-row">
            <div className="uc-rating-row" aria-label={`Rating: ${displayRating} out of 5 (${displayReviews} reviews)`}>
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span className="uc-rating-text">{displayRating}</span>
              <span className="uc-review-count">({displayReviews})</span>
            </div>
          </div>
        )}

        <div className="uc-bottom-row">
          <div className="uc-price-block">
            <span className="uc-price">{formatCurrency(product.price)}</span>
            {(() => {
              const packSize = product.pack_size || formatProductPackSize(product);
              return packSize ? <span className="uc-pack-size">({packSize})</span> : null;
            })()}
            {product.mrp && parseFloat(product.mrp) > parseFloat(String(product.price).replace(/[^0-9.]/g, '')) && <span className="uc-original-price">{formatCurrency(product.mrp)}</span>}
          </div>
        </div>

        <button
          className="uc-add-text-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product, 1, product.default_variation_id || product.default_variation?.id);
          }}
          aria-label={t('addToCart')}
        >
          <ShoppingBag size={14} className="uc-btn-icon" />
          Add to Cart
        </button>
      </div>

      <div className="uc-img-section">
        {product.discount && (
          <span className="uc-discount-badge">{product.discount}</span>
        )}
        <button
          className="uc-wishlist-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isInWishlist(product.id) ? `Remove ${translatedName} from Wishlist` : `Add ${translatedName} to Wishlist`}
        >
          <Heart
            size={16}
            fill={isInWishlist(product.id) ? "#1f2937" : "transparent"}
            color="#1f2937"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
        <img
          src={displayImage}
          alt={`${translatedName} - ${product.category_name || 'Herbal Product'} by Dharani Herbals`}
          className={`uc-img ${isSpecialZoomImage ? 'uc-img-zoom-fit' : ''}`}
          loading="lazy"
          decoding="async"
          width="200"
          height="200"
          onError={handleImageError}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
});

export default ProductCard;

