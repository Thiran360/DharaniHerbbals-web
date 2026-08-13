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
<<<<<<< HEAD
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState('');
=======
  const [otpValue, setOtpValue] = useState('');      // single source of truth for OTP digits
>>>>>>> master
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpUserId, setOtpUserId] = useState(null);
  const [isStoreMember, setIsStoreMember] = useState(false);
  const [otpType, setOtpType] = useState('register');
<<<<<<< HEAD
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
=======
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // The ONE real input that captures everything (keyboard + SMS autofill)
  const realOtpInputRef = useRef(null);

  // Refs for stale-closure-safe access inside async callbacks
  const mobileRef = useRef('');
  const otpUserIdRef = useRef(null);
  const otpTypeRef = useRef('register');
  const isStoreMemberRef = useRef(false);
  const verifyFnRef = useRef(null);

  useEffect(() => { mobileRef.current = mobile; }, [mobile]);
  useEffect(() => { otpUserIdRef.current = otpUserId; }, [otpUserId]);
  useEffect(() => { otpTypeRef.current = otpType; }, [otpType]);
  useEffect(() => { isStoreMemberRef.current = isStoreMember; }, [isStoreMember]);

  const { refreshProducts } = useProducts();
  const { refreshCart } = useCart();
  const { isLoginModalOpen, closeLoginModal } = useAuthModal();

  // Focus the real input as soon as OTP screen shows — this triggers Android SMS suggestion
  useEffect(() => {
    if (showOtp && realOtpInputRef.current) {
      setTimeout(() => realOtpInputRef.current?.focus(), 100);
    }
  }, [showOtp]);

  // Web OTP API — auto-reads SMS silently on Android Chrome (no user tap needed)
  // Requires SMS to end with:  @yourdomain.com #123456
  useEffect(() => {
    if (!showOtp || !('credentials' in navigator)) return;
    const ac = new AbortController();
    navigator.credentials.get({ otp: { transport: ['sms'] }, signal: ac.signal })
      .then(result => {
        if (result?.code) {
          const digits = result.code.replace(/\D/g, '').slice(0, 6);
          setOtpValue(digits);
          if (realOtpInputRef.current) realOtpInputRef.current.value = digits;
          if (digits.length === 6 && verifyFnRef.current) {
            setTimeout(() => verifyFnRef.current(digits), 50);
          }
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.log('Web OTP API:', err.message);
      });
    return () => ac.abort();
  }, [showOtp]);

  // Derive the array of displayed digits from otpValue
  const otpArray = Array.from({ length: 6 }, (_, i) => otpValue[i] || '');

  const isAlreadyLoggedIn = localStorage.getItem('user') !== null;
  if (!isLoginModalOpen || isAlreadyLoggedIn) return null;

  // ─── SEND OTP ────────────────────────────────────────────────────
  const handleSendOtp = async (arg) => {
    if (arg?.preventDefault) arg.preventDefault();
>>>>>>> master
    const mobileNumber = typeof arg === 'string' ? arg : mobile;

    if (mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setLoading(true);

    try {
<<<<<<< HEAD
      // First try store login
      let response = await fetch('https://api.codingboss.in/herbal/store/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ mobile: mobileNumber, phone_number: mobileNumber })
      });

=======
      let response = await fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/user-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ mobile: mobileNumber, phone_number: mobileNumber })
      });
>>>>>>> master
      let data = await response.json();

      if (response.ok && data.success !== false) {
        if (data.user_id) setOtpUserId(data.user_id);
<<<<<<< HEAD
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
=======
        setIsStoreMember(false);
        setOtpType('login');
        setResendTimer(30);
        setShowOtp(true);
      } else {
        setError(data.message || data.error || 'Login failed. Please try again or ensure you are registered.');
      }
    } catch (err) {
>>>>>>> master
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setMobile(val);
<<<<<<< HEAD
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
=======
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/resend-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ phone_number: mobileRef.current, mobile: mobileRef.current })
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        setError(data.message || 'Failed to resend OTP.');
      } else {
        setResendTimer(30);
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ─── VERIFY OTP ──────────────────────────────────────────────────
  const handleVerifyOtp = async (arg) => {
    if (arg?.preventDefault) arg.preventDefault();
    const currentOtp = typeof arg === 'string' ? arg : otpValue;
>>>>>>> master

    if (currentOtp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
    setError(null);
    setLoading(true);

    try {
<<<<<<< HEAD
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
=======
      const verifyUrl = (otpTypeRef.current === 'forgot-password' || otpTypeRef.current === 'store')
        ? 'https://concise-egomaniac-starved.ngrok-free.dev/herbal/verify-user-login-otp/'
        : 'https://concise-egomaniac-starved.ngrok-free.dev/herbal/verify-otp/';

      let response = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({
          phone_number: mobileRef.current,
          mobile: mobileRef.current,
          otp: currentOtp,
          ...(otpUserIdRef.current && { user_id: otpUserIdRef.current })
>>>>>>> master
        })
      });

      let data = await response.json();

      if (response.ok && data.success !== false) {
<<<<<<< HEAD

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
=======
        if (!data.user && data.user_id && !isStoreMemberRef.current) {
          try {
            const userResp = await fetch(`https://concise-egomaniac-starved.ngrok-free.dev/herbal/customers/${data.user_id}/`, {
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (userResp.ok) data.user = await userResp.json();
          } catch (e) {}
        }

        const userObj = data.user || {};
        const user = {
          ...userObj,
          id: userObj.id || data.user_id || data.id || otpUserIdRef.current,
          phone_number: userObj.phone_number || userObj.mobile || mobileRef.current,
          mobile: userObj.mobile || userObj.phone_number || mobileRef.current,
          name: userObj.name || data.name || (isStoreMemberRef.current ? 'Store Member' : 'Vedan Mart Customer'),
          is_store_member: userObj.is_store_member ?? data.is_store_member ?? isStoreMemberRef.current,
          role: userObj.role || data.role || (isStoreMemberRef.current ? 'store' : 'customer')
>>>>>>> master
        };

        try {
          localStorage.setItem('user', JSON.stringify(user));
<<<<<<< HEAD
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
=======
          if (data.token) localStorage.setItem('token', data.token);
        } catch (e) {}

        if (typeof closeLoginModal === 'function') closeLoginModal();
        window.dispatchEvent(new Event('user-login-status-changed'));
        if (typeof refreshProducts === 'function') refreshProducts();
        if (typeof refreshCart === 'function') refreshCart();
        
        setTimeout(() => {
          if (user.is_store_member || user.role === 'store' || user.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = window.location.pathname;
          }
>>>>>>> master
        }, 300);

      } else {
        setError(data.message || data.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
<<<<<<< HEAD
      console.error('Verify OTP Error:', err);
=======
>>>>>>> master
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  // Always keep verifyFnRef fresh (used by Web OTP API callback)
  verifyFnRef.current = handleVerifyOtp;

  // ─── OTP REAL INPUT HANDLER ──────────────────────────────────────
  const handleRealOtpChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpValue(digits);
    // Auto-submit when 6 digits are typed/autofilled
    if (digits.length === 6) {
      setTimeout(() => handleVerifyOtp(digits), 50);
>>>>>>> master
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        <button className="close-btn" onClick={closeLoginModal}>
          <X size={24} />
        </button>
<<<<<<< HEAD
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
=======

        {/* Left Side (Image) - Hidden on Mobile */}
        <div className="login-modal-left">
          <img src={heartImg} alt="Vedan Mart" className="desktop-hero-img" />
          <div className="desktop-hero-overlay">
            <div className="login-modal-brand"><h2>Vedan Mart</h2></div>
            <h1 className="login-modal-title">Experience The Goodness Of Nature</h1>
>>>>>>> master
            <p className="login-modal-subtitle">
              Authentic Siddha formulations with carefully sourced herbs for your daily wellness.
            </p>
          </div>
        </div>

        {/* Hero Image - Hidden on Desktop */}
        <div className="login-modal-hero">
<<<<<<< HEAD
          <img src={heartImg} alt="Dharani Herbbals" className="login-hero-img" />
=======
          <img src={heartImg} alt="Vedan Mart" className="login-hero-img" />
>>>>>>> master
        </div>

        {/* Right Side (White) */}
        <div className="login-modal-right">
<<<<<<< HEAD

          <div className="login-form-container">
            <h2 className="welcome-text">Welcome To Dharani Herbbals!</h2>
=======
          <div className="login-form-container">
            <h2 className="welcome-text">Welcome To Vedan Mart!</h2>
>>>>>>> master

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

<<<<<<< HEAD
                  {/* Checkbox removed as per design */}

=======
>>>>>>> master
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
<<<<<<< HEAD
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
=======
                      <button type="button" className="edit-mobile-btn" onClick={() => { setShowOtp(false); setOtpValue(''); }}>Edit</button>
                    </p>

                    {/*
                      ┌─────────────────────────────────────────────────────────┐
                      │  OTP INPUT — single real <input> layered over 6 visual  │
                      │  boxes. This is the technique used by Stripe & Airbnb.  │
                      │  Android Chrome's SMS autofill targets this input,       │
                      │  so OTP auto-fills without any user interaction.         │
                      └─────────────────────────────────────────────────────────┘
                    */}
                    <div className="otp-boxes-container" style={{ position: 'relative' }}>
                      {/* The ONE real input — transparent, covers the full area */}
                      <input
                        ref={realOtpInputRef}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        name="otp"
                        id="otp"
                        maxLength={6}
                        value={otpValue}
                        onChange={handleRealOtpChange}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'transparent',
                          color: 'transparent',
                          border: 'none',
                          outline: 'none',
                          zIndex: 2,
                          cursor: 'text',
                          fontSize: '16px',     /* prevents iOS zoom */
                          caretColor: 'transparent',
                        }}
                        aria-label="Enter OTP"
                      />

                      {/* 6 visual display boxes (non-interactive, just for looks) */}
                      {otpArray.map((digit, i) => (
                        <div
                          key={i}
                          className={`otp-box-input ${digit ? 'filled' : ''} ${
                            otpValue.length === i ? 'active-box' : ''
                          }`}
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {digit}
                        </div>
>>>>>>> master
                      ))}
                    </div>
                  </div>

                  {error && <div className="error-message">{error}</div>}

<<<<<<< HEAD
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Proceed'}
                  </button>
=======
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button type="submit" className="submit-btn" disabled={loading} style={{ flex: 2 }}>
                      {loading ? 'Verifying...' : 'Verify & Proceed'}
                    </button>
                    <button type="button" className="submit-btn" disabled={loading || resendTimer > 0} onClick={handleResendOtp} style={{ flex: 1, background: '#f1f5f9', color: (loading || resendTimer > 0) ? '#94a3b8' : '#0f172a' }}>
                      {resendTimer > 0 ? `Wait ${resendTimer}s` : 'Resend'}
                    </button>
                  </div>
>>>>>>> master
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
