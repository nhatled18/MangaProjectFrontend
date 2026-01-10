import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

type FormMode = 'login' | 'register';

export const AuthForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [mode, setMode] = useState<FormMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, register, isLoading, error, isAuthenticated } = useAuth();
  const onSuccessRef = useRef(onSuccess);

  // Keep ref updated
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  // ✅ SIMPLIFIED: Auto-navigate when authenticated
  // No delay needed - state updates are instant now
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ Login successful, redirecting...');
      onSuccessRef.current?.();
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'login') {
        if (!username || !password) {
          setLocalError('Vui lòng điền đầy đủ thông tin');
          return;
        }
        console.log('🔐 Đang đăng nhập...');
        await login(username, password);
        // No need to wait - useEffect above will handle navigation
      } else {
        if (!username || !email || !password || !confirmPassword) {
          setLocalError('Vui lòng điền đầy đủ thông tin');
          return;
        }
        if (password !== confirmPassword) {
          setLocalError('Mật khẩu không khớp');
          return;
        }
        console.log('📝 Đang đăng ký...');
        await register(username, email, password);
        // After registration, switch to login mode
        setMode('login');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập với tài khoản của bạn.');
      }
    } catch (err) {
      console.error('❌ Lỗi xác thực:', err);
      // Error is handled by the hook and displayed via `error` state
    }
  };

  const displayError = localError || (mode === 'login' && error);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {displayError && <div className="error-message">{displayError}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username"
              disabled={isLoading}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập password"
              disabled={isLoading}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác Nhận Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại password"
                disabled={isLoading}
              />
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'login' ? (
            <>
              Chưa có tài khoản?{' '}
              <button 
                onClick={() => {
                  setMode('register');
                  setLocalError(null);
                  setSuccessMessage(null);
                }} 
                className="toggle-button"
                disabled={isLoading}
              >
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{' '}
              <button 
                onClick={() => {
                  setMode('login');
                  setLocalError(null);
                  setSuccessMessage(null);
                }} 
                className="toggle-button"
                disabled={isLoading}
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};