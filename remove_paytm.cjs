const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

code = code.replace(
  /const \[paymentMethod, setPaymentMethod\] = useState\('paytm'\);/,
  "const [paymentMethod, setPaymentMethod] = useState('payglocal');"
);

// Remove the paytm UI option
code = code.replace(
  /<label className=\{paymentMethod === 'paytm'[\s\S]*?<\/label>\s*<label className=\{paymentMethod === 'payglocal'/g,
  "<label className={paymentMethod === 'payglocal'"
);

// Remove marginTop: '12px' from payglocal
code = code.replace(
  /background: paymentMethod === 'payglocal' \? '#F0FDF4' : '#fff', marginTop: '12px' \}\}/g,
  "background: paymentMethod === 'payglocal' ? '#F0FDF4' : '#fff' }}"
);

// Remove Paytm API Logic
const paytmLogicRegex = /if \(paymentMethod === 'paytm'\) \{[\s\S]*?\} else if \(paymentMethod === 'payglocal'\) \{/m;
code = code.replace(paytmLogicRegex, "if (paymentMethod === 'payglocal') {");

fs.writeFileSync('src/pages/Checkout.jsx', code, 'utf8');
console.log('done paytm removal');
