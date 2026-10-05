const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// 1. Add return_url to the create payload
const createTarget = `                email: user?.email || guestInfo?.email || "customer@dharaniherbbals.in"
              })`;
const createReplacement = `                email: user?.email || guestInfo?.email || "customer@dharaniherbbals.in",
                return_url: window.location.origin + "/checkout"
              })`;
code = code.replace(createTarget, createReplacement);

// 2. Add x_gl_token handler in useEffect
const effectTarget = `      const orderIdParam = params.get('order_id') || params.get('orderId'); // Support both snake_case and camelCase`;
const effectReplacement = `      const orderIdParam = params.get('order_id') || params.get('orderId'); // Support both snake_case and camelCase
      const xGlToken = params.get('x_gl_token') || params.get('gl_token');

      if (xGlToken) {
        setLoading(true);
        fetch(\`\${API_BASE_URL}/payglocal/callback/?x_gl_token=\${xGlToken}\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ x_gl_token: xGlToken })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success || data.status === 'success' || data.message === 'Payment successful') {
                setSuccessOrderId('Completed');
                setShowSuccessPopup(true);
            } else {
                setError(data.message || 'Payment failed or verification failed.');
            }
        })
        .catch(err => {
            setError('Error verifying payment.');
        })
        .finally(() => {
            setLoading(false);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        });
        return;
      }`;
code = code.replace(effectTarget, effectReplacement);

// 3. Fix the \/payglocal/status/ bug
code = code.replace(/fetch\(`\\\/payglocal\/status\/`,/g, `fetch(\`\${API_BASE_URL}/payglocal/status/\`,`);

fs.writeFileSync('src/pages/Checkout.jsx', code, 'utf8');
console.log('Successfully injected POST callback logic!');
