const fs = require('fs');

let content = fs.readFileSync('src/context/ProductsContext.jsx', 'utf8');

content = content.replace(
  'rating: p.rating || "0.0",',
  'rating: (p.name && p.name.toLowerCase().includes("hibiscus")) ? 5.0 : (p.rating || "0.0"),'
);

content = content.replace(
  'reviews: p.stock > 0 ? (p.stock * 3) : 124,',
  'reviews: (p.name && p.name.toLowerCase().includes("hibiscus")) ? 4 : (p.stock > 0 ? (p.stock * 3) : 124),'
);

fs.writeFileSync('src/context/ProductsContext.jsx', content, 'utf8');
