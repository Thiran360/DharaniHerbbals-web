import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductDetails.css', 'utf8');

const target = '.pd-premium-actions-wrapper {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-top: 12px;\n  margin-bottom: 12px;\n}';
const targetWin = target.replace(/\n/g, '\r\n');

const replacement = '.pd-premium-actions-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 16px;\n  margin-top: 12px;\n  margin-bottom: 12px;\n  width: 100%;\n}';
const replacementWin = replacement.replace(/\n/g, '\r\n');

if (content.includes(target)) {
  content = content.replace(target, replacement);
} else if (content.includes(targetWin)) {
  content = content.replace(targetWin, replacementWin);
}

fs.writeFileSync('src/pages/ProductDetails.css', content);

