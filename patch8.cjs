const fs = require('fs');

let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

const target1 = 'try {\n        let internalOrderId = createdOrderId;\n  \n        const isB2BUser = user?.is_store_member || [\\'retailer\\', \\'reseller\\', \\'staff\\'].includes(user?.role);\n  \n        if (!internalOrderId) {';
const repl1 = 'try {\n        let internalOrderId = createdOrderId;\n        let checkoutData = null;\n  \n        const isB2BUser = user?.is_store_member || [\\'retailer\\', \\'reseller\\', \\'staff\\'].includes(user?.role);\n  \n        if (!internalOrderId) {';
code = code.replace(target1, repl1);

const target2 = 'const text = await checkoutRes.text(); let data = {}; try { data = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error on checkoutRes:", text); }\n        console.log(\'Step 1 (Checkout) response:\', data);';
const repl2 = 'const text = await checkoutRes.text(); let data = {}; try { data = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error on checkoutRes:", text); }\n        checkoutData = data;\n        console.log(\'Step 1 (Checkout) response:\', data);';
code = code.replace(target2, repl2);

const target3 = 'const backendRole = data?.role || data?.customer_role || data?.customer_type;\n      const isB2BActual = isB2B || [\'retailer\', \'reseller\', \'staff\'].includes(backendRole) || data?.payment_method === \'credit\';';
const repl3 = 'const backendRole = checkoutData?.role || checkoutData?.customer_role || checkoutData?.customer_type;\n      const isB2BActual = isB2B || [\'retailer\', \'reseller\', \'staff\'].includes(backendRole) || checkoutData?.payment_method === \'credit\';';
code = code.replace(target3, repl3);

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Fixed ReferenceError');
