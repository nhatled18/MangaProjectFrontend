import React from 'react';
import { useAuthForm, type FormMode } from '../hooks/useAuthForm';
import '../styles/auth.css';

const SHOW: Record<string, FormMode[]> = {
  username:        ['login', 'register'],
  email:           ['register', 'forgot-password', 'verify-code', 'reset-password'],
  otpCode:         ['verify-code'],
  password:        ['login', 'register', 'reset-password'],
  confirmPassword: ['register', 'reset-password'],
};

const show = (field: string, mode: FormMode) => SHOW[field].includes(mode);



const TITLE: Record<FormMode, string> = {
  'login':          'Đăng Nhập',
  'register':       'Đăng Ký',
  'forgot-password':'Quên Mật Khẩu',
  'verify-code':    'Xác Nhận Mã',
  'reset-password': 'Đặt Lại Mật Khẩu',
};

const SUBMIT_LABEL: Record<FormMode, string> = {
  'login':          'Đăng Nhập',
  'register':       'Đăng Ký',
  'forgot-password':'Gửi mã otp để reset mật khẩu',
  'verify-code':    'Xác nhận mã',
  'reset-password': 'Đặt lại mật khẩu',
};  

interface AuthFormProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, isModal = false }) => {
  const {
    mode, fields, isLoading, displayError, successMessage,
    setField, handleSubmit, goToForgotPassword, goToLogin, goToRegister,
  } = useAuthForm(onSuccess);

  const content = (
    <div className="auth-card">
      <h2>{TITLE[mode]}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {displayError   && <div className="error-message">{displayError}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {/* Username */}
        {show('username', mode) && (
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={fields.username}
              onChange={(e) => setField('username', e.target.value)}
              placeholder="Nhập username"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Email */}
        {show('email', mode) && (
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={fields.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="Nhập email của bạn"
              disabled={isLoading || mode === 'verify-code' || mode === 'reset-password'}
            />
          </div>
        )}

        {/* OTP */}
        {show('otpCode', mode) && (
          <div className="form-group">
            <label htmlFor="otp">Mã Xác Nhận (OTP)</label>
            <input
              id="otp"
              type="text"
              value={fields.otpCode}
              onChange={(e) => setField('otpCode', e.target.value)}
              placeholder="Nhập mã 6 chữ số"
              maxLength={6}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Password */}
        {show('password', mode) && (
          <div className="form-group">
            <label htmlFor="password">
              {mode === 'reset-password' ? 'Mật Khẩu Mới' : 'Password'}
            </label>
            <input
              id="password"
              type="password"
              value={fields.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder="Nhập password"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Confirm Password */}
        {show('confirmPassword', mode) && (
          <div className="form-group">
            <label htmlFor="confirmPassword">
              {mode === 'reset-password' ? 'Xác Nhận Mật Khẩu Mới' : 'Xác Nhận Password'}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={fields.confirmPassword}
              onChange={(e) => setField('confirmPassword', e.target.value)}
              placeholder="Nhập lại password"
              disabled={isLoading}
            />
          </div>
        )}

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : SUBMIT_LABEL[mode]}
        </button>
      </form>

      {/* Navigation links */}
      <div className="auth-toggle">
        {mode === 'login' && (
          <>
            <button
              onClick={goToForgotPassword}
              className="forgot-password-link"
              disabled={isLoading}
              style={{ display: 'block', margin: '0 auto 10px', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Quên mật khẩu?
            </button>
            Chưa có tài khoản?{' '}
            <button onClick={goToRegister} className="toggle-button" disabled={isLoading}>
              Đăng ký ngay
            </button>
          </>
        )}

        {mode === 'register' && (
          <>
            Đã có tài khoản?{' '}
            <button onClick={goToLogin} className="toggle-button" disabled={isLoading}>
              Đăng nhập
            </button>
          </>
        )}

        {(mode === 'forgot-password' || mode === 'verify-code' || mode === 'reset-password') && (
          <button onClick={goToLogin} className="toggle-button" disabled={isLoading}>
            Quay lại Đăng nhập
          </button>
        )}
      </div>
    </div>
  );

  if (isModal) return content;

  return <div className="auth-container">{content}</div>;
};