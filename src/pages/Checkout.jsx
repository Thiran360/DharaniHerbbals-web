import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, CheckCircle, ArrowLeft, Loader2, Plus, Navigation, Trash2, Edit2, ChevronDown, UserCircle, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuthModal } from '../context/AuthModalContext';
import './Checkout.css';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function Checkout() {
  const { cartItems, cartTotal, shippingCost, taxAmount, cgst, sgst, igst, taxTotal, grandTotal, refreshCart } = useCart();
  const { language } = useLanguage();
  const { openLoginModal } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('order_status');
    const orderIdParam = params.get('order_id') || params.get('orderId'); // Support both snake_case and camelCase

    if (statusParam === 'success') {
      if (orderIdParam) {
        setLoading(true);
<<<<<<< HEAD
        fetch('https://api.codingboss.in/herbal/paytm/status/', {
=======
        fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/paytm/status/', {
>>>>>>> master
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ order_id: String(orderIdParam) })
        })
          .then(res => res.json())
          .then(statusData => {
            if (
              statusData.success === true ||
              statusData.body?.resultInfo?.resultStatus === 'TXN_SUCCESS' ||
              statusData.status === 'TXN_SUCCESS' ||
              statusData.payment_status === 'TXN_SUCCESS' ||
              statusData.message === 'Payment updated'
            ) {
              setSuccessOrderId(orderIdParam);
              setShowSuccessPopup(true);
            } else {
              setError(statusData.message || 'Payment verification failed on the server.');
            }
          })
          .catch(err => {
            console.error("Status verification error:", err);
            // Fallback to success if network error but url says success, to avoid blocking user
            setSuccessOrderId(orderIdParam);
            setShowSuccessPopup(true);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // If they didn't pass order_id in URL, just show success directly
        setSuccessOrderId('Completed');
        setShowSuccessPopup(true);
      }
    } else if (statusParam === 'failed') {
      setError('Payment failed or was cancelled during redirect.');
    }
  }, [location]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('paytm');
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [isPaytmLoaded, setIsPaytmLoaded] = useState(true); // Assume loaded from index.html

  const loadPaytmScript = (mid) => {
    return new Promise((resolve) => {
      // Remove any existing script to ensure a fresh load if retrying
      const existingScript = document.getElementById('paytm-checkout-script');
      if (existingScript) existingScript.remove();

      // Delete any cached Paytm object from memory
      if (window.Paytm) delete window.Paytm;

      const script = document.createElement("script");
      script.id = 'paytm-checkout-script';
      script.src = `https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${mid}.js`;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const [guestInfo, setGuestInfo] = useState({ name: '', email: '' });

  const [isContactConfirmed, setIsContactConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '11.0168',
    longitude: '76.9558',
    is_default: false
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [checkoutView, setCheckoutView] = useState('selected'); // 'selected', 'list', 'form'
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [showFullAddressForm, setShowFullAddressForm] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (showSuccessPopup) {
      refreshCart();
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup, navigate, refreshCart]);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const userData = parsed.user || parsed;
        setUser(userData);

        // Initialize guest info if available
<<<<<<< HEAD
        if (userData.name === 'Guest User' || userData.name === 'Dharani Customer' || userData.email?.includes('@guest.com')) {
=======
        if (userData.name === 'Guest User' || userData.name === 'Vedan Customer' || userData.email?.includes('@guest.com')) {
>>>>>>> master
          setGuestInfo({ name: '', email: '' });
        } else {
          setGuestInfo({ name: userData.name || '', email: userData.email || '' });
        }

        const currentUserId = userData.id || userData.user_id;

        // Fetch addresses from backend
<<<<<<< HEAD
        fetch(`https://api.codingboss.in/herbal/address/${currentUserId}/`, {
=======
        fetch(`https://concise-egomaniac-starved.ngrok-free.dev/herbal/address/${currentUserId}/`, {
>>>>>>> master
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
          .then(async res => {
            const text = await res.text();
            let parsedData = {};
            try {
              parsedData = JSON.parse(text);
            } catch (e) {
              // ignore JSON parse error
            }

            if (!res.ok) {
              if (res.status === 400 && parsedData.message && parsedData.message.includes('No User matches')) {
                throw new Error('USER_NOT_FOUND');
              }
              throw new Error(parsedData.message || 'API Error');
            }

            return parsedData;
          })
          .then(data => {
            let loadedAddresses = [];
            if (data && Array.isArray(data.addresses)) {
              loadedAddresses = data.addresses;
            } else if (Array.isArray(data)) {
              loadedAddresses = data;
            }

            setSavedAddresses(loadedAddresses);
            if (loadedAddresses.length > 0) {
              setSelectedAddressId(loadedAddresses[0].id);
              setFormData(loadedAddresses[0]);
              setCheckoutView('selected');
<<<<<<< HEAD
              if (userData.name === 'Guest User' || userData.name === 'Dharani Customer' || userData.email?.includes('@guest.com')) {
=======
              if (userData.name === 'Guest User' || userData.name === 'Vedan Customer' || userData.email?.includes('@guest.com')) {
>>>>>>> master
                setActiveStep(1);
              } else {
                setActiveStep(2);
              }
            } else {
              setCheckoutView('form');
              setShowFullAddressForm(false);
              setIsManualEntry(false);
<<<<<<< HEAD
              if (userData.name === 'Guest User' || userData.name === 'Dharani Customer' || userData.email?.includes('@guest.com')) {
=======
              if (userData.name === 'Guest User' || userData.name === 'Vedan Customer' || userData.email?.includes('@guest.com')) {
>>>>>>> master
                setActiveStep(1);
              } else {
                setActiveStep(2);
              }
              if (userData.name) setFormData(prev => ({ ...prev, full_name: userData.name }));
              if (userData.mobile) setFormData(prev => ({ ...prev, phone: userData.mobile }));
            }
          })
          .catch(err => {
            if (err.message === 'USER_NOT_FOUND') {
              // The user session is invalid / backend DB was reset
              localStorage.removeItem('user');
              openLoginModal();
              return;
            }
            console.error(err);
            setCheckoutView('form');
            setShowFullAddressForm(false);
            setIsManualEntry(false);
          });
      } catch (e) {
        // handle error
      }
    } else {
      // Not logged in, redirect to login
      navigate('/login?redirect=checkout');
    }
  }, [navigate]);

  // If cart is empty, redirect to shop
  useEffect(() => {
    // Only redirect if we've had a chance to load user and cart is genuinely empty
    // Also, don't redirect if we are currently showing the success popup
    if (user && cartItems.length === 0 && !loading && !error && !showSuccessPopup) {
      navigate('/shop');
    }
  }, [cartItems, navigate, loading, error, user, showSuccessPopup]);

  // Refetch cart/shipping cost whenever the selected state or address changes
  useEffect(() => {
    if (selectedAddressId) {
      refreshCart({ address_id: selectedAddressId });
    } else if (formData.state) {
      refreshCart({ state: formData.state });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId, formData.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setFormData(addr);
    setCheckoutView('selected');
  };

  const handleEditAddress = (e, addr) => {
    e.stopPropagation();
    setFormData(addr);
    setCheckoutView('form');
    setShowFullAddressForm(true);
    setIsManualEntry(true);
  };

  const handleSaveGuestInfo = async () => {
    if (!guestInfo.name || !guestInfo.email) {
      alert("Please fill in both name and email.");
      return;
    }

    // Immediately update local state so the user can proceed to Shipping
    const updatedUser = { ...user, name: guestInfo.name, email: guestInfo.email };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

<<<<<<< HEAD
    if (formData.full_name === 'Guest User' || formData.full_name === 'Dharani Customer' || !formData.full_name) {
=======
    if (formData.full_name === 'Guest User' || formData.full_name === 'Vedan Customer' || !formData.full_name) {
>>>>>>> master
      setFormData(prev => ({ ...prev, full_name: guestInfo.name }));
    }

    setIsContactConfirmed(true);
    setActiveStep(2);

    // Attempt to sync with backend silently
    try {
      const currentUserId = user.id || user.user_id;
      if (!currentUserId) return;

<<<<<<< HEAD
      await fetch(`https://api.codingboss.in/herbal/customers/${currentUserId}/`, {
=======
      await fetch(`https://concise-egomaniac-starved.ngrok-free.dev/herbal/customers/${currentUserId}/`, {
>>>>>>> master
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ name: guestInfo.name, email: guestInfo.email })
      });
    } catch (e) {
      console.error('Failed to sync contact info to backend (non-blocking)', e);
    }
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    const id = addressToDelete;

    try {
<<<<<<< HEAD
      const res = await fetch(`https://api.codingboss.in/herbal/address/`, {
=======
      const res = await fetch(`https://concise-egomaniac-starved.ngrok-free.dev/herbal/address/`, {
>>>>>>> master
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ address_id: id })
      });
      if (res.ok) {
        const newAddresses = savedAddresses.filter(a => a.id !== id);
        setSavedAddresses(newAddresses);
        if (selectedAddressId === id) {
          if (newAddresses.length > 0) {
            setSelectedAddressId(newAddresses[0].id);
            setFormData(newAddresses[0]);
          } else {
            setSelectedAddressId(null);
            setCheckoutView('form');
            setShowFullAddressForm(false);
          }
        }
      }
    } catch (err) {
      console.error('Failed to delete address', err);
    } finally {
      setAddressToDelete(null);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();

          if (data && data.address) {
            const addressObj = data.address;
            const city = addressObj.city || addressObj.town || addressObj.village || addressObj.county || addressObj.state_district || '';
            const state = addressObj.state || '';
            const pincode = addressObj.postcode || '';

            // Build the exact address format: Street, City/Town, State, Pincode
            const streetParts = [
              addressObj.house_number, addressObj.building, addressObj.road,
              addressObj.neighbourhood, addressObj.suburb, addressObj.locality
            ].filter(Boolean);

            const streetText = [...new Set(streetParts)].join(', ');

            const finalParts = [
              streetText,
              city,
              state,
              pincode
            ].filter(Boolean);

            const cleanAddress = finalParts.join(', ');

            setFormData(prev => ({
              ...prev,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              address: cleanAddress,
              city: city,
              state: state,
              pincode: pincode
            }));
            setShowFullAddressForm(true); // Reveal the rest of the form
            setIsManualEntry(false);
          }
        } catch (err) {
          console.error('Failed to fetch location details', err);
          alert('Failed to get location details. Please try again or enter manually.');
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location', error);
        if (error.code === error.PERMISSION_DENIED) {
          alert('Location permission was denied.\n\nTo enable it on your laptop/browser:\n1. Click the "Lock" or "Site Information" icon on the left side of your address bar at the top.\n2. Find "Location" and change it to "Allow".\n3. Reload the page and try again.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('Location information is unavailable right now. Please try again or enter manually.');
        } else {
          alert('Unable to retrieve your location. Please check browser permissions.');
        }
        setFetchingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };


  const handleSaveAddress = async (e) => {
    if (e) e.preventDefault();
    if (!formData.full_name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError("Please fill all required address fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const currentUserId = user.id || user.user_id;
      const payload = { ...formData, user_id: currentUserId };
<<<<<<< HEAD
      let url = 'https://api.codingboss.in/herbal/address/';
=======
      let url = 'https://concise-egomaniac-starved.ngrok-free.dev/herbal/address/';
>>>>>>> master
      let method = 'POST';

      if (formData.id) {
        payload.address_id = formData.id;
        method = 'PUT';
      }

      const addrRes = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });

      if (addrRes.ok) {
        const savedAddr = await addrRes.json();
        let newId = savedAddr.id || savedAddr.address_id || formData.id;

<<<<<<< HEAD
        const res = await fetch(`https://api.codingboss.in/herbal/address/${currentUserId}/`, {
=======
        const res = await fetch(`https://concise-egomaniac-starved.ngrok-free.dev/herbal/address/${currentUserId}/`, {
>>>>>>> master
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok) {
          const data = await res.json();
          let loadedAddresses = [];
          if (data && Array.isArray(data.addresses)) loadedAddresses = data.addresses;
          else if (Array.isArray(data)) loadedAddresses = data;
          setSavedAddresses(loadedAddresses);
          if (!newId && loadedAddresses.length > 0) {
            newId = loadedAddresses[loadedAddresses.length - 1].id;
          }
        }

        if (newId) {
          setSelectedAddressId(newId);
          setFormData({ ...formData, id: newId });
        }
        setCheckoutView('selected');
        setError(null);
      } else {
        const errData = await addrRes.json();
        setError(errData.message || errData.error || "Failed to save address");
      }
    } catch (err) {
      setError("Network error while saving address.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    let finalAddressId = selectedAddressId || 1;
    let combinedAddress = `${formData.full_name}, ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}. Ph: ${formData.phone}`;

    // If filling a new address, save it to backend API
    const currentUserId = user.id || user.user_id;

    if (checkoutView === 'form') {
      try {
        const payload = { ...formData, user_id: currentUserId };
<<<<<<< HEAD
        let url = 'https://api.codingboss.in/herbal/address/';
=======
        let url = 'https://concise-egomaniac-starved.ngrok-free.dev/herbal/address/';
>>>>>>> master
        let method = 'POST';

        if (formData.id) {
          payload.address_id = formData.id;
          // Keep the URL the same for PUT requests
          method = 'PUT';
        }

        const addrRes = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(payload)
        });

        if (addrRes.ok) {
          const savedAddr = await addrRes.json();
          if (savedAddr && savedAddr.id) {
            finalAddressId = savedAddr.id;
          } else if (savedAddr && savedAddr.address_id) {
            finalAddressId = savedAddr.address_id;
          }
        }
      } catch (err) {
        console.error("Failed to save new address to backend", err);
      }
    }

    try {
      let internalOrderId = createdOrderId;

      if (!internalOrderId) {
        // STEP 1: Create the Order in Database
<<<<<<< HEAD
        const checkoutRes = await fetch('https://api.codingboss.in/herbal/checkout/', {
=======
        const checkoutRes = await fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/checkout/', {
>>>>>>> master
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            user_id: currentUserId,
            address_id: finalAddressId,
            shipping_address: combinedAddress,
            city: formData.city,
            state: formData.state || 'Tamil Nadu',
            pincode: formData.pincode,
            phone: formData.phone,
            customer_type: user.role || "customer",
            category: user.role || "customer",
            role: user.role || "customer",
            total_amount: grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0) + (taxAmount || 0)).toFixed(2)),
            amount: grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0) + (taxAmount || 0)).toFixed(2)),
<<<<<<< HEAD
            email: user?.email || guestInfo?.email || "customer@dharaniherbbals.com",
=======
            email: user?.email || guestInfo?.email || "customer@vedanmart.com",
>>>>>>> master
            name: formData.full_name || "Customer"
          })
        });

        const checkoutData = await checkoutRes.json();
        console.log('Step 1 (Checkout) response:', checkoutData);

        if (!checkoutRes.ok || !checkoutData.order_id) {
          setError(checkoutData.message || checkoutData.error || 'Failed to initialize order in database.');
          setLoading(false);
          return;
        }

        internalOrderId = checkoutData.order_id; // THIS IS THE INTEGER ID (e.g. 123)
        setCreatedOrderId(internalOrderId);
      }

      if (paymentMethod === 'paytm') {
        if (!isPaytmLoaded || !window.Paytm || !window.Paytm.CheckoutJS) {
          alert("Paytm is still loading. Please wait a second and try again.");
          setLoading(false);
          return;
        }

        let finalPaytmData;

<<<<<<< HEAD
        if (!finalPaytmData) {
          // Call Paytm Initiate API
          const paytmRes = await fetch('https://api.codingboss.in/herbal/create-paytm-order/', {
=======
        const calculatedAmount = grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0) + (taxAmount || 0)).toFixed(2));
        
        if (!finalPaytmData) {
          // Call Paytm Initiate API
          const paytmRes = await fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/create-paytm-order/', {
>>>>>>> master
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
              order_id: internalOrderId,
<<<<<<< HEAD
              amount: grandTotal !== null ? grandTotal : parseFloat((cartTotal + (shippingCost || 0) + (taxAmount || 0)).toFixed(2)),
              user_id: currentUserId,
              mobile: formData.phone || user?.mobile || "9999999999",
              email: user?.email || guestInfo?.email || "customer@dharaniherbbals.com"
=======
              amount: calculatedAmount,
              user_id: currentUserId,
              mobile: formData.phone || user?.mobile || "9999999999",
              email: user?.email || guestInfo?.email || "customer@vedanmart.com"
>>>>>>> master
            })
          });

          let paytmData;
          try {
            paytmData = await paytmRes.json();
          } catch (e) {
            paytmData = { error: 'Invalid response from server' };
          }

          const txnToken = paytmData.paytm_response?.body?.txnToken || paytmData.txnToken;
<<<<<<< HEAD
          const orderId = paytmData.order_id || paytmData.orderId;
=======
          const orderId = paytmData.paytm_order_id || paytmData.order_id || paytmData.orderId;
>>>>>>> master

          if (!paytmRes.ok || !txnToken || (paytmData.paytm_response?.body?.resultInfo?.resultStatus === 'F')) {
            const errorMsg = paytmData.paytm_response?.body?.resultInfo?.resultMsg || 'Failed to initiate Paytm payment (Missing Token).';
            setError(`Paytm Error: ${errorMsg}`);
            setLoading(false);
            setCreatedOrderId(null);
            return;
          }

          paytmData.txnToken = txnToken;
          paytmData.orderId = orderId;
<<<<<<< HEAD
=======
          paytmData.amount = paytmData.amount || calculatedAmount; // Ensure amount exists
>>>>>>> master
          finalPaytmData = paytmData;
        }

        // Fallback to the production MID if the backend forgets to send it
        const merchantId = finalPaytmData.MID || finalPaytmData.mid || "YyffBp11837369316995";

        if (!merchantId) {
          setError('Paytm Merchant ID (MID) is missing from the backend response. Cannot load payment gateway.');
          setLoading(false);
          return;
        }

        // Assuming the script is already loaded via index.html
        if (!window.Paytm || !window.Paytm.CheckoutJS) {
          setError('Paytm SDK not available. Please ensure the script is in index.html.');
          setLoading(false);
          return;
        }

<<<<<<< HEAD
        const safeOrderId = String(finalPaytmData.orderId || finalPaytmData.order_id).trim();
=======
        const safeOrderId = String(finalPaytmData.paytm_order_id || finalPaytmData.orderId || finalPaytmData.order_id).trim();
>>>>>>> master

        console.log("=== PAYTM DEBUG ===");
        console.log("Backend Response:", finalPaytmData);
        console.log("MID:", merchantId);
        console.log("ORDER_ID:", safeOrderId);
        console.log("TXN TOKEN:", finalPaytmData.txnToken);
        console.log("AMOUNT:", finalPaytmData.amount);

        const config = {
          root: "",
          flow: "DEFAULT",
          data: {
            orderId: safeOrderId,
            token: String(finalPaytmData.txnToken).trim(),
            tokenType: "TXN_TOKEN",
            amount: String(finalPaytmData.amount).trim()
          },
          handler: {
            notifyMerchant: function (eventName, data) {
              console.log("PAYTM EVENT:", eventName, data);
            },
            transactionStatus: async function (paymentStatus) {
              console.log("PAYMENT STATUS RETURNED:", paymentStatus);
              if (window.Paytm && window.Paytm.CheckoutJS) {
                window.Paytm.CheckoutJS.close();
              }

              try {
<<<<<<< HEAD
                const statusRes = await fetch('https://api.codingboss.in/herbal/paytm/status/', {
=======
                const statusRes = await fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/paytm/status/', {
>>>>>>> master
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                  },
                  body: JSON.stringify({ order_id: String(internalOrderId) })
                });
                const statusData = await statusRes.json();

                if (
                  statusData.body?.resultInfo?.resultStatus === 'TXN_SUCCESS' ||
                  statusData.status === 'TXN_SUCCESS' ||
                  statusData.payment_status === 'TXN_SUCCESS' ||
                  paymentStatus?.STATUS === 'TXN_SUCCESS'
                ) {
                  setSuccessOrderId(internalOrderId);
                  setShowSuccessPopup(true);
                } else {
                  setError(statusData.message || paymentStatus?.RESPMSG || 'Payment was cancelled or failed.');
                  setSuccessOrderId(null);
                }
              } catch (err) {
                console.error("Paytm status check error:", err);
              }
            }
          }
        };

        console.log("Paytm Config:", config);
        console.log("Paytm SDK:", window.Paytm);
        console.log("CheckoutJS:", window.Paytm?.CheckoutJS);
        console.log("Init:", typeof window.Paytm?.CheckoutJS?.init);

        if (window.Paytm && window.Paytm.CheckoutJS) {
          // Guard to prevent double execution just in case
          if (window.__paytm_initializing) return;
          window.__paytm_initializing = true;

          window.Paytm.CheckoutJS.init(config).then(function () {
            window.__paytm_initializing = false;
            window.Paytm.CheckoutJS.invoke();
          }).catch(function (error) {
            window.__paytm_initializing = false;
            console.error("========== PAYTM INIT ERROR ==========");
            console.error(error);

            // Show error message and stop if Paytm fails to initialize
            alert("Paytm Initialization Failed: " + (error.message || JSON.stringify(error)));
            setError("Paytm popup SDK failed to initialize. Please try again.");
            setCreatedOrderId(null);
            setLoading(false);
          });
          setLoading(false);
          return; // Stop here, wait for popup
        } else {
          setError('Paytm SDK not available.');
          setLoading(false);
          return;
        }
      } else {
        setError('Please select a valid payment method.');
        setLoading(false);
        return;
      }

    } catch (err) {
      console.error(err);
      setError('Error: ' + (err.message || 'A network error occurred. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  const isVerifyingPayment = new URLSearchParams(location.search).has('order_status');

  if (!user && !isVerifyingPayment) {
    return (
      <div className="checkout-page-wrapper" style={{ alignItems: 'center' }}>
        <Loader2 size={40} className="spinner text-primary" style={{ color: '#16A34A' }} />
      </div>
    );
  }

  // Also don't block if we have an error to show, or if we are verifying payment
  if (cartItems.length === 0 && !showSuccessPopup && !error && !isVerifyingPayment) {
    return (
      <div className="checkout-page-wrapper" style={{ alignItems: 'center' }}>
        <Loader2 size={40} className="spinner text-primary" style={{ color: '#16A34A' }} />
      </div>
    );
  }


  const contactPending = activeStep === 1;
  const shippingPending = activeStep === 2;
  const paymentPending = activeStep === 3;

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-container">

        {/* We removed the stepper from here based on modern designs, relying on accordion steps */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h1 className="checkout-title" style={{ margin: '0 0 8px 0' }}>Secure Checkout</h1>
            <p className="checkout-subtitle" style={{ margin: 0 }}>Please select or enter your shipping details.</p>
          </div>
        </div>

        {/* Horizontal Stepper */}
        <div className="checkout-stepper" style={{ marginBottom: '40px' }}>
          <div className={`stepper-item ${activeStep > 1 ? 'completed' : 'active'}`}>
            <div className="step-circle">{activeStep > 1 ? <Check size={18} strokeWidth={3} /> : '1'}</div>
            <span className="step-label">Contact</span>
          </div>
          <div className={`stepper-line ${activeStep > 1 ? 'completed' : ''}`}></div>

          <div className={`stepper-item ${activeStep > 2 ? 'completed' : (activeStep === 2 ? 'active' : '')}`}>
            <div className="step-circle">{activeStep > 2 ? <Check size={18} strokeWidth={3} /> : '2'}</div>
            <span className="step-label">Shipping</span>
          </div>
          <div className={`stepper-line ${activeStep > 2 ? 'completed' : ''}`}></div>

          <div className={`stepper-item ${activeStep === 3 ? 'active' : ''}`}>
            <div className="step-circle">{activeStep > 3 ? <Check size={18} strokeWidth={3} /> : '3'}</div>
            <span className="step-label">Payment</span>
          </div>
        </div>

        <div className="checkout-grid accordion-layout">
          {/* Form Section */}
          <div className="checkout-form-section">

            {/* STEP 1: CONTACT */}
<<<<<<< HEAD
            {user && (user.name === 'Guest User' || user.name === 'Dharani Customer' || !user.email || user.email.includes('@guest.com')) && (
=======
            {user && (user.name === 'Guest User' || user.name === 'Vedan Customer' || !user.email || user.email.includes('@guest.com')) && (
>>>>>>> master
              <div className={`step-card ${activeStep === 1 ? 'active' : ''}`}>
                <div className="step-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: activeStep > 1 ? 'pointer' : 'default' }} onClick={() => activeStep > 1 && setActiveStep(1)}>
                  <h3 className="modern-contact-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.2rem', color: activeStep >= 1 ? '#111827' : '#9CA3AF' }}>
                    <span className={`step-badge ${activeStep > 1 ? 'completed' : ''}`}>{activeStep > 1 ? <Check size={16} strokeWidth={3} /> : '1'}</span>
                    Contact Information
                  </h3>
                  {activeStep > 1 && (
                    <button type="button" className="btn-edit-step" onClick={(e) => { e.stopPropagation(); setActiveStep(1); }}>Change</button>
                  )}
                </div>

                {activeStep === 1 ? (
                  <div className="step-card-body fade-in-up">
                    <p className="modern-contact-subtitle" style={{ marginBottom: '20px' }}>We'll use this to send you order updates and receipts.</p>
                    <div className="modern-floating-form">
                      <div className="modern-input-group">
                        <input type="text" id="guest-name" value={guestInfo.name} onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })} className="modern-floating-input" placeholder=" " />
                        <label htmlFor="guest-name" className="modern-floating-label">Full Name</label>
                      </div>
                      <div className="modern-input-group">
                        <input type="email" id="guest-email" value={guestInfo.email} onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })} className="modern-floating-input" placeholder=" " />
                        <label htmlFor="guest-email" className="modern-floating-label">Email Address</label>
                      </div>
                    </div>
                    <button type="button" className="btn-place-order" onClick={handleSaveGuestInfo} disabled={loading} style={{ marginTop: '20px', padding: '14px 24px', fontSize: '1.05rem', width: 'auto' }}>
                      Continue to Shipping
                    </button>
                  </div>
                ) : (
                  <div className="step-card-summary">
                    <p style={{ margin: 0, color: '#6B7280' }}>{guestInfo.email || user.email}</p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: SHIPPING */}
            <div className={`step-card ${activeStep === 2 ? 'active' : ''}`}>
              <div className="step-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: activeStep > 2 ? 'pointer' : 'default' }} onClick={() => activeStep > 2 && setActiveStep(2)}>
                <h3 className="modern-contact-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.2rem', color: activeStep >= 2 ? '#111827' : '#9CA3AF' }}>
                  <span className={`step-badge ${activeStep > 2 ? 'completed' : ''} ${activeStep < 2 ? 'pending' : ''}`}>{activeStep > 2 ? <Check size={16} strokeWidth={3} /> : ((user && (user.name === 'Guest User' || !user.email)) ? '2' : '1')}</span>
                  Shipping Address
                </h3>
                {activeStep > 2 && (
                  <button type="button" className="btn-edit-step" onClick={(e) => { e.stopPropagation(); setActiveStep(2); }}>Change</button>
                )}
              </div>

              {activeStep === 2 ? (
                <div className="step-card-body fade-in-up" style={{ marginTop: '20px' }}>
                  {checkoutView === 'selected' && savedAddresses.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                      <button type="button" className="btn-add-address-sm" onClick={() => setCheckoutView('list')} style={{ background: '#f1f5f9', color: '#111827', border: '1px solid rgba(0,0,0,0.1)' }}>
                        Change Address
                      </button>
                    </div>
                  )}
                  {checkoutView === 'list' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                      <button type="button" className="btn-add-address-sm" onClick={() => {
                        setCheckoutView('form');
                        setShowFullAddressForm(false);
                        setIsManualEntry(false);
                        setFormData({ id: null, full_name: '', phone: '', address: '', city: '', state: '', pincode: '', latitude: '11.0168', longitude: '76.9558', is_default: false });
                      }}>
                        <Plus size={16} /> New Address
                      </button>
                    </div>
                  )}

                  {checkoutView === 'selected' && savedAddresses.length > 0 && (
                    <>
                      <div className="saved-addresses-grid" style={{ marginBottom: 0 }}>
                        {savedAddresses.filter(a => a.id === selectedAddressId).map(addr => (
                          <div key={addr.id} className="saved-address-card selected" style={{ border: '2px solid #16A34A', background: '#F0FDF4', padding: '20px', borderRadius: '12px' }}>
                            <div className="address-card-header">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#111827' }}>{addr.full_name}</h4>
                                <CheckCircle size={20} color="#16A34A" />
                              </div>
                            </div>
                            <p style={{ margin: '12px 0 4px', fontWeight: '500', color: '#111827' }}>{addr.phone}</p>
                            <p style={{ margin: '0', color: '#6B7280' }}>{addr.address}</p>
                            <p style={{ margin: '4px 0 0', color: '#6B7280' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button type="button" className="btn-place-order" onClick={() => {
                          if (!selectedAddressId) {
                            setError("Please select a shipping address.");
                            return;
                          }
                          setActiveStep(3);
                          setError(null);
                        }} style={{ marginTop: '20px', width: 'auto', padding: '14px 24px', fontSize: '1.05rem' }}>
                          Continue to Payment
                        </button>
                      </div>
                    </>
                  )}

                  {checkoutView === 'list' && (
                    <div className="saved-addresses-grid">
                      {savedAddresses.map(addr => (
                        <div key={addr.id} className={`saved-address-card ${selectedAddressId === addr.id ? 'selected' : ''}`} onClick={() => handleSelectAddress(addr)} style={{ border: selectedAddressId === addr.id ? '2px solid #16A34A' : '1px solid rgba(0,0,0,0.1)', background: selectedAddressId === addr.id ? '#F0FDF4' : '#fff', padding: '16px', borderRadius: '12px', cursor: 'pointer' }}>
                          <div className="address-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#111827' }}>{addr.full_name}</h4>
                              {selectedAddressId === addr.id && <CheckCircle size={20} color="#16A34A" />}
                            </div>
                            <div className="address-card-actions">
                              <button type="button" className="icon-action-btn edit-icon" onClick={(e) => handleEditAddress(e, addr)}><Edit2 size={16} /></button>
                              <button type="button" className="icon-action-btn delete-icon" onClick={(e) => { e.stopPropagation(); setAddressToDelete(addr.id); }}><Trash2 size={16} /></button>
                            </div>
                          </div>
                          <p style={{ margin: '8px 0 4px', fontWeight: '500', color: '#111827' }}>{addr.phone}</p>
                          <p style={{ margin: '0', color: '#6B7280' }}>{addr.address}</p>
                          <p style={{ margin: '4px 0 0', color: '#6B7280' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                      ))}
                      {savedAddresses.length > 0 && (
                        <button type="button" className="btn-back-to-addresses" onClick={() => setCheckoutView('selected')} style={{ marginTop: '16px', background: 'transparent', border: 'none', color: '#6B7280', textDecoration: 'underline' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  )}

                  {checkoutView === 'form' && (
                    <form className="checkout-form" onSubmit={(e) => {
                      handleSaveAddress(e);
                    }}>
                      {savedAddresses.length > 0 && (
                        <button type="button" className="btn-back-to-addresses" onClick={() => setCheckoutView('list')} style={{ background: 'transparent', border: 'none', color: '#6B7280', padding: 0, marginBottom: '20px' }}>
                          <ArrowLeft size={16} /> Back to saved addresses
                        </button>
                      )}

                      <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-with-icon">
                          <CheckCircle size={18} className="input-icon" />
                          <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required placeholder="Enter your name" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <div className="input-with-icon">
                          <Phone size={18} className="input-icon" />
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="10-digit mobile number" />
                        </div>
                      </div>

                      {!showFullAddressForm ? (
                        <div className="location-prompt-section">
                          <button type="button" className="btn-get-location-large" onClick={handleGetLocation} disabled={fetchingLocation}>
                            {fetchingLocation ? <Loader2 size={20} className="spinner" /> : <Navigation size={20} />}
                            {fetchingLocation ? 'Locating your address...' : 'Use my Current Location'}
                          </button>
                          <div className="location-divider"><span>OR</span></div>
                          <button type="button" className="btn-manual-address" onClick={() => { setShowFullAddressForm(true); setIsManualEntry(true); }}>
                            Enter address manually
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label>Delivery Address</label>
                              {!isManualEntry && (
                                <button type="button" onClick={handleGetLocation} disabled={fetchingLocation} className="btn-get-location-small">
                                  {fetchingLocation ? <Loader2 size={14} className="spinner" /> : <Navigation size={14} />}
                                  {fetchingLocation ? 'Locating...' : 'Use Current Location'}
                                </button>
                              )}
                            </div>
                            <div className="input-with-icon">
                              <MapPin size={18} className="input-icon" />
                              <textarea name="address" value={formData.address} onChange={handleInputChange} required placeholder="House No, Building, Street Area" rows="3" />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>City</label>
                              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="e.g. Chennai" />
                            </div>
                            <div className="form-group relative">
                              <label>State</label>
                              <div className="custom-select-trigger" onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}>
                                <span style={{ color: formData.state ? '#1e293b' : '#9CA3AF' }}>{formData.state || 'Select State'}</span>
                                <ChevronDown size={18} className={isStateDropdownOpen ? 'rotate-180' : ''} style={{ transition: 'transform 0.2s', color: '#6B7280' }} />
                              </div>
                              {isStateDropdownOpen && (
                                <>
                                  <div className="custom-select-overlay" onClick={() => setIsStateDropdownOpen(false)} />
                                  <div className="custom-select-dropdown">
                                    {INDIAN_STATES.map(state => (
                                      <div key={state} className={`custom-select-option ${formData.state === state ? 'selected' : ''}`} onClick={() => { setFormData(prev => ({ ...prev, state })); setIsStateDropdownOpen(false); }}>
                                        {state}
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="form-group half-width">
                            <label>PIN Code</label>
                            <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required placeholder="e.g. 600001" />
                          </div>

                          <button type="submit" className="modern-btn-save" disabled={loading} style={{ width: 'auto', padding: '16px 32px' }}>
                            {loading ? <Loader2 size={20} className="spinner" /> : 'Save Address'}
                          </button>
                        </>
                      )}
                    </form>
                  )}
                </div>
              ) : (
                <div className="step-card-summary">
                  {savedAddresses.filter(a => a.id === selectedAddressId).map(addr => (
                    <div key={addr.id} style={{ color: '#6B7280' }}>
                      <p style={{ margin: 0 }}>{addr.address}</p>
                      <p style={{ margin: '4px 0 0' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  ))}
                  {(!selectedAddressId || savedAddresses.length === 0) && <p style={{ margin: 0, color: '#9CA3AF' }}>No address selected</p>}
                </div>
              )}
            </div>

            {/* STEP 3: PAYMENT */}
            <div className={`step-card ${activeStep === 3 ? 'active' : ''}`}>
              <div className="step-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="modern-contact-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.2rem', color: activeStep >= 3 ? '#111827' : '#9CA3AF' }}>
                  <span className={`step-badge ${activeStep < 3 ? 'pending' : ''}`}>{((user && (user.name === 'Guest User' || !user.email)) ? '3' : '2')}</span>
                  Payment Method
                </h3>
              </div>
              {activeStep === 3 && (
                <div className="step-card-body fade-in-up" style={{ marginTop: '20px' }}>
                  <div className="payment-options">
                    <label className="payment-option selected" style={{ flex: 1, padding: '20px', border: '2px solid #16A34A', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: '#F0FDF4' }}>
                      <input type="radio" name="paymentMethod" value="paytm" checked={true} readOnly style={{ accentColor: '#16A34A', width: '20px', height: '20px' }} />
                      <span style={{ fontWeight: '600', color: '#111827', fontSize: '1.1rem' }}>Paytm / UPI / Cards</span>
                    </label>
                  </div>
                  {error && <div className="checkout-error-alert" style={{ marginTop: '20px' }}>{error}</div>}
                </div>
              )}
            </div>

          </div>

          {/* Order Summary Section */}
          <div className="checkout-summary-section">
            <h2 className="summary-title" style={{ marginBottom: '24px', fontSize: '1.4rem' }}>Order Summary</h2>
            <div className="summary-items" style={{ maxHeight: '300px', paddingRight: '10px' }}>
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-img-box">
                    <img src={item.image} alt={item.name} />
                    <span className="summary-item-qty">{item.quantity}</span>
                  </div>
                  <div className="summary-item-info">
                    <h4>{language === 'ta' && item.tamil_name ? item.tamil_name : item.name}</h4>
                    <p>{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
              <div className="total-row"><span>Shipping Charge</span>{shippingCost === 0 ? <span className="text-free">Free</span> : <span>₹{shippingCost}</span>}</div>
              <div className="total-row"><span>CGST</span><span>₹{(Number(cgst) || 0).toFixed(2)}</span></div>
              <div className="total-row"><span>SGST</span><span>₹{(Number(sgst) || 0).toFixed(2)}</span></div>
              <div className="total-row"><span>IGST</span><span>₹{(Number(igst) || 0).toFixed(2)}</span></div>
              <div className="total-row"><span>Tax Total</span><span>₹{(Number(taxTotal) || 0).toFixed(2)}</span></div>
              <div className="total-row grand-total" style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '16px', marginTop: '8px' }}>
                <span>Total</span>
                <span style={{ fontSize: '1.8rem', color: '#16A34A' }}>₹{grandTotal !== null ? grandTotal.toFixed(2) : (cartTotal + (shippingCost || 0) + (taxAmount || 0)).toFixed(2)}</span>
              </div>
            </div>

            {/* MASTER CHECKOUT BUTTON */}
            <div className="master-action-container" style={{ marginTop: '32px' }}>
              <button
                className="btn-place-order master-btn"
                onClick={(e) => {
                  if (activeStep === 1) {
                    setError("Please complete your Contact Information.");
                    return;
                  }
                  if (activeStep === 2) {
                    setError("Please confirm your Shipping Address.");
                    return;
                  }
                  handlePlaceOrder(e);
                }}
                disabled={loading || activeStep !== 3}
                style={{ width: '100%', margin: 0, opacity: activeStep !== 3 ? 0.6 : 1, cursor: activeStep !== 3 ? 'not-allowed' : 'pointer' }}
              >
                {loading ? <Loader2 size={24} className="spinner" /> : 'Place Order'}
              </button>
            </div>

            <div className="secure-badge" style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', background: 'transparent', padding: 0 }}>
              <CheckCircle size={16} /> <span>100% Secure Transaction</span>
            </div>
          </div>

        </div>
      </div>

      {showSuccessPopup && (
        <div className="delete-modal-overlay" style={{ zIndex: 1000 }}>
          <div className="delete-modal fade-in-up" style={{ textAlign: 'center', padding: '40px 20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={36} color="#16A34A" />
              </div>
            </div>
            <h3 style={{ color: '#16A34A', fontSize: '24px', marginBottom: '12px', fontWeight: 'bold' }}>Order Successfully Placed!</h3>
            <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '10px' }}>Your order has been confirmed.</p>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>Redirecting to home page in a few seconds...</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  refreshCart();
                  navigate('/');
                }}
                style={{ backgroundColor: '#16A34A', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

