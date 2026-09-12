const fs = require('fs');

// 1. Update ProductsContext.jsx
let ctx = fs.readFileSync('src/context/ProductsContext.jsx', 'utf8');

ctx = ctx.replace(/if \(n\.includes\('hibiscus'\)\) return 5\.0;/g, "if (n.includes('chemparuthi herbal shampoo')) return 5.0;");
ctx = ctx.replace(/if \(n\.includes\('hibiscus'\)\) return 4;/g, "if (n.includes('chemparuthi herbal shampoo')) return 4;");

fs.writeFileSync('src/context/ProductsContext.jsx', ctx, 'utf8');

// 2. Update ProductDetails.jsx
let det = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');

det = det.replace(/if \(n\.includes\('hibiscus'\)\) \{/g, "if (n.includes('chemparuthi herbal shampoo')) {");

fs.writeFileSync('src/pages/ProductDetails.jsx', det, 'utf8');
