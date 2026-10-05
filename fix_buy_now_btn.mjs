import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductDetails.css', 'utf8');

const regex = /\.premium-buy-now-btn \{[\s\S]*?\}\s*\.premium-buy-now-btn:hover \{[\s\S]*?\}\s*@media \(max-width: 480px\) \{\s*\.premium-buy-now-btn \{[\s\S]*?\}\s*\}/;

const replacement = `.premium-buy-now-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f172a;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 46px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
  width: 100%;
}
.premium-buy-now-btn:hover {
  background-color: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(15, 23, 42, 0.3);
}
@media (max-width: 768px) {
  .premium-buy-now-btn {
    height: 52px !important;
    min-height: 52px !important;
    font-size: 1.1rem;
    border-radius: 12px;
    width: 100%;
  }
}`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/pages/ProductDetails.css', content);
