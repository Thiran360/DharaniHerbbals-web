const fs = require('fs');

let cartCode = fs.readFileSync('src/context/CartContext.jsx', 'utf8');
cartCode = cartCode.replace(/if \(data\.grand_total !== undefined\) \{[\s\S]*?\}/g, 'setGrandTotal(null);');
fs.writeFileSync('src/context/CartContext.jsx', cartCode);

let checkoutCode = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');
checkoutCode = checkoutCode.replace(/<div className="total-row"><span>Tax Total<\/span><span>₹\{\(Number\(taxTotal\) \|\| 0\)\.toFixed\(2\)\}<\/span><\/div>/g, '');
fs.writeFileSync('src/pages/Checkout.jsx', checkoutCode);

console.log('Fixed');
