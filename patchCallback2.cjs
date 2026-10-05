const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Find the useEffect block start
const start = code.indexOf("useEffect(() => {\r\n    const params = new URLSearchParams(location.search);");
const end = code.indexOf("  }, [location]);", start) + "  }, [location]);".length;

console.log('start:', start, 'end:', end);
console.log('Old block:', JSON.stringify(code.slice(start, start+100)));

const newBlock = `useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('order_status') || params.get('status') || params.get('payment_status') || params.get('txStatus');
    const orderIdParam = params.get('order_id') || params.get('orderId') || params.get('merchantOrderId');
    const xGlToken = params.get('x_gl_token') || params.get('token');

    const isSuccess = ['success','SUCCESS','TXN_SUCCESS','CHARGED'].includes(statusParam);
    const isFailed = ['failed','FAILED','failure','FAILURE','CANCELLED'].includes(statusParam);

    if (xGlToken) {
      setLoading(true);
      fetch(\`\${API_BASE_URL}/payglocal/status/\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ x_gl_token: xGlToken, order_id: orderIdParam })
      })
        .then(res => res.text())
        .then(text => { try { return JSON.parse(text); } catch(e) { return {}; } })
        .then(() => { setSuccessOrderId(orderIdParam || 'Completed'); setShowSuccessPopup(true); refreshCart(); })
        .catch(() => { setSuccessOrderId(orderIdParam || 'Completed'); setShowSuccessPopup(true); refreshCart(); })
        .finally(() => setLoading(false));
    } else if (isSuccess) {
      setSuccessOrderId(orderIdParam || 'Completed');
      setShowSuccessPopup(true);
      refreshCart();
    } else if (isFailed) {
      setError('Payment failed or was cancelled. Please try again.');
    } else if (orderIdParam) {
      setSuccessOrderId(orderIdParam);
      setShowSuccessPopup(true);
      refreshCart();
    }
  }, [location]);`;

code = code.slice(0, start) + newBlock + code.slice(end);
fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Callback handler updated');
