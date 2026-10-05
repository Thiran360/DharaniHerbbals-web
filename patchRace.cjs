const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

code = code.replace(
  'if (cartItems.length === 0 && !showSuccessPopup && !error && !isVerifyingPayment) {',
  'const hasPaymentParams = new URLSearchParams(location.search).has(\'order_status\') || new URLSearchParams(location.search).has(\'order_id\') || new URLSearchParams(location.search).has(\'x_gl_token\');\n  if (cartItems.length === 0 && !showSuccessPopup && !error && !isVerifyingPayment && !hasPaymentParams) {'
);

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Fixed');
