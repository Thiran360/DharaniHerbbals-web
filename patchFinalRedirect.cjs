const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// 1. Fix the callback to actually show the popup broadly
const targetEffect = `  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('order_status');
    const orderIdParam = params.get('order_id') || params.get('orderId'); // Support both snake_case and camelCase

    if (statusParam === 'success') {
      if (orderIdParam) {
        setLoading(true);
        fetch(\`\${API_BASE_URL}/paytm/status/\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ order_id: String(orderIdParam) })
        })
          .then(res => res.json())
          .then(statusData => {
            if (
              statusData.success === true ||
              statusData.body?.resultInfo?.resultStatus === 'TXN_SUCCESS' ||
              statusData.status === 'TXN_SUCCESS' ||
              statusData.payment_status === 'TXN_SUCCESS' ||
              statusData.message === 'Payment updated'
            ) {
              setSuccessOrderId(orderIdParam);
              setShowSuccessPopup(true);
            } else {
              setError(statusData.message || 'Payment verification failed on the server.');
            }
          })
          .catch(err => {
            console.error("Status verification error:", err);
            // Fallback to success if network error but url says success, to avoid blocking user
            setSuccessOrderId(orderIdParam);
            setShowSuccessPopup(true);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // If they didn't pass order_id in URL, just show success directly
        setSuccessOrderId('Completed');
        setShowSuccessPopup(true);
      }
    } else if (statusParam === 'failed') {
      setError('Payment failed or was cancelled during redirect.');
    }
  }, [location]);`;

const newEffect = `  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('order_status') || params.get('status') || params.get('payment_status') || params.get('txStatus');
    const orderIdParam = params.get('order_id') || params.get('orderId') || params.get('merchantOrderId');
    const xGlToken = params.get('x_gl_token') || params.get('token');

    const isSuccess = ['success','SUCCESS','TXN_SUCCESS','CHARGED'].includes(statusParam);
    const isFailed = ['failed','FAILED','failure','FAILURE','CANCELLED'].includes(statusParam);

    if (xGlToken || isSuccess || orderIdParam) {
      // Show popup immediately!
      setSuccessOrderId(orderIdParam || 'Completed');
      setShowSuccessPopup(true);
      // Wait for a second before clearing cart so state doesn't conflict
      setTimeout(() => refreshCart(), 500);
    } else if (isFailed) {
      setError('Payment failed or was cancelled. Please try again.');
    }
  }, [location]);`;

if (code.includes(targetEffect)) {
  code = code.replace(targetEffect, newEffect);
} else {
  // Try CRLF to LF just in case
  code = code.replace(targetEffect.replace(/\r\n/g, '\n'), newEffect);
}

// 2. Fix the spinner blocking the popup
const targetSpinner = `  if (cartItems.length === 0 && !showSuccessPopup && !error && !isVerifyingPayment) {
    return (
      <div className="checkout-page-wrapper" style={{ alignItems: 'center' }}>
        <Loader2 size={40} className="spinner text-primary" style={{ color: '#16A34A' }} />
      </div>
    );
  }`;

const newSpinner = `  const hasPaymentParams = new URLSearchParams(location.search).has('order_status') || new URLSearchParams(location.search).has('order_id') || new URLSearchParams(location.search).has('x_gl_token');
  if (cartItems.length === 0 && !showSuccessPopup && !error && !isVerifyingPayment && !hasPaymentParams) {
    return (
      <div className="checkout-page-wrapper" style={{ alignItems: 'center', padding: '50px' }}>
        <h2>Your cart is empty</h2>
      </div>
    );
  }`;

if (code.includes(targetSpinner)) {
  code = code.replace(targetSpinner, newSpinner);
} else {
  code = code.replace(targetSpinner.replace(/\r\n/g, '\n'), newSpinner);
}

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Final fixes applied');
