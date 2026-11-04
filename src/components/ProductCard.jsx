import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { resolveMediaUrl } from '../services/api';
import { formatProductPackSize, formatProductDisplayName, formatCurrency, getProductFallbackImage } from '../utils/productFormatters';
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

  const fallbackImg = getProductFallbackImage(product.raw_name || product.name, product.id) || getProductFallbackImage(product.name, product.id);

  const handleImageError = (e) => {
    if (fallbackImg && e.target.src !== fallbackImg) {
      e.target.src = fallbackImg;
      return;
    }
    if (e.target.src !== window.location.origin + '/logo.png') {
      e.target.src = '/logo.png';
      e.target.style.objectFit = 'contain';
      e.target.style.padding = '1rem';
    }
  };

  let displayImage = '/logo.png';
  if (product.id === 1255 || (product.name && product.name.toLowerCase().includes('chemparuthi herbal shampoo'))) {
    displayImage = '/images/chemparuthi_shampoo_single.png';
  } else if (product.image && typeof product.image === 'string' && !product.image.includes('Vaishnavi.jpeg') && !product.image.endsWith('/logo.png')) {
    if (product.image.includes(',')) {
      displayImage = product.image.split(',')[0].trim();
    } else {
      displayImage = product.image;
    }
    displayImage = resolveMediaUrl(displayImage) || fallbackImg || '/logo.png';
  } else {
    displayImage = fallbackImg || '/logo.png';
  }

  // 1. Detect tight camera close-up shots (Keelanelli 4.jpeg, Chemparuthi Poo, Thaneervittan, etc.)
  // These fill the entire photo frame with 0% margin, so they must stay unscaled to prevent clipping.
  const isTightImage = Boolean(
    displayImage && (
      displayImage.includes('/herbal/') ||
      displayImage.includes('4.jpeg') ||
      displayImage.includes('HIBISCUS%20FLOWER%20POWDER') ||
      displayImage.includes('Thanveevittan') ||
      (product.name && (
        product.name.toLowerCase().includes('keelanelli') ||
        product.name.toLowerCase().includes('chemparuthi poo')
      ))
    )
  );

  // 2. Detect products with wide white margins baked into their catalog photos (Vallarai, Sirukurinjan, etc.)
  // These have 35-45% empty white space around the packet, so a boosted scale is needed so they aren't tiny.
  const fullNameStr = (String(product.raw_name || '') + ' ' + String(product.name || '')).toLowerCase();
  const isPaddedImage = Boolean(
    !isTightImage && (
      fullNameStr.includes('vallarai') ||
      fullNameStr.includes('sirukurinjan') ||
      fullNameStr.includes('pirandai') ||
      fullNameStr.includes('neem powder') ||
      fullNameStr.includes('nilaavarai') ||
      fullNameStr.includes('thottal') ||
      fullNameStr.includes('marudhontri') ||
      fullNameStr.includes('karpuravalli') ||
      fullNameStr.includes('thantrikkai') ||
      fullNameStr.includes('vilva') ||
      fullNameStr.includes('manathakkali') ||
      fullNameStr.includes('sirunerunjil') ||
      fullNameStr.includes('trikaduku') ||
      fullNameStr.includes('koraikilangu') ||
      fullNameStr.includes('lavangapattai') ||
      fullNameStr.includes('fenugreek') ||
      fullNameStr.includes('seenthilkodi') ||
      fullNameStr.includes('kandakathiri') ||
      fullNameStr.includes('thaamarai') ||
      fullNameStr.includes('musumusukkai') ||
      fullNameStr.includes('poonthikaai') ||
      fullNameStr.includes('thipili') ||
      (displayImage && (
        displayImage.includes('Health%20%26%20Wellness/') ||
        displayImage.includes('Health & Wellness/') ||
        displayImage.toLowerCase().includes('vallarai') ||
        displayImage.toLowerCase().includes('sirukurinjan') ||
        displayImage.toLowerCase().includes('pirandai') ||
        displayImage.includes('Neem%20powder') ||
        displayImage.includes('Nilaavarai') ||
        displayImage.includes('Thottal') ||
        displayImage.includes('Marudhontri') ||
        displayImage.includes('Karpuravalli') ||
        displayImage.includes('THANTRIKKAI') ||
        displayImage.includes('Vilva') ||
        displayImage.includes('Manathakkali') ||
        displayImage.includes('Sirunerunjil') ||
        displayImage.includes('Trikaduku') ||
        displayImage.includes('Koraikilangu') ||
        displayImage.includes('Lavangapattai') ||
        displayImage.includes('Fenugreek') ||
        displayImage.includes('Seenthilkodi') ||
        displayImage.includes('kandakathiri') ||
        displayImage.includes('Thaamarai') ||
        displayImage.includes('Musumusukkai') ||
        displayImage.includes('Poonthikaai') ||
        displayImage.includes('THIPILI')
      ))
    )
  );

  const imageFitClass = isTightImage
    ? 'uc-img-tight-fit'
    : (isPaddedImage ? 'uc-img-boost-fit' : 'uc-img-standard-fit');

  const isAboveFold = index < 6;

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
              let packSize = product.pack_size || formatProductPackSize(product);
              if (packSize && /nos|pcs|ea|pkt/i.test(packSize)) {
                packSize = formatProductPackSize({ ...product, unit: '' });
              }
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
          className={`uc-img ${imageFitClass}`}
          loading={isAboveFold ? "eager" : "lazy"}
          fetchPriority={isAboveFold ? "high" : "auto"}
          decoding={isAboveFold ? "sync" : "async"}
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

