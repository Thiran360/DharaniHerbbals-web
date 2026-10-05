const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

code = code.replace(/const calculatedAmount = grandTotal !== null \? grandTotal : parseFloat\(\(cartTotal \+ \(shippingCost \|\| 0\) \+ \(taxAmount \|\| 0\)\)\.toFixed\(2\)\);/g, 'const calculatedAmount = grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0)).toFixed(2));');

code = code.replace(/<span style=\{\{ fontSize: '1\.8rem', color: '#16A34A' \}\}>₹\{grandTotal !== null \? grandTotal\.toFixed\(2\) : \(cartTotal \+ \(shippingCost \|\| 0\) \+ \(taxAmount \|\| 0\)\)\.toFixed\(2\)\}<\/span>/g, '<span style={{ fontSize: "1.8rem", color: "#16A34A" }}>₹{grandTotal !== null ? grandTotal.toFixed(2) : (cartTotal + (shippingCost || 0)).toFixed(2)}</span>');

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Checkout.jsx tax calc cleaned');
