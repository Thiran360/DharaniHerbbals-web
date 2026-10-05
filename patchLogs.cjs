const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

const targetStr = `  useEffect(() => {
    const params = new URLSearchParams(location.search);`;

const newStr = `  useEffect(() => {
    console.log('--- CHECKOUT USE-EFFECT RUNNING ---');
    console.log('Location:', location.search);
    const params = new URLSearchParams(location.search);`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
} else {
  code = code.replace(targetStr.replace(/\r\n/g, '\n'), newStr);
}

// And let's add logs inside the fetch!
const targetFetch = `      fetch(\`\${API_BASE_URL}/payglocal/callback/\`, {`;
const newFetch = `      console.log('--- ABOUT TO FETCH CALLBACK ---', payload);
      fetch(\`\${API_BASE_URL}/payglocal/callback/\`, {`;

if (code.includes(targetFetch)) {
  code = code.replace(targetFetch, newFetch);
} else {
  code = code.replace(targetFetch.replace(/\r\n/g, '\n'), newFetch);
}

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Logs added');
