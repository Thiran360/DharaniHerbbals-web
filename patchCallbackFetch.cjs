const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

const targetStr = `    if (xGlToken || isSuccess || orderIdParam) {
      setSuccessOrderId(orderIdParam || 'Completed');
      setShowSuccessPopup(true);
      setTimeout(() => refreshCart(), 500);
    }`;

const newStr = `    if (xGlToken || isSuccess || orderIdParam) {
      // Fetch backend callback so backend knows payment was successful
      setLoading(true);
      
      const payload = { 
        order_id: orderIdParam, 
        order_status: statusParam || 'success',
      };
      if (xGlToken) payload.x_gl_token = xGlToken;

      fetch(\`\${API_BASE_URL}/payglocal/callback/\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(payload)
      })
      .then(res => res.text())
      .then(() => {
         setSuccessOrderId(orderIdParam || 'Completed');
         setShowSuccessPopup(true);
         setTimeout(() => refreshCart(), 500);
      })
      .catch(err => {
         console.error('Callback error:', err);
         // Show success anyway on frontend so user is not blocked
         setSuccessOrderId(orderIdParam || 'Completed');
         setShowSuccessPopup(true);
         setTimeout(() => refreshCart(), 500);
      })
      .finally(() => setLoading(false));
    }`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
} else {
  code = code.replace(targetStr.replace(/\r\n/g, '\n'), newStr);
}

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Added callback fetch');
