import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, Star, X, Leaf, ShieldCheck, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useAuthModal } from '../context/AuthModalContext';
import heartImg from '../assets/heart.png';
import './Login.css';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpUserId, setOtpUserId] = useState(null);
  const [isStoreMember, setIsStoreMember] = useState(false);
  const [otpType, setOtpType] = useState('register');
  const [subscribe, setSubscribe] = useState(true);

  const { refreshProducts } = useProducts();
  const { refreshCart, setIsCartOpen } = useCart();
  const { isLoginModalOpen, closeLoginModal } = useAuthModal();

  // Web OTP API for completely automatic SMS reading on Android
  useEffect(() => {
    if (showOtp && 'credentials' in navigator) {
      const ac = new AbortController();
      navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then(otp => {
        if (otp && otp.code) {
          const code = otp.code;
          const newOtpArray = [...code.split('').slice(0, 6), '', '', '', '', ''].slice(0, 6);
          setOtpArray(newOtpArray);
          setOtp(code);
          if (code.length === 6) {
            handleVerifyOtp(code);
          }
        }
      }).catch(err => {
        console.log('Web OTP API not supported or timed out:', err);
      });
      return () => ac.abort();
    }
  }, [showOtp]);

  // If they are already logged in, never show this modal (prevents ghost popups)
  const isAlreadyLoggedIn = localStorage.getItem('user') !== null;
  if (!isLoginModalOpen || isAlreadyLoggedIn) return null;

  const handleSendOtp = async (arg) => {
    if (arg && arg.preventDefault) {
      arg.preventDefault();
    }
    const mobileNumber = typeof arg === 'string' ? arg : mobile;

    if (mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // First try store login
      let response = await fetch('https://api.codingboss.in/herbal/store/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ mobile: mobileNumber, phone_number: mobileNumber })
      });

      let data = await response.json();

      if (response.ok && data.success !== false) {
        if (data.user_id) setOtpUserId(data.user_id);
        setIsStoreMember(true);
        setOtpType('store');
        setShowOtp(true);
      } else {
        // Fallback to customer register
        response = await fetch('https://api.codingboss.in/herbal/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({
            mobile: mobileNumber,
            phone_number: mobileNumber,
            email: `${mobileNumber}@guest.com`,
            password: 'GuestPassword123!',
            name: 'Guest User'
          })
        });

        data = await response.json();

        if (response.ok && data.success !== false && (!data.message || !data.message.includes('already exists'))) {
          if (data.user_id) setOtpUserId(data.user_id);
          setIsStoreMember(false);
          setOtpType('register');
          setShowOtp(true);
        } else {
          // If register fails because mobile exists (or any other failure), fallback to forgot-password to send OTP to existing user
          response = await fetch('https://api.codingboss.in/herbal/forgot-password/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ phone_number: mobileNumber, mobile: mobileNumber })
          });

          data = await response.json();

          if (response.ok && data.success !== false) {
            if (data.user_id) setOtpUserId(data.user_id);
            setIsStoreMember(false);
            setOtpType('forgot-password');
            setShowOtp(true);
          } else {
            setError(data.message || data.error || 'Login failed. Please try again.');
          }
        }
      }
    } catch (err) {
      console.error('Send OTP Error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setMobile(val);
      if (val.length === 10) {
        handleSendOtp(val);
      }
    }
  };

  const handleVerifyOtp = async (arg) => {
    if (arg && arg.preventDefault) {
      arg.preventDefault();
    }
    const currentOtp = typeof arg === 'string' ? arg : otp;

    if (currentOtp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const verifyUrl = (otpType === 'forgot-password' || otpType === 'store')
        ? 'https://api.codingboss.in/herbal/verify-forgot-password-otp/'
        : 'https://api.codingboss.in/herbal/verify-otp/';

      let response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          phone_number: mobile,
          mobile: mobile,
          otp: currentOtp,
          ...(otpUserId && { user_id: otpUserId })
        })
      });

      let data = await response.json();

      if (response.ok && data.success !== false) {

        // Only fetch from /customers/ if it's NOT a store member
        if (!data.user && data.user_id && !isStoreMember) {
          try {
            const userResp = await fetch(`https://api.codingboss.in/herbal/customers/${data.user_id}/`, {
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (userResp.ok) {
              const userData = await userResp.json();
              data.user = userData;
            }
          } catch (e) {
            console.error('Failed to fetch user data after OTP verification', e);
          }
        }

        const user = data.user || {
          id: data.user_id || 'user-' + mobile,
          phone_number: mobile,
          mobile: mobile,
          name: data.name || (isStoreMember ? 'Store Member' : 'Dharani Customer'),
          is_store_member: data.is_store_member || isStoreMember,
          role: data.role || (isStoreMember ? 'store' : 'customer')
        };

        try {
          localStorage.setItem('user', JSON.stringify(user));
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        } catch (storageErr) {
          console.error("Local storage error:", storageErr);
        }

        // Close the modal instantly so user sees it disappear
        if (typeof closeLoginModal === 'function') {
          closeLoginModal();
        }

        // Instantly update the Navbar and other components
        window.dispatchEvent(new Event('user-login-status-changed'));

        // Refresh specific context if they exist
        if (typeof refreshProducts === 'function') refreshProducts();
        if (typeof refreshCart === 'function') refreshCart();

        // Delay the full page reload slightly to allow React to paint the closed modal
        setTimeout(() => {
          window.location.href = window.location.pathname; // Safest reload method for all mobile browsers
        }, 300);

      } else {
        setError(data.message || data.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpBoxChange = (element, index) => {
    let val = element.value.replace(/\D/g, ''); // keep only digits
    if (!val) {
      const newOtpArray = [...otpArray];
      newOtpArray[index] = '';
      setOtpArray(newOtpArray);
      setOtp(newOtpArray.join(''));
      return;
    }

    if (val.length > 1) {
      // Handle autofill/paste behavior
      const pastedData = val.slice(0, 6);
      const newOtpArray = [...otpArray];
      for (let i = 0; i < pastedData.length; i++) {
        if (index + i < 6) {
          newOtpArray[index + i] = pastedData[i];
        }
      }
      setOtpArray(newOtpArray);
      const combinedOtp = newOtpArray.join('');
      setOtp(combinedOtp);
      const focusIndex = Math.min(index + pastedData.length, 5);
      if (inputRefs.current[focusIndex]) inputRefs.current[focusIndex].focus();

      if (combinedOtp.length === 6) {
        handleVerifyOtp(combinedOtp);
      }
      return;
    }

    const newOtpArray = [...otpArray];
    newOtpArray[index] = val;
    setOtpArray(newOtpArray);

    const combinedOtp = newOtpArray.join('');
    setOtp(combinedOtp);

    // Focus next input
    if (val !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (combinedOtp.length === 6) {
      handleVerifyOtp(combinedOtp);
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtpArray = [...otpArray];
    for (let i = 0; i < 6; i++) {
      newOtpArray[i] = pastedData[i] || '';
    }
    setOtpArray(newOtpArray);

    const combinedOtp = newOtpArray.join('');
    setOtp(combinedOtp);

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex].focus();

    if (combinedOtp.length === 6) {
      handleVerifyOtp(combinedOtp);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        <button className="close-btn" onClick={closeLoginModal}>
          <X size={24} />
        </button>
        {/* Left Side (Image) - Hidden on Mobile */}
        <div className="login-modal-left">
          <img src={heartImg} alt="Dharani Herbbals" className="desktop-hero-img" />
          <div className="desktop-hero-overlay">
            <div className="login-modal-brand">
              <h2>Dharani Herbbals</h2>
            </div>
            <h1 className="login-modal-title">
              Experience The Goodness Of Nature
            </h1>
            <p className="login-modal-subtitle">
              Authentic Siddha formulations with carefully sourced herbs for your daily wellness.
            </p>
          </div>
        </div>

        {/* Hero Image - Hidden on Desktop */}
        <div className="login-modal-hero">
          <img src={heartImg} alt="Dharani Herbbals" className="login-hero-img" />
        </div>

        {/* Right Side (White) */}
        <div className="login-modal-right">

          <div className="login-form-container">
            <h2 className="welcome-text">Welcome To Dharani Herbbals!</h2>

            <form onSubmit={showOtp ? handleVerifyOtp : handleSendOtp}>
              {!showOtp ? (
                <>
                  <div className="mobile-input-wrapper">
                    <div className="country-code">
                      <img src="https://flagcdn.com/w20/in.png" alt="India Flag" className="india-flag" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      className="mobile-input"
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={handleMobileChange}
                      required
                    />
                  </div>

                  {/* Checkbox removed as per design */}

                  {error && <div className="error-message">{error}</div>}

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Submit'}
                  </button>
                </>
              ) : (
                <>
                  <div className="otp-container-wrapper">
                    <p className="otp-sent-text" style={{ marginBottom: '15px' }}>
                      Verification code sent to <br />
                      <strong>+91 {mobile}</strong>
                      <button type="button" className="edit-mobile-btn" onClick={() => setShowOtp(false)}>Edit</button>
                    </p>

                    <div className="otp-boxes-container" onPaste={handleOtpPaste}>
                      {otpArray.map((data, index) => (
                        <input
                          key={index}
                          type="text"
                          name={`otp-${index}`}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="otp-box-input"
                          value={data}
                          autoComplete="one-time-code"
                          ref={(el) => (inputRefs.current[index] = el)}
                          onChange={(e) => handleOtpBoxChange(e.target, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          onFocus={(e) => e.target.select()}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Proceed'}
                  </button>
                </>
              )}
            </form>

            <div className="terms-footer">
              <p>By logging in, you're agreeing to our <Link to="/privacy">Privacy Policy</Link> <br /><Link to="/terms">Terms of Service</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
