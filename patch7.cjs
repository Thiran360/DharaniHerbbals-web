const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

code = code.replace(/const data = await checkoutRes\.json\(\);/g, 'const text = await checkoutRes.text(); let data = {}; try { data = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error on checkoutRes:", text); }');
code = code.replace(/const savedAddr = await addrRes\.json\(\);/g, 'const text = await addrRes.text(); let savedAddr = {}; try { savedAddr = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error on addrRes:", text); }');
code = code.replace(/const errData = await addrRes\.json\(\);/g, 'const text = await addrRes.text(); let errData = {}; try { errData = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error on addrRes err:", text); }');

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('JSON parsing made safe');
