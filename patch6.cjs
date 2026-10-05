const fs = require('fs');

let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Inject isB2BUserUI
const userState = 'const [user, setUser] = useState(null);';
const userStateRepl = 'const [user, setUser] = useState(null);\n  const isB2BUserUI = user?.is_store_member || [\\'retailer\\', \\'reseller\\', \\'staff\\'].includes(user?.role);';
code = code.replace(userState, userStateRepl);

// Conditionally render Payment Method
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
                          <span style={{ fontWeight: '600', color: '#111827', fontSize: '1.1rem' }}>Pay Later (Credit Account)</span>
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

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('UI updated for B2B payment method');
