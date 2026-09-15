const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.jsx', 'utf8');

const regex = /<input type="text" value=\{profileFormData\.mobile !== undefined \? profileFormData\.mobile : mobile\} onChange=\{\(e\) => setProfileFormData\(\{ \.\.\.profileFormData, mobile: e\.target\.value \}\)\} required \/>/g;

const replacement = '<input type="text" value={profileFormData.mobile !== undefined ? profileFormData.mobile : mobile} disabled style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed", color: "#6b7280" }} />';

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/Profile.jsx', code, 'utf8');
console.log('Success');
