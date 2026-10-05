const fs = require('fs');

let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Add isB2BUserUI to component scope
const compStart = 'export default function Checkout() {';
const compStartRepl = 'export default function Checkout() {\n  const isB2BUserUI = user?.is_store_member || [\'retailer\', \'reseller\', \'staff\'].includes(user?.role);';
// Wait, 'user' is only defined after useState inside the component, so I must place it after 'user' is defined.
