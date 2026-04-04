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
    <>
      <div className="auth-header">
        <h2>{TITLE[mode]}</h2>
        <p>FAIRY TAIL READER</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-wrapper">
        {displayError   && <div className="auth-error-message">{displayError}</div>}
        {successMessage && <div className="auth-success-message">{successMessage}</div>}

        {/* Username */}
        {show('username', mode) && (
          <div className="auth-input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={fields.username}
              onChange={(e) => setField('username', e.target.value)}
              placeholder="Nhập tên đăng nhập"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Email */}
        {show('email', mode) && (
          <div className="auth-input-group">
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
          <div className="auth-input-group">
            <label htmlFor="otp">Mã Xác Nhận (OTP)</label>
            <input
              id="otp"
              type="text"
              className="auth-otp-input"
              value={fields.otpCode}
              onChange={(e) => setField('otpCode', e.target.value)}
              placeholder="000000"
              maxLength={6}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Password */}
        {show('password', mode) && (
          <div className="auth-input-group">
            <label htmlFor="password">
              {mode === 'reset-password' ? 'Mật Khẩu Mới' : 'Password'}
            </label>
            <input
              id="password"
              type="password"
              value={fields.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        )}

        {/* Confirm Password */}
        {show('confirmPassword', mode) && (
          <div className="auth-input-group">
            <label htmlFor="confirmPassword">
              {mode === 'reset-password' ? 'Xác Nhận Mật Khẩu Mới' : 'Xác Nhận Password'}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={fields.confirmPassword}
              onChange={(e) => setField('confirmPassword', e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        )}

        <button type="submit" className="auth-btn-submit" disabled={isLoading}>
          {isLoading ? <div className="auth-spinner"></div> : SUBMIT_LABEL[mode]}
        </button>
      </form>

      <div className="auth-footer">
        {mode === 'login' && (
          <div className="auth-toggle-buttons">
            <button
              onClick={goToForgotPassword}
              className="auth-toggle-link"
              disabled={isLoading}
            >
              Quên mật khẩu?
            </button>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Chưa có tài khoản?{' '}
              <button onClick={goToRegister} className="auth-register-link" disabled={isLoading}>
                Đăng ký ngay
              </button>
            </p>
          </div>
        )}

        {mode === 'register' && (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Đã có tài khoản?{' '}
            <button onClick={goToLogin} className="auth-register-link" disabled={isLoading}>
              Đăng nhập
            </button>
          </p>
        )}

        {(mode === 'forgot-password' || mode === 'verify-code' || mode === 'reset-password') && (
          <button onClick={goToLogin} className="auth-toggle-link" disabled={isLoading}>
            ← Quay lại đăng nhập
          </button>
        )}
      </div>
    </>
  );

  if (isModal) return content;

  return <div className="auth-container">{content}</div>;
};