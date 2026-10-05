const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

const targetStr = `  useEffect(() => {
    if (showSuccessPopup) {
      refreshCart();
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup, navigate, refreshCart]);`;

const newStr = `  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        window.location.href = '/?order_placed=success';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
} else {
  code = code.replace(targetStr.replace(/\r\n/g, '\n'), newStr);
}

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Fixed infinite loop!');
