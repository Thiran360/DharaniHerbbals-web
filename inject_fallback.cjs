const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

const regex = /if\s*\(paymentMethod\s*===\s*'paytm'\)\s*\{[\s\S]*?if\s*\(paymentMethod\s*===\s*'payglocal'\)\s*\{[\s\S]*?setError\('Please select a valid payment method\.'\);\s*setLoading\(false\);\s*return;\s*\}/;

const newLogic = `      let payglocalFailed = false;

      if (paymentMethod === 'payglocal') {
          try {
            const payglocalRes = await fetch(\`\${API_BASE_URL}/payglocal/create/\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
              },
              body: JSON.stringify({
                order_id: internalOrderId,
                amount: calculatedAmount,
                user_id: currentUserId,
                mobile: formData.phone || user?.mobile || "9999999999",
                email: user?.email || guestInfo?.email || "customer@dharaniherbbals.in"
              })
            });
            const payglocalData = await payglocalRes.json();
            
            const redirectUrl = payglocalData.payment_url || payglocalData.redirect_url || payglocalData.response?.data?.redirectUrl;
            
            if (payglocalRes.ok && redirectUrl) {
              window.location.href = redirectUrl;
              return;
            } else {
              console.warn("PayGlocal Failed, triggering Paytm fallback. Error:", payglocalData);
              payglocalFailed = true;
            }
          } catch (err) {
            console.error("PayGlocal network error, triggering fallback...", err);
            payglocalFailed = true;
          }
      }

      if (paymentMethod === 'paytm' || payglocalFailed) {
        if (!window.Paytm || !window.Paytm.CheckoutJS) {
          alert('Payment Gateway is still loading or unavailable. Please wait a second and try again.');
          setLoading(false);
          return;
        }

        try {
          // Call Paytm Initiate API
          const paytmRes = await fetch(\`\${API_BASE_URL}/create-paytm-order/\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
              order_id: internalOrderId,
              amount: calculatedAmount,
              user_id: currentUserId,
              mobile: formData.phone || user?.mobile || "9999999999",
              email: user?.email || guestInfo?.email || "customer@dharaniherbbals.in"
            })
          });

          let paytmData;
          try {
            paytmData = await paytmRes.json();
          } catch (e) {
            paytmData = { error: 'Invalid response from server' };
          }

          const txnToken = paytmData.paytm_response?.body?.txnToken || paytmData.txnToken;
          const orderId = paytmData.paytm_order_id || paytmData.order_id || paytmData.orderId || internalOrderId;

          if (!paytmRes.ok || !txnToken || (paytmData.paytm_response?.body?.resultInfo?.resultStatus === 'F')) {
            const errorMsg = paytmData.paytm_response?.body?.resultInfo?.resultMsg || 'Failed to initiate Paytm payment (Missing Token).';
            setError(\`Payment Error: \${errorMsg}\`);
            setLoading(false);
            return;
          }

          paytmData.amount = paytmData.amount || calculatedAmount;
          const safeOrderId = String(orderId).trim();

          const config = {
            root: '',
            flow: 'DEFAULT',
            data: {
              orderId: safeOrderId,
              token: String(txnToken).trim(),
              tokenType: 'TXN_TOKEN',
              amount: String(paytmData.amount).trim()
            },
            handler: {
              notifyMerchant: function (eventName, data) {
                console.log('PAYTM EVENT:', eventName, data);
              },
              transactionStatus: async function (paymentStatus) {
                console.log('PAYMENT STATUS RETURNED:', paymentStatus);
                if (window.Paytm && window.Paytm.CheckoutJS) {
                  window.Paytm.CheckoutJS.close();
                }

                try {
                  const statusRes = await fetch(\`\${API_BASE_URL}/paytm/status/\`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify({ order_id: safeOrderId })
                  });
                  const statusData = await statusRes.json();

                  if (statusData.success === true || statusData.status === 'TXN_SUCCESS' || statusData.payment_status === 'TXN_SUCCESS') {
                    setSuccessOrderId(safeOrderId);
                    setShowSuccessPopup(true);
                  } else {
                    setError('Payment failed or was cancelled.');
                    setCreatedOrderId(null);
                    setSuccessOrderId(null);
                  }
                } catch (err) {
                  console.error('Paytm status check error:', err);
                }
              }
            }
          };

          if (window.__paytm_initializing) return;
          window.__paytm_initializing = true;

          window.Paytm.CheckoutJS.init(config).then(function () {
            window.__paytm_initializing = false;
            window.Paytm.CheckoutJS.invoke();
          }).catch(function (error) {
            window.__paytm_initializing = false;
            console.error('Paytm INIT ERROR', error);
            setError('Payment Gateway failed to initialize. Please try again.');
            setCreatedOrderId(null);
            setLoading(false);
          });
          
          return; // Stop here, wait for popup
        } catch (err) {
            console.error(err);
            setError('Failed to initiate payment. Please try again.');
            setLoading(false);
            return;
        }
      }`;

if (regex.test(code)) {
  code = code.replace(regex, newLogic);
  fs.writeFileSync('src/pages/Checkout.jsx', code, 'utf8');
  console.log('Successfully injected fallback logic!');
} else {
  console.log('Regex did not match.');
}
