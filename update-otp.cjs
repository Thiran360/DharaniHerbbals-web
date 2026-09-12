const fs = require('fs');

let login = fs.readFileSync('src/pages/Login.jsx', 'utf8');
login = login.replace(/setApiOtp\(otpStr\);\s*setOtpValue\(otpStr\);/g, 'setApiOtp(otpStr);\n          // setOtpValue(otpStr); // Removed to prevent autofill');
fs.writeFileSync('src/pages/Login.jsx', login, 'utf8');

let forgot = fs.readFileSync('src/pages/ForgotPassword.jsx', 'utf8');
forgot = forgot.replace(/setOtp\(String\(receivedOtp\)\.replace\(\/\\D\/g, ''\)\.slice\(0, 6\)\);/, '// setOtp(String(receivedOtp).replace(/\\\\D/g, \\'\\').slice(0, 6)); // Removed to prevent autofill');
fs.writeFileSync('src/pages/ForgotPassword.jsx', forgot, 'utf8');
