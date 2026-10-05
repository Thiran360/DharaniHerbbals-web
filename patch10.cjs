const fs = require('fs');
let code = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

const target1 = `        const checkoutRes = await fetch(\`\${API_BASE_URL}/checkout/\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(payload)
        });`;

const repl1 = `        const isB2BUser = user?.is_store_member || ['retailer', 'reseller', 'staff'].includes(user?.role);
        let checkoutRes;
        
        if (isB2BUser) {
           const crmPayload = {
               user_id: currentUserId,
               address_id: finalAddressId,
               payment_method: "credit",
               shipping_charges: parseFloat(shippingCost || 0),
               business_state: formData.state || 'Tamil Nadu',
               remarks: "Order from Web Checkout",
               items: cartItems.map(item => ({
                   product_id: item.id,
                   quantity: item.quantity,
                   ...(item.variation_id ? { variation_id: item.variation_id } : {})
               }))
           };

           const [res1, res2] = await Promise.all([
             fetch(\`\${API_BASE_URL}/checkout/\`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }, body: JSON.stringify(payload) }),
             fetch(\`\${API_BASE_URL}/crm/orders/create/\`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }, body: JSON.stringify(crmPayload) })
           ]);
           checkoutRes = res1;
        } else {
           checkoutRes = await fetch(\`\${API_BASE_URL}/checkout/\`, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'ngrok-skip-browser-warning': 'true'
             },
             body: JSON.stringify(payload)
           });
        }`;

code = code.replace(target1, repl1);

const target2 = `        const text = await checkoutRes.text(); let data = {}; try { data = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error on checkoutRes:", text); }
        console.log('Step 1 (Checkout) response:', data);

        if (!checkoutRes.ok) {`;

const repl2 = `        const text = await checkoutRes.text(); let data = {}; try { data = text ? JSON.parse(text) : {}; } catch(e) { console.error("JSON parse error on checkoutRes:", text); }
        let checkoutData = data;
        console.log('Step 1 (Checkout) response:', data);

        if (!checkoutRes.ok) {`;

code = code.replace(target2, repl2);

const target3 = `      const calculatedAmount = grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0)).toFixed(2));`;

const repl3 = `      const calculatedAmount = grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0)).toFixed(2));

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
      }`;

code = code.replace(target3, repl3);

fs.writeFileSync('src/pages/Checkout.jsx', code);
console.log('All missing code restored');
