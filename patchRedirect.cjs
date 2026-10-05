const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Find the callback useEffect and replace it with simple redirect
const start = code.indexOf("useEffect(() => {\r\n    const params = new URLSearchParams(location.search);");
const end = code.indexOf("  }, [location]);", start) + "  }, [location]);".length;

const newBlock = `useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderIdParam = params.get('order_id') || params.get('orderId') || params.get('merchantOrderId');
    const statusParam = params.get('order_status') || params.get('status') || params.get('payment_status');
    const xGlToken = params.get('x_gl_token') || params.get('token');

    const isSuccess = ['success','SUCCESS','TXN_SUCCESS','CHARGED'].includes(statusParam);
    const isFailed = ['failed','FAILED','failure','FAILURE','CANCELLED'].includes(statusParam);

    if (xGlToken || isSuccess || orderIdParam) {
      // Payment came back - clear cart and go home immediately
      refreshCart();
      navigate('/?order_placed=success');
    } else if (isFailed) {
      setError('Payment failed or was cancelled. Please try again.');
    }
  }, [location]);`;

code = code.slice(0, start) + newBlock + code.slice(end);
fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Fixed - redirect to home on success');
