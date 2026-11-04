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
    const safeProductImg = 'https://vedanmart.com/images/Food/WILD%20HONEYJAR(NR).jpg';
    if (e.target.src !== safeProductImg) {
      e.target.src = safeProductImg;
    }
  };

  let displayImage = fallbackImg || 'https://vedanmart.com/images/Food/WILD%20HONEYJAR(NR).jpg';
  if (product.id === 1255 || (product.name && product.name.toLowerCase().includes('chemparuthi herbal shampoo'))) {
    displayImage = '/images/chemparuthi_shampoo_single.png';
  } else if (product.image && typeof product.image === 'string' && !product.image.includes('Vaishnavi.jpeg') && !product.image.endsWith('/logo.png')) {
    if (product.image.includes(',')) {
      displayImage = product.image.split(',')[0].trim();
    } else {
      displayImage = product.image;
    }
    displayImage = resolveMediaUrl(displayImage) || fallbackImg || 'https://vedanmart.com/images/Food/WILD%20HONEYJAR(NR).jpg';
  } else {
    displayImage = fallbackImg || 'https://vedanmart.com/images/Food/WILD%20HONEYJAR(NR).jpg';
  }

  // Dynamic image fitting classifier: ensures jars/bottles are never cropped,
  // wide landscape photos fill the frame, and padded flat pouches are nicely zoomed.
  const imageFitClass = (() => {
    const img = String(displayImage || '').toLowerCase();
    const rawName = String(product.raw_name || product.name || '').toLowerCase();
    const displayName = String(product.name || '').toLowerCase();
    const fullName = (rawName + ' ' + displayName).trim();

    // 1. Wide Landscape Studio Photos (e.g. herbal/7.jpeg Veliparuthi, herbal/1 kadukkai, herbal/3 mudakathan, etc.)
    // These horizontal landscape photos have a small pouch in the center with wide empty studio margins.
    // By using 'uc-img-landscape-fit' (object-fit: cover), the empty horizontal space is cropped and the product fills the frame vertically.
    const isLandscapeStudio = 
      (img.includes('/herbal/') && !img.includes('4.jpeg')) ||
      img.includes('108%20homa') ||
      img.includes('mann%20kattiya%20toor%20dal');

    if (isLandscapeStudio) {
      return 'uc-img-landscape-fit';
    }

    // 2. 3D Objects with full-frame photos (Jars, Bottles, Oils, Soaps, Teas, Sweets, Halwa, Burfi, etc.)
    // These photos already show the jar/bottle clearly filling the frame.
    // They MUST use 'uc-img-standard-fit' (scale 1.02 with padding) so lids, caps, and labels are NEVER clipped!
    const isJarOr3DObject = 
      fullName.includes('lehyam') ||
      fullName.includes(' jar') ||
      fullName.includes('(jar)') ||
      fullName.includes('jar(') ||
      fullName.includes('pickle') ||
      fullName.includes('thokku') ||
      fullName.includes('gravy') ||
      fullName.includes('honey') ||
      fullName.includes('thean') ||
      fullName.includes('oil') ||
      fullName.includes('shampoo') ||
      fullName.includes('soap') ||
      fullName.includes('tea') ||
      fullName.includes('coffee') ||
      fullName.includes('kudineer') ||
      fullName.includes('kashayam') ||
      fullName.includes('malt') ||
      fullName.includes('burfi') ||
      fullName.includes('halwa') ||
      fullName.includes('mittai') ||
      fullName.includes('varkey') ||
      fullName.includes('gel') ||
      fullName.includes('facepack') ||
      fullName.includes('face pack') ||
      fullName.includes('karuppatti') ||
      fullName.includes('jaggery') ||
      fullName.includes('sugar') ||
      fullName.includes('sakkarai') ||
      img.includes('/skin/') ||
      img.includes('/hair/') ||
      img.includes('/poojas/') ||
      img.includes('lehyam') ||
      img.includes('pickle') ||
      img.includes('oil') ||
      img.includes('shampoo') ||
      img.includes('soap') ||
      img.includes('jar') ||
      img.includes('burfi') ||
      img.includes('halwa') ||
      img.includes('honey') ||
      img.includes('chemparuthi_shampoo');

    if (isJarOr3DObject) {
      return 'uc-img-standard-fit';
    }

    // 3. Tight edge-to-edge camera shots (Keelanelli 4.jpeg, Chemparuthi Poo, Thaneervittan, etc.)
    // Packets touch the outer photo edges -> scale 1.0, zero cropping
    const isTightPacket = 
      img.includes('4.jpeg') ||
      img.includes('hibiscus%20flower%20powder') ||
      img.includes('thanveevittan') ||
      fullName.includes('keelanelli') ||
      fullName.includes('chemparuthi poo');

    if (isTightPacket) {
      return 'uc-img-tight-fit';
    }

    // 4. Padded flat-packet powders (Vallarai Powder, Sirukurinjan Powder, Neem Powder, etc.)
    // These flat sachets were photographed with 35-40% empty white margins.
    // 'uc-img-boost-fit' scales by 1.48 to zoom past the empty white border so packet is large & readable
    const isPaddedPacket = 
      fullName.includes('powder') ||
      fullName.includes('podi') ||
      fullName.includes('churnam') ||
      fullName.includes('suranam') ||
      fullName.includes('maavu') ||
      fullName.includes('flour') ||
      img.includes('health%20&%20wellness') ||
      img.includes('health%20%26%20wellness');

    if (isPaddedPacket) {
      return 'uc-img-boost-fit';
    }

    return 'uc-img-standard-fit';
  })();

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

