const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

const startStr = 'useEffect(() => {\r\n    const params = new URLSearchParams(location.search);';
let start = code.indexOf(startStr);
if (start === -1) {
  start = code.indexOf('useEffect(() => {\n    const params = new URLSearchParams(location.search);');
}
if (start === -1) {
  console.log('Could not find useEffect start');
  process.exit(1);
}

const endStr = '  }, [location]);';
const end = code.indexOf(endStr, start) + endStr.length;

const newBlock = `useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('order_status') || params.get('status') || params.get('payment_status') || params.get('txStatus');
    const orderIdParam = params.get('order_id') || params.get('orderId') || params.get('merchantOrderId');
    const xGlToken = params.get('x_gl_token') || params.get('token');

    const isSuccess = ['success','SUCCESS','TXN_SUCCESS','CHARGED'].includes(statusParam);
    const isFailed = ['failed','FAILED','failure','FAILURE','CANCELLED'].includes(statusParam);

    if (xGlToken || isSuccess || orderIdParam) {
      // Payment came back - clear cart and show success popup immediately
      setSuccessOrderId(orderIdParam || 'Completed');
      setShowSuccessPopup(true);
      refreshCart();
    } else if (isFailed) {
      setError('Payment failed or was cancelled. Please try again.');
    }
  }, [location]);`;

code = code.slice(0, start) + newBlock + code.slice(end);

// We must also remove the spinner block so it doesn't cover the popup!
// We can just find the block and remove it.
const spinnerStart = code.indexOf("if (cartItems.length === 0 && !showSuccessPopup && !error && !isVerifyingPayment) {");
if (spinnerStart !== -1) {
  const spinnerEnd = code.indexOf("  }", spinnerStart) + 3;
  // Replace it with an empty div, or just return nothing, or let the rest of the checkout page render empty
  const replacement = `if (cartItems.length === 0 && !showSuccessPopup && !error) {
    return (
      <div className="checkout-page-wrapper" style={{ alignItems: 'center', padding: '50px' }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', background: '#16A34A', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Go to Home</button>
      </div>
    );
  }`;
  code = code.slice(0, spinnerStart) + replacement + code.slice(spinnerEnd);
  console.log("Spinner block removed and replaced with empty cart message.");
}

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Redirect logic successfully injected');
