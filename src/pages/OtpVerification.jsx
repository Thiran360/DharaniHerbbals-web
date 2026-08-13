import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';
import './Login.css';

export default function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [timerActive, setTimerActive] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (timeLeft > 0 && timerActive) {
      const timerId = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setError('OTP has expired. Please request a new one.');
      setSuccessMsg(null);
    }
  }, [timeLeft, timerActive]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!timerActive) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          email: location.state?.email,
          otp: otp
        })
      });

      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch (e) { }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || data.error || 'Invalid OTP. Please try again.');
      }

      // Success!
      // Log the user in by saving to localStorage
      if (data) {
        localStorage.setItem('user', JSON.stringify(data.user || data));
      }

      setSuccessMsg('Verification successful! Redirecting to home...');
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('Verify error:', err);
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const response = await fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/resend-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          email: location.state?.email
        })
      });

      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch (e) { }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || data.error || 'Failed to resend OTP.');
      }

      setTimeLeft(300);
      setTimerActive(true);
      setOtp('');
      setSuccessMsg('A new OTP has been sent to your email address.');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="login-page-wrapper">
      <div className="auth-container">
        <div className="auth-glass-card">
          <div className="auth-header">
            <h1 className="auth-title">Verify OTP</h1>
            <p className="auth-subtitle">We have sent a 6-digit OTP to your email address.</p>
          </div>

          <form className="auth-form" onSubmit={handleVerify}>
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label" htmlFor="otp">Enter OTP</label>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: timerActive ? (timeLeft <= 30 ? '#ef4444' : '#22c55e') : '#ef4444',
                  background: timerActive ? (timeLeft <= 30 ? '#fef2f2' : '#f0fdf4') : '#fef2f2',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div style={{ position: 'relative', marginTop: '4px' }}>
                <input
                  id="otp"
                  type="text"
                  className="input-field"
                  placeholder="e.g. 123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={!timerActive}
                  style={{
                    paddingLeft: '40px',
                    backgroundColor: !timerActive ? '#f3f4f6' : undefined,
                    cursor: !timerActive ? 'not-allowed' : undefined,
                    opacity: !timerActive ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  maxLength="6"
                />
                <Lock
                  size={18}
                  color={!timerActive ? "#9ca3af" : "var(--text-muted)"}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.3s ease' }}
                />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>
                <span style={{ color: '#d97706' }}> Didn't receive the OTP? Check your Spam folder.</span>
              </p>
            </div>

            {error && <div style={{ color: '#ef4444', marginTop: '10px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
            {successMsg && <div style={{ color: '#16a34a', marginTop: '10px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{successMsg}</div>}

            {!timerActive ? (
              <button
                type="button"
                onClick={handleResendOtp}
                className="btn btn-primary btn-full"
                disabled={loading}
                style={{
                  marginTop: '16px',
                  backgroundColor: loading ? '#fcd34d' : '#f59e0b',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.25)'
                }}
              >
                {loading ? <Loader2 size={20} className="spinner" /> : <RefreshCw size={20} />}
                {loading ? 'Resending...' : 'Resend OTP'}
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ marginTop: '16px' }}
                disabled={loading || otp.length < 6}
              >
                <ShieldCheck size={20} />
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
