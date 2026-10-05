const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Add loading check to handlePlaceOrder
const target1 = '  const handlePlaceOrder = async (e) => {';
const replacement1 = '  const handlePlaceOrder = async (e) => {\n    if (loading) return;';
code = code.replace(target1, replacement1);

// Fix guest name in payload
const target2 = 'name: formData.full_name || "Customer",';
const replacement2 = 'name: formData.full_name || "Guest User",';
code = code.replace(target2, replacement2);

// Fix GST display in checkout
code = code.replace(/<div className="total-row"><span>CGST<\/span><span>₹\{\(Number\(cgst\) \|\| 0\)\.toFixed\(2\)\}<\/span><\/div>/g, '');
code = code.replace(/<div className="total-row"><span>SGST<\/span><span>₹\{\(Number\(sgst\) \|\| 0\)\.toFixed\(2\)\}<\/span><\/div>/g, '');
code = code.replace(/<div className="total-row"><span>IGST<\/span><span>₹\{\(Number\(igst\) \|\| 0\)\.toFixed\(2\)\}<\/span><\/div>/g, '');

// Remove taxAmount from total_amount calc
code = code.replace(/total_amount: grandTotal !== null \? grandTotal : parseFloat\(\(cartTotal \+ \(shippingCost \|\| 0\) \+ \(taxAmount \|\| 0\)\)\.toFixed\(2\)\),/g, 'total_amount: grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0)).toFixed(2)),');
code = code.replace(/amount: grandTotal !== null \? grandTotal : parseFloat\(\(cartTotal \+ \(shippingCost \|\| 0\) \+ \(taxAmount \|\| 0\)\)\.toFixed\(2\)\),/g, 'amount: grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0)).toFixed(2)),');

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Checkout.jsx patched');
