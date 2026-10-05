import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductDetails.css', 'utf8');
if (!content.includes('.premium-buy-now-btn')) {
  content += '\n\n/* Buy Now Button Styles */\n.premium-buy-now-btn {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-color: #f1f5f9;\n  color: #0f172a;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  font-weight: 600;\n  font-size: 1rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  padding: 0 1.5rem;\n  height: 3rem;\n}\n.premium-buy-now-btn:hover {\n  background-color: #e2e8f0;\n  border-color: #94a3b8;\n}\n@media (max-width: 480px) {\n  .premium-buy-now-btn {\n    font-size: 0.9rem;\n    padding: 0 1rem;\n  }\n}\n';
  fs.writeFileSync('src/pages/ProductDetails.css', content);
}

