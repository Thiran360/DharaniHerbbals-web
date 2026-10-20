import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, Star, X, Leaf, ShieldCheck, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useAuthModal } from '../context/AuthModalContext';
import { API_BASE_URL } from '../services/api';
import heartImg from '../assets/heart.png';
import './Login.css';

const isMobileDeviceOrView = () => {
  if (typeof window === 'undefined') return false;
  const isSmallScreen = window.innerWidth <= 992;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent || '');
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  return isSmallScreen || isMobileUA || (hasTouch && window.innerWidth <= 1024);
};

// Clean up any stale saved owner/mobile keys
try {
  localStorage.removeItem('dharani_device_owner_mobile');
  localStorage.removeItem('dharani_saved_mobile');
} catch (e) {}

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otpValue, setOtpValue] = useState('');      // single source of truth for OTP digits
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [apiOtp, setApiOtp] = useState('');
  const [otpUserId, setOtpUserId] = useState(null);
  const [isStoreMember, setIsStoreMember] = useState(false);
  const [otpType, setOtpType] = useState('register');
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
  const lastSubmittedOtpRef = useRef(null);
  const isNewUserRef = useRef(false);

  useEffect(() => { mobileRef.current = mobile; }, [mobile]);
  useEffect(() => { otpUserIdRef.current = otpUserId; }, [otpUserId]);
  useEffect(() => { otpTypeRef.current = otpType; }, [otpType]);
  useEffect(() => { isStoreMemberRef.current = isStoreMember; }, [isStoreMember]);

  // Auto-submit OTP as soon as 6 digits are prefilled or entered, or if the exact API OTP is filled for existing user
  useEffect(() => {
    const isExactApiOtp = !isNewUserRef.current && apiOtp && otpValue === apiOtp;
    if (showOtp && otpValue && (otpValue.length === 6 || isExactApiOtp) && lastSubmittedOtpRef.current !== otpValue && !loading) {
      if (isNewUserRef.current && otpValue.length < 6) return;
      lastSubmittedOtpRef.current = otpValue;
      const timer = setTimeout(() => {
        if (verifyFnRef.current) {
          verifyFnRef.current(otpValue);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showOtp, otpValue, loading, apiOtp]);

  const { refreshProducts } = useProducts();
  const { refreshCart } = useCart();
  const { isLoginModalOpen, closeLoginModal } = useAuthModal();

  // Reset mobile field to empty whenever login modal opens (unless user already typed something)
  useEffect(() => {
    if (isLoginModalOpen) {
      setMobile(prev => prev || '');
    }
  }, [isLoginModalOpen]);

  // When user logs out, clear mobile state
  useEffect(() => {
    const handleLoginStatusChange = () => {
      try {
        if (!localStorage.getItem('user')) {
          setMobile('');
        }
      } catch (e) {}
    };
    window.addEventListener('user-login-status-changed', handleLoginStatusChange);
    return () => window.removeEventListener('user-login-status-changed', handleLoginStatusChange);
  }, []);

  // Focus the real input as soon as OTP screen shows — this triggers Android SMS suggestion
  useEffect(() => {
    if (showOtp && realOtpInputRef.current) {
      setTimeout(() => realOtpInputRef.current?.focus(), 100);
    }
  }, [showOtp]);

  // Web OTP API — auto-reads SMS silently on Android Chrome (no user tap needed)
  useEffect(() => {
    const isMobile = isMobileDeviceOrView();
    if (!showOtp || !isMobile || !('credentials' in navigator)) return;
    if (isNewUserRef.current) return;
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

    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    mobileRef.current = mobileNumber;
    lastSubmittedOtpRef.current = null;

    try {
      let response = await fetch(`${API_BASE_URL}/user-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ mobile: mobileNumber, phone_number: mobileNumber })
      });
      let data = await response.json();

      if (response.ok && data.success !== false) {
        const userId = data.user_id || null;
        setOtpUserId(userId);
        otpUserIdRef.current = userId;
        setIsStoreMember(false);
        setOtpType('login');
        setResendTimer(30);

        setSuccessMsg('OTP sent successfully to your mobile number.');
        const receivedOtp = data.otp || data.data?.otp || data.code || data.user?.otp || data.otp_code;
        const otpStr = receivedOtp ? String(receivedOtp).replace(/\D/g, '').slice(0, 6) : '';
        setApiOtp(otpStr);
        setShowOtp(true);

        const isMobile = isMobileDeviceOrView();
        const isExistingUser = data.is_new_user === false;
        isNewUserRef.current = data.is_new_user === true;

        // ONLY auto-fill and auto-verify when an EXISTING user account enters their number on mobile
        // Unregistered / non-existing numbers (is_new_user === true) will NEVER auto-fill or auto-login
        if (isMobile && isExistingUser && otpStr) {
          setSuccessMsg('OTP sent via SMS & auto-filled. Verifying...');
          setOtpValue(otpStr);
          if (realOtpInputRef.current) realOtpInputRef.current.value = otpStr;
          lastSubmittedOtpRef.current = otpStr;
          // 1200ms allows the user to see the OTP filled in the boxes and receive normal SMS
          setTimeout(() => {
            handleVerifyOtp(otpStr, mobileNumber, userId);
          }, 1200);
        } else {
          setSuccessMsg('OTP sent successfully to your mobile number. Please check your SMS messages.');
          setOtpValue('');
          if (realOtpInputRef.current) realOtpInputRef.current.value = '';
          lastSubmittedOtpRef.current = null;
        }
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
      mobileRef.current = val;
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    lastSubmittedOtpRef.current = null;
    const currentMobile = mobileRef.current || mobile;
    try {
      let response = await fetch(`${API_BASE_URL}/resend-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ phone_number: currentMobile, mobile: currentMobile })
      });

      // If resend-otp not available, fall back to user-login
      if (response.status === 404) {
        response = await fetch(`${API_BASE_URL}/user-login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
          body: JSON.stringify({ phone_number: currentMobile, mobile: currentMobile })
        });
      }

      const data = await response.json();
      if (!response.ok || data.success === false) {
        setError(data.message || 'Failed to resend OTP.');
      } else {
        const userId = data.user_id || otpUserIdRef.current;
        setOtpUserId(userId);
        otpUserIdRef.current = userId;
        setSuccessMsg('OTP sent successfully to your mobile number.');
        const receivedOtp = data.otp || data.data?.otp || data.code || data.user?.otp || data.otp_code;
        const otpStr = receivedOtp ? String(receivedOtp).replace(/\D/g, '').slice(0, 6) : '';
        setApiOtp(otpStr);
        setResendTimer(30);

        const isMobile = isMobileDeviceOrView();
        const isExistingUser = data.is_new_user === false;
        isNewUserRef.current = data.is_new_user === true;

        if (isMobile && isExistingUser && otpStr) {
          setOtpValue(otpStr);
          if (realOtpInputRef.current) realOtpInputRef.current.value = otpStr;
          lastSubmittedOtpRef.current = otpStr;
          setTimeout(() => {
            handleVerifyOtp(otpStr, currentMobile, userId);
          }, 350);
        } else {
          setOtpValue('');
          if (realOtpInputRef.current) realOtpInputRef.current.value = '';
          lastSubmittedOtpRef.current = null;
        }
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ─── VERIFY OTP ──────────────────────────────────────────────────
  const handleVerifyOtp = async (arg, customMobile, customUserId) => {
    if (arg?.preventDefault) arg.preventDefault();
    const currentOtp = (typeof arg === 'string' && arg) ? arg : (otpValue || realOtpInputRef.current?.value || '');
    const currentMobile = (typeof customMobile === 'string' && customMobile) ? customMobile : (mobileRef.current || mobile);
    const currentUserId = customUserId !== undefined ? customUserId : otpUserIdRef.current;

    if (!currentOtp || currentOtp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const verifyUrl = `${API_BASE_URL}/verify-otp/`;

      let response = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({
          phone_number: currentMobile,
          mobile: currentMobile,
          otp: currentOtp,
          ...(currentUserId && { user_id: currentUserId })
        })
      });

      // 404 means user not found or OTP expired on backend
      if (response.status === 404) {
        setError('OTP expired or invalid. Please request a new OTP.');
        setLoading(false);
        return;
      }

      let data = await response.json();

      if (response.ok && data.success !== false) {
        if (!data.user && (data.user_id || currentUserId) && !isStoreMemberRef.current) {
          const lookupId = data.user_id || currentUserId;
          try {
            const userResp = await fetch(`${API_BASE_URL}/customers/${lookupId}/`, {
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (userResp.ok) data.user = await userResp.json();
          } catch (e) {}
        }

        let rawUser = data.user;
        if (Array.isArray(rawUser) && rawUser.length > 0) {
          rawUser = rawUser[0];
        } else if (Array.isArray(rawUser) && rawUser.length === 0) {
          rawUser = {};
        }
        const userObj = rawUser || {};
        const user = {
          ...userObj,
          id: userObj.id || data.user_id || data.id || currentUserId,
          phone_number: userObj.phone_number || userObj.mobile || currentMobile,
          mobile: userObj.mobile || userObj.phone_number || currentMobile,
          name: userObj.name || data.name || (isStoreMemberRef.current ? 'Store Member' : 'Dharani Customer'),
          email: userObj.email || data.email || null,
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
          window.location.href = window.location.pathname;
        }, 300);

      } else {
        if (data.message && String(data.message).toLowerCase().includes('expire')) {
          setError('OTP expired. Please request a new OTP.');
        } else {
          setError(data.message || data.error || 'Invalid OTP. Please try again.');
        }
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
                      name="mobile"
                      id="mobile"
                      autoComplete="tel"
                      className="mobile-input"
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={handleMobileChange}
                      onFocus={(e) => e.target.select()}
                      maxLength={10}
                      required
                    />
                    {mobile && (
                      <button
                        type="button"
                        onClick={() => { setMobile(''); mobileRef.current = ''; }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          color: '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        aria-label="Clear mobile number"
                      >
                        <X size={16} />
                      </button>
                    )}
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
                      <button type="button" className="edit-mobile-btn" onClick={() => { setShowOtp(false); setOtpValue(''); lastSubmittedOtpRef.current = null; }}>Edit</button>
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
                        type="tel"
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

                  {successMsg && <div className="success-message" style={{color: '#10b981', fontSize: '0.85rem', marginBottom: '15px', padding: '10px', background: '#d1fae5', borderRadius: '8px', textAlign: 'center'}}>{successMsg}</div>}
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
