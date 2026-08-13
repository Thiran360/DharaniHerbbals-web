import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import './Login.css';

export default function ForgotPassword() {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      const response = await fetch('https://api.codingboss.in/herbal/forgot-password/', {
=======
      const response = await fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/user-login/', {
>>>>>>> master
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ email })
      });

      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch (e) { }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || data.error || 'Failed to send OTP.');
      }

      if (data.user_id) {
        setUserId(data.user_id);
      } else if (data.id) {
        setUserId(data.id);
      }

      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (otp.length < 4) {
        throw new Error('Please enter a valid OTP.');
      }

<<<<<<< HEAD
      const response = await fetch('https://api.codingboss.in/herbal/verify-forgot-password-otp/', {
=======
      const response = await fetch('https://concise-egomaniac-starved.ngrok-free.dev/herbal/verify-user-login-otp/', {
>>>>>>> master
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ user_id: userId, otp })
      });

      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch (e) { }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || data.error || 'Invalid OTP. Please try again.');
      }

      // Navigate to reset-password upon successful verification
      navigate('/reset-password', { state: { user_id: userId, otp } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="auth-container">
        <div className="auth-glass-card">
          <div className="auth-header">
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">
              {step === 'email' ? 'Enter your registered email to receive an OTP' : 'We have sent a 6-digit OTP to your email'}
            </p>
          </div>

          <form className="auth-form" onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp}>
            {step === 'email' ? (
              <div className="input-group">
                <label className="input-label" htmlFor="email">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="email"
                    type="email"
                    className="input-field"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '40px' }}
                  />
                  <Mail
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label className="input-label" htmlFor="otp">Enter OTP</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="otp"
                    type="text"
                    className="input-field"
                    placeholder="e.g. 123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={{ paddingLeft: '40px' }}
                    maxLength="6"
                  />
                  <Lock
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>
            )}

            {error && <div style={{ color: '#ef4444', marginTop: '10px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '16px' }} disabled={loading}>
              {step === 'email' ? <ArrowRight size={20} /> : <ShieldCheck size={20} />}
              {loading ? 'Processing...' : (step === 'email' ? 'Send OTP' : 'Verify OTP')}
            </button>
          </form>

          <div className="auth-footer">
            Remembered your password?
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
