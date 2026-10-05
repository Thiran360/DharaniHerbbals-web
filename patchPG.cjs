const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Find the marker to inject PayGlocal before the Paytm block
const markerStart = `      if (paymentMethod === 'paytm') {`;

const payglocalBlock = `      const calculatedAmount = grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0)).toFixed(2));

      // B2B users - skip payment gateway
      const isB2B = user?.is_store_member || ['retailer', 'reseller', 'staff'].includes(user?.role);
      const backendRole = checkoutData?.role || checkoutData?.customer_role || checkoutData?.customer_type;
      const isB2BActual = isB2B || ['retailer', 'reseller', 'staff'].includes(backendRole) || checkoutData?.payment_method === 'credit';
      if (isB2BActual) {
        setSuccessOrderId(internalOrderId);
        setShowSuccessPopup(true);
        setLoading(false);
        return;
      }

      // PayGlocal payment
      if (paymentMethod === 'payglocal') {
        try {
          const payglocalRes = await fetch(\`\${API_BASE_URL}/payglocal/create/\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({
              order_id: internalOrderId,
              amount: calculatedAmount,
              user_id: currentUserId,
              mobile: formData.phone || user?.mobile || '9999999999',
              email: user?.email || guestInfo?.email || 'customer@dharaniherbbals.in',
              return_url: window.location.origin + '/checkout'
            })
          });
          const pgText = await payglocalRes.text();
          let payglocalData = {};
          try { payglocalData = pgText ? JSON.parse(pgText) : {}; } catch(e) {}
          const redirectUrl = payglocalData.payment_url || payglocalData.redirect_url || payglocalData.response?.data?.redirectUrl;
          if (payglocalRes.ok && redirectUrl) {
            window.location.href = redirectUrl;
            return;
          } else {
            setError(payglocalData.message || payglocalData.error || 'Payment initiation failed. Please try again.');
            setLoading(false);
            return;
          }
        } catch (err) {
          setError('Network error while connecting to payment gateway. Please try again.');
          setLoading(false);
          return;
        }
      }

      if (paymentMethod === 'paytm') {`;

code = code.replace(markerStart, payglocalBlock);

// Remove the old redundant calculatedAmount + B2B block that was inside paytm if block
const oldBlock = `        const calculatedAmount = grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0)).toFixed(2));

      // Define checkoutData if we didn't go through the block
      if (typeof checkoutData === 'undefined') {
        var checkoutData = null;
      }

      const isB2B = user?.is_store_member || ['retailer', 'reseller', 'staff'].includes(user?.role);
      const backendRole = checkoutData?.role || checkoutData?.customer_role || checkoutData?.customer_type;
      const isB2BActual = isB2B || ['retailer', 'reseller', 'staff'].includes(backendRole) || checkoutData?.payment_method === 'credit';
      
      if (isB2BActual) {
        setSuccessOrderId(internalOrderId);
        setShowSuccessPopup(true);
        setLoading(false);
        return;
      }
        `;

code = code.replace(oldBlock, `        `);

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('PayGlocal flow added');
