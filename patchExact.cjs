const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Find the start of the useEffect block
const startStr = 'useEffect(() => {\r\n    const params = new URLSearchParams(location.search);';
let startIdx = code.indexOf(startStr);
if (startIdx === -1) {
  startIdx = code.indexOf('useEffect(() => {\n    const params = new URLSearchParams(location.search);');
}

if (startIdx !== -1) {
  // Find the end of this block
  const endStr = '  }, [location]);';
  let endIdx = code.indexOf(endStr, startIdx);
  
  if (endIdx !== -1) {
    endIdx += endStr.length;
    
    const newEffect = `useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('order_status') || params.get('status') || params.get('payment_status') || params.get('txStatus');
    const orderIdParam = params.get('order_id') || params.get('orderId') || params.get('merchantOrderId');
    const xGlToken = params.get('x_gl_token') || params.get('token');

    const isSuccess = ['success','SUCCESS','TXN_SUCCESS','CHARGED'].includes(statusParam);
    const isFailed = ['failed','FAILED','failure','FAILURE','CANCELLED'].includes(statusParam);

    if (xGlToken || isSuccess || orderIdParam) {
      setSuccessOrderId(orderIdParam || 'Completed');
      setShowSuccessPopup(true);
      setTimeout(() => refreshCart(), 500);
    } else if (isFailed) {
      setError('Payment failed or was cancelled. Please try again.');
    }
  }, [location]);`;

    code = code.slice(0, startIdx) + newEffect + code.slice(endIdx);
    
    // NOW FIX THE SPINNER
    const spinnerStartStr = 'if (cartItems.length === 0 && !showSuccessPopup && !error && !isVerifyingPayment) {';
    const spinnerStartIdx = code.indexOf(spinnerStartStr);
    if (spinnerStartIdx !== -1) {
      const spinnerEndStr = '  }';
      const spinnerEndIdx = code.indexOf(spinnerEndStr, spinnerStartIdx) + spinnerEndStr.length;
      
      const newSpinner = `const hasPaymentParams = new URLSearchParams(location.search).has('order_status') || new URLSearchParams(location.search).has('order_id') || new URLSearchParams(location.search).has('x_gl_token');
  if (cartItems.length === 0 && !showSuccessPopup && !error && !isVerifyingPayment && !hasPaymentParams) {
    return (
      <div className="checkout-page-wrapper" style={{ alignItems: 'center', padding: '50px' }}>
        <h2>Your cart is empty</h2>
      </div>
    );
  }`;
      
      code = code.slice(0, spinnerStartIdx) + newSpinner + code.slice(spinnerEndIdx);
    }
    
    fs.writeFileSync('src/pages/Checkout.jsx', code);
    console.log('Fixed exactly!');
  } else {
    console.log('End not found');
  }
} else {
  console.log('Start not found');
}
