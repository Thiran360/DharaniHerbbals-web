import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

content = content.replace(
  /<div style=\{\{ display: 'flex', gap: '10px', width: '100%' \}\}>/g,
  '<div className="pd-action-buttons-row">'
);

fs.writeFileSync('src/pages/ProductDetails.jsx', content);

let cssContent = fs.readFileSync('src/pages/ProductDetails.css', 'utf8');
cssContent += `
.pd-action-buttons-row {
  display: flex;
  gap: 10px;
  width: 100%;
}
@media (max-width: 375px) {
  .pd-action-buttons-row {
    flex-direction: column;
  }
}
`;
fs.writeFileSync('src/pages/ProductDetails.css', cssContent);
