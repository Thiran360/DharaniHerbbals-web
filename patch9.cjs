const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// 1. Add isB2BUserUI
const userStateRepl = 'const [user, setUser] = useState(null);\n  const isB2BUserUI = user?.is_store_member || [\\"retailer\\", \\"reseller\\", \\"staff\\"].includes(user?.role);';
code = code.replace('const [user, setUser] = useState(null);', userStateRepl);

// 2. Replace payment UI
const targetHTML = `<div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label className={paymentMethod === 'payglocal' ? 'payment-option selected' : 'payment-option'} style={{ flex: 1, padding: '20px', border: paymentMethod === 'payglocal' ? '2px solid #16A34A' : '1px solid #E5E7EB', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: paymentMethod === 'payglocal' ? '#F0FDF4' : '#fff' }} onClick={() => setPaymentMethod('payglocal')}>
                        <input type="radio" name="paymentMethod" value="payglocal" checked={paymentMethod === 'payglocal'} readOnly style={{ accentColor: '#16A34A', width: '20px', height: '20px' }} />
                        <span style={{ fontWeight: '600', color: '#111827', fontSize: '1.1rem' }}>PayGlocal (Credit/Debit/International)</span>
                      </label>
                    </div>`;

const replacementHTML = `{isB2BUserUI ? (
                      <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label className="payment-option selected" style={{ flex: 1, padding: '20px', border: '2px solid #16A34A', borderRadius: '12px', cursor: 'default', display: 'flex', alignItems: 'center', gap: '12px', background: '#F0FDF4' }}>
                          <input type="radio" name="paymentMethod" value="credit" checked={true} readOnly style={{ accentColor: '#16A34A', width: '20px', height: '20px' }} />
                          <span style={{ fontWeight: '600', color: '#111827', fontSize: '1.1rem' }}>Credit Account (Pay Later)</span>
                        </label>
                      </div>
                    ) : (
                      <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label className={paymentMethod === 'payglocal' ? 'payment-option selected' : 'payment-option'} style={{ flex: 1, padding: '20px', border: paymentMethod === 'payglocal' ? '2px solid #16A34A' : '1px solid #E5E7EB', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: paymentMethod === 'payglocal' ? '#F0FDF4' : '#fff' }} onClick={() => setPaymentMethod('payglocal')}>
                          <input type="radio" name="paymentMethod" value="payglocal" checked={paymentMethod === 'payglocal'} readOnly style={{ accentColor: '#16A34A', width: '20px', height: '20px' }} />
                          <span style={{ fontWeight: '600', color: '#111827', fontSize: '1.1rem' }}>PayGlocal (Credit/Debit/International)</span>
                        </label>
                      </div>
                    )}`;
code = code.replace(targetHTML, replacementHTML);

// 3. Fix scoping and isB2BActual check
const tryBlockTarget = `    try {
      let internalOrderId = createdOrderId;

      const isB2BUser = user?.is_store_member || ['retailer', 'reseller', 'staff'].includes(user?.role);

      if (!internalOrderId) {`;

const tryBlockRepl = `    let checkoutData = null;
    try {
      let internalOrderId = createdOrderId;

      const isB2BUser = user?.is_store_member || ['retailer', 'reseller', 'staff'].includes(user?.role);

      if (!internalOrderId) {`;
code = code.replace(tryBlockTarget, tryBlockRepl);

const jsonSafeTarget = `const text = await checkoutRes.text(); let data = {}; try { data = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error on checkoutRes:", text); }
        console.log('Step 1 (Checkout) response:', data);`;

const jsonSafeRepl = `const text = await checkoutRes.text(); let data = {}; try { data = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error on checkoutRes:", text); }
        checkoutData = data;
        console.log('Step 1 (Checkout) response:', data);`;
code = code.replace(jsonSafeTarget, jsonSafeRepl);

// Wait, the original code doesn't have isB2BActual right now because `git checkout` removed it! 
// Let's add it back.
const b2bTarget = `      const calculatedAmount = grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0)).toFixed(2));

      const isB2B = user?.is_store_member || ['retailer', 'reseller', 'staff'].includes(user?.role);
      
      if (isB2B) {
        setSuccessOrderId(internalOrderId);`;

const b2bRepl = `      const calculatedAmount = grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0)).toFixed(2));

      const isB2B = user?.is_store_member || ['retailer', 'reseller', 'staff'].includes(user?.role);
      const backendRole = checkoutData?.role || checkoutData?.customer_role || checkoutData?.customer_type;
      const isB2BActual = isB2B || ['retailer', 'reseller', 'staff'].includes(backendRole) || checkoutData?.payment_method === 'credit';
      
      if (isB2BActual) {
        setSuccessOrderId(internalOrderId);`;
code = code.replace(b2bTarget, b2bRepl);

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('Restored all fixes');
