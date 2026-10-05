const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

code = code.replace("value=\"paytm\" checked={true} readOnly", "value=\"payglocal\" checked={true} readOnly");
code = code.replace(">Paytm / UPI / Cards</span>", ">PayGlocal (Credit/Debit/International)</span>");

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Done');
