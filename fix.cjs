const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.jsx', 'utf8');
content = content.replace(/Vedan Mart<span className=\"brand-reg\">.*?<\/span>/g, 'Vedan Mart<span className=\"brand-reg\">®</span>');
content = content.replace(/<div className=\"brand-text-line2\".*?>Mart<span className=\"brand-reg\">.*?<\/span><\/div>/g, '');
fs.writeFileSync('src/components/Navbar.jsx', content, 'utf8');

let content2 = fs.readFileSync('src/components/Footer.jsx', 'utf8');
content2 = content2.replace(/<div className=\"brand-text-line2\".*?>Mart<\/div>/g, '');
content2 = content2.replace(/Vedan Mart<\/div>/g, 'Vedan Mart<span className=\"brand-reg\">®</span></div>');
fs.writeFileSync('src/components/Footer.jsx', content2, 'utf8');
