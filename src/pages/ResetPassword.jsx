import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../services/api';
import './Login.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          user_id: location.state?.user_id,
          new_password: password,
          confirm_password: confirmPassword
        })
      });

      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch (e) { }

      if (!response.ok || data.success === false) {
        throw new Error(data.message || data.error || 'Failed to reset password. Please try again.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
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
            <h1 className="auth-title">Create New Password</h1>
            <p className="auth-subtitle">Please enter your new password below</p>
          </div>

          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="input-group">
              <label className="input-label" htmlFor="password">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                />
                <Lock
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="var(--text-muted)" />
                  ) : (
                    <Eye size={18} color="var(--text-muted)" />
                  )}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                />
                <Lock
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} color="var(--text-muted)" />
                  ) : (
                    <Eye size={18} color="var(--text-muted)" />
                  )}
                </button>
              </div>
            </div>

            {error && <div style={{ color: '#ef4444', marginTop: '10px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
            {success && <div style={{ color: '#16a34a', marginTop: '10px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>Password updated successfully! Redirecting...</div>}

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '16px' }} disabled={loading}>
              <CheckCircle size={20} />
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
