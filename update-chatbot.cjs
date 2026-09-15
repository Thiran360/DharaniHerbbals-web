const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.jsx', 'utf8');

code = code.replace(
  /const isCategoryRequest = inputLower\.includes\('section'\) \|\| inputLower\.includes\('category'\) \|\| inputLower\.includes\('all'\) \|\| inputLower\.includes\('products'\) \|\| inputLower\.includes\('list'\);/,
  "const isCategoryRequest = inputLower.includes('section') || inputLower.includes('category') || inputLower.includes('all') || inputLower.includes('products') || inputLower.includes('list') || inputLower.includes('variety') || inputLower.includes('varieties') || inputLower.includes('types') || inputLower.trim() === 'shampoo' || inputLower.trim() === 'shampoos' || inputLower.trim() === 'soap' || inputLower.trim() === 'soaps' || inputLower.trim() === 'powder' || inputLower.trim() === 'powders' || inputLower.trim() === 'oil' || inputLower.trim() === 'oils';"
);

fs.writeFileSync('src/components/Chatbot.jsx', code, 'utf8');
