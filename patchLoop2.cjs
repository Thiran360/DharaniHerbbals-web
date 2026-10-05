const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

const startStr = '  useEffect(() => {\r\n    if (showSuccessPopup) {';
let startIdx = code.indexOf(startStr);
if (startIdx === -1) {
  startIdx = code.indexOf('  useEffect(() => {\n    if (showSuccessPopup) {');
}

if (startIdx !== -1) {
  const endStr = '  }, [showSuccessPopup, navigate, refreshCart]);';
  let endIdx = code.indexOf(endStr, startIdx);
  if (endIdx !== -1) {
    endIdx += endStr.length;
    
    const newStr = `  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        window.location.href = '/?order_placed=success';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);`;
  
    code = code.slice(0, startIdx) + newStr + code.slice(endIdx);
    fs.writeFileSync('src/pages/Checkout.jsx', code);
    console.log('Force fixed infinite loop!');
  } else {
    console.log('End str not found');
  }
} else {
  console.log('Start str not found');
}
