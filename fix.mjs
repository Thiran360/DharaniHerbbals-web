import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');
content = content.replace(
  '<button type=\"button\" className=\"premium-add-btn\" onClick={() => addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id)}>',
  '<div style={{ display: \'flex\', gap: \'10px\', width: \'100%\' }}>\n              <button type=\"button\" className=\"premium-add-btn\" onClick={() => addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id)}>'
);
content = content.replace(
  '<span>{t(\'addToCart\')}</span>\r\n            </button>',
  '<span>{t(\'addToCart\')}</span>\r\n            </button>\r\n            <button type=\"button\" className=\"premium-buy-now-btn\" onClick={() => { addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id); navigate(\'/checkout\'); }}><span>Buy Now</span></button>\r\n            </div>'
);
content = content.replace(
  '<span>{t(\'addToCart\')}</span>\n            </button>',
  '<span>{t(\'addToCart\')}</span>\n            </button>\n            <button type=\"button\" className=\"premium-buy-now-btn\" onClick={() => { addToCart(product, quantity, selectedVariation?.id || selectedVariation?.variation_id); navigate(\'/checkout\'); }}><span>Buy Now</span></button>\n            </div>'
);
fs.writeFileSync('src/pages/ProductDetails.jsx', content);

