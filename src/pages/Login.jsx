import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, Star, X, Leaf, ShieldCheck, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useAuthModal } from '../context/AuthModalContext';
import { API_BASE_URL } from '../services/api';
import heartImg from '../assets/heart.png';
import './Login.css';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otpValue, setOtpValue] = useState('');      // single source of truth for OTP digits
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpUserId, setOtpUserId] = useState(null);
  const [isStoreMember, setIsStoreMember] = useState(false);
  const [otpType, setOtpType] = useState('register');
  const [resendTimer, setResendTimer] = useState(0);

  const [apiOtp, setApiOtp] = useState('');          // Stores OTP returned in API response

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
  const lastSubmittedOtpRef = useRef(null);

  useEffect(() => { mobileRef.current = mobile; }, [mobile]);
  useEffect(() => { otpUserIdRef.current = otpUserId; }, [otpUserId]);
  useEffect(() => { otpTypeRef.current = otpType; }, [otpType]);
  useEffect(() => { isStoreMemberRef.current = isStoreMember; }, [isStoreMember]);

  // Auto-submit OTP as soon as 6 digits are prefilled or entered
  useEffect(() => {
    if (showOtp && otpValue && otpValue.length === 6 && lastSubmittedOtpRef.current !== otpValue && !loading) {
      lastSubmittedOtpRef.current = otpValue;
      const timer = setTimeout(() => {
        if (verifyFnRef.current) {
          verifyFnRef.current(otpValue);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showOtp, otpValue, loading]);

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
    const mobileNumber = typeof arg === 'string' ? arg : mobile;

    if (mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      let response = await fetch(`${API_BASE_URL}/user-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ mobile: mobileNumber, phone_number: mobileNumber })
      });
      let data = await response.json();

      if (response.ok && data.success !== false) {
        if (data.user_id) setOtpUserId(data.user_id);
        setIsStoreMember(false);
        setOtpType('login');
        setResendTimer(30);

        // Extract OTP from API response, store in state & prefill input field
        const receivedOtp = data.otp || data.data?.otp || data.code || data.user?.otp || data.otp_code;
        if (receivedOtp) {
          const otpStr = String(receivedOtp).replace(/\D/g, '').slice(0, 6);
          setApiOtp(otpStr);
          setOtpValue(otpStr);
        } else {
          setApiOtp('');
        }

        setShowOtp(true);
      } else {
        setError(data.message || data.error || 'Login failed. Please try again or ensure you are registered.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setMobile(val);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resend-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ phone_number: mobileRef.current, mobile: mobileRef.current })
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        setError(data.message || 'Failed to resend OTP.');
      } else {
        const receivedOtp = data.otp || data.data?.otp || data.code || data.user?.otp || data.otp_code;
        if (receivedOtp) {
          const otpStr = String(receivedOtp).replace(/\D/g, '').slice(0, 6);
          setApiOtp(otpStr);
          setOtpValue(otpStr);
        }
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

    if (currentOtp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const verifyUrl = (otpTypeRef.current === 'forgot-password' || otpTypeRef.current === 'store')
        ? `${API_BASE_URL}/verify-user-login-otp/`
        : `${API_BASE_URL}/verify-otp/`;

      let response = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({
          phone_number: mobileRef.current,
          mobile: mobileRef.current,
          otp: currentOtp,
          ...(otpUserIdRef.current && { user_id: otpUserIdRef.current })
        })
      });

      let data = await response.json();

      if (response.ok && data.success !== false) {
        if (!data.user && data.user_id && !isStoreMemberRef.current) {
          try {
            const userResp = await fetch(`${API_BASE_URL}/customers/${data.user_id}/`, {
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
          name: userObj.name || data.name || (isStoreMemberRef.current ? 'Store Member' : 'Dharani Customer'),
          is_store_member: userObj.is_store_member ?? data.is_store_member ?? isStoreMemberRef.current,
          role: userObj.role || data.role || (isStoreMemberRef.current ? 'store' : 'customer')
        };

        try {
          localStorage.setItem('user', JSON.stringify(user));
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
        }, 300);

      } else {
        setError(data.message || data.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Always keep verifyFnRef fresh (used by Web OTP API callback)
  verifyFnRef.current = handleVerifyOtp;

  // ─── OTP REAL INPUT HANDLER ──────────────────────────────────────
  const handleRealOtpChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpValue(digits);
    // Auto-submit when 6 digits are typed/autofilled
    if (digits.length === 6) {
      setTimeout(() => handleVerifyOtp(digits), 50);
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
            <div className="login-modal-brand"><h2>Dharani Herbbals</h2></div>
            <h1 className="login-modal-title">Experience The Goodness Of Nature</h1>
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
                      <button type="button" className="edit-mobile-btn" onClick={() => { setShowOtp(false); setOtpValue(''); setApiOtp(''); lastSubmittedOtpRef.current = null; }}>Edit</button>
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
                      ))}
                    </div>
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button type="submit" className="submit-btn" disabled={loading} style={{ flex: 2 }}>
                      {loading ? 'Verifying...' : 'Verify & Proceed'}
                    </button>
                    <button type="button" className="submit-btn" disabled={loading || resendTimer > 0} onClick={handleResendOtp} style={{ flex: 1, background: '#f1f5f9', color: (loading || resendTimer > 0) ? '#94a3b8' : '#0f172a' }}>
                      {resendTimer > 0 ? `Wait ${resendTimer}s` : 'Resend'}
                    </button>
                  </div>
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
