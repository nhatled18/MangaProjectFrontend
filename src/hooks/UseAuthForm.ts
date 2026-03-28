import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useAuthFields, type FormFields } from './auth/useAuthFields';
import { validateForm, type FormMode } from './auth/useAuthValidation';

export type { FormMode, FormFields };

export interface UseAuthFormReturn {
  mode: FormMode;
  fields: FormFields;
  localError: string | null;
  successMessage: string | null;
  isLoading: boolean;
  displayError: string | null;
  setMode: (mode: FormMode) => void;
  setField: (field: keyof FormFields, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  goToForgotPassword: () => void;
  goToLogin: () => void;
  goToRegister: () => void;
}

export function useAuthForm(onSuccess?: () => void): UseAuthFormReturn {
  const [mode, setModeState] = useState<FormMode>('login');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { fields, setField, resetFields } = useAuthFields();
  const { login, register, forgotPassword, verifyResetCode, resetPassword, isLoading, error, isAuthenticated } = useAuth();

  const onSuccessRef = useRef(onSuccess);
  useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);

  // Navigate on success
  useEffect(() => {
    if (isAuthenticated && (mode === 'login' || mode === 'register')) {
      onSuccessRef.current?.();
      navigate('/');
    }
  }, [isAuthenticated, navigate, mode]);

  const setMode = useCallback((next: FormMode) => {
    setModeState(next);
    setLocalError(null);
    setSuccessMessage(null);
  }, []);

  const goToLogin = useCallback(() => {
    setField('otpCode', '');
    setMode('login');
  }, [setField, setMode]);

  const goToForgotPassword = useCallback(() => setMode('forgot-password'), [setMode]);
  const goToRegister = useCallback(() => setMode('register'), [setMode]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    const validationError = validateForm(mode, fields);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      switch (mode) {
        case 'login':
          await login(fields.username, fields.password);
          break;
        case 'register':
          await register(fields.username, fields.email, fields.password);
          setModeState('login');
          setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
          break;
        case 'forgot-password':
          await forgotPassword(fields.email);
          setModeState('verify-code');
          setSuccessMessage('Mã xác nhận đã được gửi về email của bạn.');
          break;
        case 'verify-code':
          await verifyResetCode(fields.email, fields.otpCode);
          setModeState('reset-password');
          setSuccessMessage('Mã xác nhận hợp lệ. Vui lòng đặt mật khẩu mới.');
          break;
        case 'reset-password':
          await resetPassword(fields.email, fields.otpCode, fields.password);
          setModeState('login');
          resetFields();
          setSuccessMessage('Đổi mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
          break;
      }
    } catch (err: any) {
      console.error('❌ Auth Submission Error:', err);
    }
  }, [mode, fields, login, register, forgotPassword, verifyResetCode, resetPassword, resetFields]);

  return {
    mode,
    fields,
    localError,
    successMessage,
    isLoading,
    displayError: localError || error,
    setMode,
    setField,
    handleSubmit,
    goToForgotPassword,
    goToLogin,
    goToRegister,
  };
}
