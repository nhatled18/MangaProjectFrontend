import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

type FormMode = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'reset-password';

export const AuthForm = ({ onSuccess, isModal = false }: { onSuccess?: () => void, isModal?: boolean }) => {
  const [mode, setMode] = useState<FormMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, register, forgotPassword, verifyResetCode, resetPassword, isLoading, error, isAuthenticated } = useAuth();
  const onSuccessRef = useRef(onSuccess);

  // Keep ref updated
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  // ✅ SIMPLIFIED: Auto-navigate when authenticated
  useEffect(() => {
    if (isAuthenticated && (mode === 'login' || mode === 'register')) {
      console.log('✅ Auth successful, redirecting...');
      onSuccessRef.current?.();
      navigate('/');
    }
  }, [isAuthenticated, navigate, mode]);

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
        await login(username, password);
      } else if (mode === 'register') {
        if (!username || !email || !password || !confirmPassword) {
          setLocalError('Vui lòng điền đầy đủ thông tin');
          return;
        }
        if (password !== confirmPassword) {
          setLocalError('Mật khẩu không khớp');
          return;
        }
        await register(username, email, password);
        setMode('login');
        setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
      } else if (mode === 'forgot-password') {
        if (!email) {
          setLocalError('Vui lòng nhập email');
          return;
        }
        await forgotPassword(email);
        setMode('verify-code');
        setSuccessMessage('Mã xác nhận đã được gửi về email của bạn.');
      } else if (mode === 'verify-code') {
        if (!otpCode) {
          setLocalError('Vui lòng nhập mã xác nhận');
          return;
        }
        await verifyResetCode(email, otpCode);
        setMode('reset-password');
        setSuccessMessage('Mã xác nhận hợp lệ. Vui lòng đặt mật khẩu mới.');
      } else if (mode === 'reset-password') {
        if (!password || !confirmPassword) {
          setLocalError('Vui lòng nhập mật khẩu mới');
          return;
        }
        if (password !== confirmPassword) {
          setLocalError('Mật khẩu không khớp');
          return;
        }
        await resetPassword(email, otpCode, password);
        setMode('login');
        setSuccessMessage('Đổi mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
      }
    } catch (err) {
      console.error('❌ Auth Error:', err);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Đăng Nhập';
      case 'register': return 'Đăng Ký';
      case 'forgot-password': return 'Quên Mật Khẩu';
      case 'verify-code': return 'Xác Nhận Mã';
      case 'reset-password': return 'Đặt Lại Mật Khẩu';
    }
  };

  const displayError = localError || error;

  const content = (
    <div className="auth-card">
      <h2>{getTitle()}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {displayError && <div className="error-message">{displayError}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          {(mode === 'login' || mode === 'register') && (
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
          )}

          {(mode === 'register' || mode === 'forgot-password' || mode === 'verify-code' || mode === 'reset-password') && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                disabled={isLoading || mode === 'verify-code' || mode === 'reset-password'}
              />
            </div>
          )}

          {mode === 'verify-code' && (
            <div className="form-group">
              <label htmlFor="otp">Mã Xác Nhận (OTP)</label>
              <input
                id="otp"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Nhập mã 6 chữ số"
                maxLength={6}
                disabled={isLoading}
              />
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset-password') && (
            <div className="form-group">
              <label htmlFor="password">
                {mode === 'reset-password' ? 'Mật Khẩu Mới' : 'Password'}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập password"
                disabled={isLoading}
              />
            </div>
          )}

          {(mode === 'register' || mode === 'reset-password') && (
            <div className="form-group">
              <label htmlFor="confirmPassword">
                {mode === 'reset-password' ? 'Xác Nhận Mật Khẩu Mới' : 'Xác Nhận Password'}
              </label>
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
            {isLoading ? 'Đang xử lý...' : 
              mode === 'forgot-password' ? 'Gửi mã xác nhận' : 
              mode === 'verify-code' ? 'Xác nhận mã' :
              mode === 'reset-password' ? 'Đổi mật khẩu' :
              mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'login' && (
            <>
              <button 
                onClick={() => {
                  setMode('forgot-password');
                  setLocalError(null);
                  setSuccessMessage(null);
                }} 
                className="forgot-password-link"
                disabled={isLoading}
                style={{ 
                  display: 'block', 
                  margin: '0 auto 10px', 
                  background: 'none', 
                  border: 'none', 
                  color: '#aaa', 
                  cursor: 'pointer',
                  fontSize: '0.9rem' 
                }}
              >
                Quên mật khẩu?
              </button>
              Chưa có tài khoản?{' '}
              <button 
                onClick={() => setMode('register')} 
                className="toggle-button"
                disabled={isLoading}
              >
                Đăng ký ngay
              </button>
            </>
          )}

          {mode === 'register' && (
            <>
              Đã có tài khoản?{' '}
              <button 
                onClick={() => setMode('login')} 
                className="toggle-button"
                disabled={isLoading}
              >
                Đăng nhập
              </button>
            </>
          )}

          {(mode === 'forgot-password' || mode === 'verify-code' || mode === 'reset-password') && (
            <button 
              onClick={() => {
                setMode('login');
                setOtpCode('');
                setLocalError(null);
                setSuccessMessage(null);
              }} 
              className="toggle-button"
              disabled={isLoading}
            >
              Quay lại Đăng nhập
            </button>
          )}
      </div>
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="auth-container">
      {content}
    </div>
  );
};