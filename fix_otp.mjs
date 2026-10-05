import fs from 'fs';
let content = fs.readFileSync('src/pages/Login.jsx', 'utf8');

content = content.replace(
  'setSuccessMsg(\'OTP sent successfully to your mobile number.\');\n        setOtpValue(\'\');\n        setShowOtp(true);',
  'setSuccessMsg(\'OTP sent successfully to your mobile number.\');\n        const receivedOtp = data.otp || data.data?.otp || data.code || data.user?.otp || data.otp_code;\n        if (receivedOtp) {\n          const otpStr = String(receivedOtp).replace(/\\\\D/g, \\'\\').slice(0, 6);\n          setOtpValue(otpStr);\n        } else {\n          setOtpValue(\\'\\');\n        }\n        setShowOtp(true);'
);

content = content.replace(
  'setSuccessMsg(\'OTP sent successfully to your mobile number.\');\r\n        setOtpValue(\'\');\r\n        setShowOtp(true);',
  'setSuccessMsg(\'OTP sent successfully to your mobile number.\');\r\n        const receivedOtp = data.otp || data.data?.otp || data.code || data.user?.otp || data.otp_code;\r\n        if (receivedOtp) {\r\n          const otpStr = String(receivedOtp).replace(/\\\\D/g, \\'\\').slice(0, 6);\r\n          setOtpValue(otpStr);\r\n        } else {\r\n          setOtpValue(\\'\\');\r\n        }\r\n        setShowOtp(true);'
);

content = content.replace(
  'setSuccessMsg(\'OTP sent successfully to your mobile number.\');\n        setOtpValue(\'\');\n        setResendTimer(30);',
  'setSuccessMsg(\'OTP sent successfully to your mobile number.\');\n        const receivedOtp = data.otp || data.data?.otp || data.code || data.user?.otp || data.otp_code;\n        if (receivedOtp) {\n          const otpStr = String(receivedOtp).replace(/\\\\D/g, \\'\\').slice(0, 6);\n          setOtpValue(otpStr);\n        } else {\n          setOtpValue(\\'\\');\n        }\n        setResendTimer(30);'
);

content = content.replace(
  'setSuccessMsg(\'OTP sent successfully to your mobile number.\');\r\n        setOtpValue(\'\');\r\n        setResendTimer(30);',
  'setSuccessMsg(\'OTP sent successfully to your mobile number.\');\r\n        const receivedOtp = data.otp || data.data?.otp || data.code || data.user?.otp || data.otp_code;\r\n        if (receivedOtp) {\r\n          const otpStr = String(receivedOtp).replace(/\\\\D/g, \\'\\').slice(0, 6);\r\n          setOtpValue(otpStr);\r\n        } else {\r\n          setOtpValue(\\'\\');\r\n        }\r\n        setResendTimer(30);'
);

fs.writeFileSync('src/pages/Login.jsx', content);

