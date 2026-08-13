import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, ArrowLeft, Loader2, MapPin, Image as ImageIcon, Star } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import './OrderTracking.css';

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Feedback state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { products } = useProducts();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch(`https://api.codingboss.in/herbal/tracking/${orderId}/`, {
=======
        const response = await fetch(`https://concise-egomaniac-starved.ngrok-free.dev/herbal/tracking/${orderId}/`, {
>>>>>>> master
          method: 'GET',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          if (response.ok) {
            setOrder(data);
          } else {
            console.error('Tracking API error response:', data);
            setError(data.message || data.error || `Error ${response.status}: Order not found.`);
          }
        } else {
          const text = await response.text();
          console.error('Tracking API returned non-JSON:', text);
          setError(`API Error ${response.status}: Expected JSON but got ${contentType}.`);
        }
      } catch (err) {
        console.error('Tracking fetch error:', err);
        setError(`Failed to fetch order details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusStep = (status) => {
    if (!status) return 1; // Fallback to pending if status is missing
    const s = String(status).toLowerCase();
    if (s === 'delivered') return 3;
    if (s === 'shipped') return 2;
    return 1; // pending/processing
  };

  const step = order ? getStatusStep(order.status) : 1;

  useEffect(() => {
    if (step === 3 && !isSubmitted) {
      // Delay slightly so the page loads first
      const timer = setTimeout(() => {
        setShowFeedbackModal(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [step, isSubmitted]);

  const handleSubmitReview = async () => {
    if (rating === 0 || !order || !order.items) return;

    setSubmittingReview(true);

    const storedUser = localStorage.getItem('user');
    let currentUserId = null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const userData = parsed.user || parsed;
        currentUserId = userData.id || userData.user_id;
      } catch (e) { }
    }

    if (currentUserId) {
      try {
        const promises = order.items.map(item => {
          const payload = {
            order_item_id: item.order_item_id,
            user_id: currentUserId,
            rating: rating,
            review_text: reviewText
          };

<<<<<<< HEAD
          return fetch('https://api.codingboss.in/herbal/reviews/submit/', {
=======
          return fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/reviews/submit/', {
>>>>>>> master
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(payload)
          });
        });

        await Promise.all(promises);
      } catch (err) {
        console.error('Failed to submit review:', err);
      }
    }

    setSubmittingReview(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="track-page-wrapper center-content">
        <Loader2 size={40} className="spinner text-primary" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="track-page-wrapper center-content">
        <div className="error-card">
          <h2>Order Not Found</h2>
          <p>{error}</p>
          <Link to="/shop" className="btn-primary mt-4">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="track-page-wrapper">

      <div className="track-container fade-in-up">
        <Link to="/profile" className="back-link">
          <ArrowLeft size={18} /> Back to Orders
        </Link>
        <div className="track-header">
          <div>
            <h1>Order</h1>
            <p className="order-date">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className="order-total-badge">
            Total: ₹{order.total_amount}
          </div>
        </div>

        <div className="track-status-card">
          <div className="status-timeline">
            <div className={`status-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-icon"><Package size={24} /></div>
              <div className="step-text">
                <h4>Order Placed</h4>
                <p>We have received your order</p>
              </div>
            </div>

            <div className={`status-connector ${step >= 2 ? 'active' : ''}`}></div>

            <div className={`status-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-icon"><Truck size={24} /></div>
              <div className="step-text">
                <h4>Shipped</h4>
                <p>Your order is on the way</p>
              </div>
            </div>

            <div className={`status-connector ${step >= 3 ? 'active' : ''}`}></div>

            <div className={`status-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-icon"><CheckCircle size={24} /></div>
              <div className="step-text">
                <h4>Delivered</h4>
                <p>Package arrived safely</p>
              </div>
            </div>
          </div>
          {order.tracking_number && (
            <div className="tracking-number-box">
              <p>Tracking Number:</p>
              <strong>{order.tracking_number}</strong>
            </div>
          )}
        </div>

        <div className="track-grid">
          <div className="track-items-section">
            <h3 className="section-title">Items in this order</h3>
            <ul className="ordered-items-list">
              {order.items && order.items.map((item, idx) => {
                const itemName = item.product_name || item.product;
                const imageUrl = (item.image && !item.image.includes('default.jpg') && item.image !== '')
                  ? item.image
                  : products.find(p => p.name === itemName)?.image || item.image;

                return (
                  <li key={idx} className="ordered-item">
                    <div className="ordered-item-image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={itemName} />
                      ) : (
                        <div className="placeholder-img"><ImageIcon size={24} /></div>
                      )}
                    </div>
                    <div className="ordered-item-details">
                      <h4>{itemName}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="ordered-item-price">
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="track-shipping-section">
            <h3 className="section-title">Shipping Information</h3>
            <div className="shipping-info-card">
              <MapPin size={24} className="shipping-icon" />
              <div className="shipping-address-text">
                <p>{order.shipping?.address || 'Address not provided'}</p>
                {(order.shipping?.city || order.shipping?.state) && (
                  <p>{order.shipping?.city}, {order.shipping?.state} {order.shipping?.pincode}</p>
                )}
                {order.shipping?.phone && <p>Phone: {order.shipping.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Modal if Delivered */}
        {showFeedbackModal && (
          <div className="feedback-modal-overlay">
            <div className="feedback-modal-content fade-in-up">
              <button
                className="feedback-modal-close"
                onClick={() => setShowFeedbackModal(false)}
                aria-label="Close"
              >
                &times;
              </button>

              {isSubmitted ? (
                <div className="feedback-success-card">
                  <CheckCircle size={56} color="#16a34a" />
                  <h3>Thank You!</h3>
                  <p>Your feedback has been submitted successfully.</p>
                  <button className="btn-submit-feedback mt-4" onClick={() => setShowFeedbackModal(false)}>Close</button>
                </div>
              ) : (
                <div className="feedback-form-card">
                  <h2>How was your experience?</h2>
                  <p className="feedback-subtitle">Please rate your delivered order to help us improve.</p>

                  <div className="feedback-form-group" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <div className="feedback-stars" style={{ justifyContent: 'center', gap: '12px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={36}
                          fill={(hoverRating || rating) >= star ? "#fbbf24" : "transparent"}
                          color={(hoverRating || rating) >= star ? "#fbbf24" : "#cbd5e1"}
                          className="feedback-star-icon"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="feedback-form-group">
                    <label>Your Review (Optional)</label>
                    <textarea
                      placeholder="Share your experience with this order..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows="3"
                    ></textarea>
                  </div>

                  <button
                    className="btn-submit-feedback"
                    onClick={handleSubmitReview}
                    disabled={rating === 0 || submittingReview}
                  >
                    {submittingReview ? <Loader2 size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : 'Submit Review'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
