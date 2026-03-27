import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FormMode = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'reset-password';

export interface FormFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  otpCode: string;
}

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

// ─── Validation ───────────────────────────────────────────────────────────────

const VALIDATORS: Record<FormMode, (fields: FormFields) => string | null> = {
  login: ({ username, password }) => {
    if (!username || !password) return 'Vui lòng điền đầy đủ thông tin';
    return null;
  },
  register: ({ username, email, password, confirmPassword }) => {
    if (!username || !email || !password || !confirmPassword)
      return 'Vui lòng điền đầy đủ thông tin';
    if (password !== confirmPassword) return 'Mật khẩu không khớp';
    return null;
  },
  'forgot-password': ({ email }) => {
    if (!email) return 'Vui lòng nhập email';
    return null;
  },
  'verify-code': ({ otpCode }) => {
    if (!otpCode) return 'Vui lòng nhập mã xác nhận';
    return null;
  },
  'reset-password': ({ password, confirmPassword }) => {
    if (!password || !confirmPassword) return 'Vui lòng nhập mật khẩu mới';
    if (password !== confirmPassword) return 'Mật khẩu không khớp';
    return null;
  },
};

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_FIELDS: FormFields = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  otpCode: '',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthForm(onSuccess?: () => void): UseAuthFormReturn {
  const [mode, setModeState] = useState<FormMode>('login');
  const [fields, setFields] = useState<FormFields>(INITIAL_FIELDS);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, register, forgotPassword, verifyResetCode, resetPassword, isLoading, error, isAuthenticated } = useAuth();

  const onSuccessRef = useRef(onSuccess);
  useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);

  // ── Auto-navigate after login/register ──────────────────────────────────

  useEffect(() => {
    if (isAuthenticated && (mode === 'login' || mode === 'register')) {
      onSuccessRef.current?.();
      navigate('/');
    }
  }, [isAuthenticated, navigate, mode]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const setField = useCallback((field: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearMessages = useCallback(() => {
    setLocalError(null);
    setSuccessMessage(null);
  }, []);

  const setMode = useCallback((next: FormMode) => {
    setModeState(next);
    clearMessages();
  }, [clearMessages]);

  // ── Navigation shorthands ────────────────────────────────────────────────

  const goToLogin = useCallback(() => {
    setFields((prev) => ({ ...prev, otpCode: '' }));
    setMode('login');
  }, [setMode]);

  const goToForgotPassword = useCallback(() => setMode('forgot-password'), [setMode]);
  const goToRegister = useCallback(() => setMode('register'), [setMode]);

  // ── Submit handlers (one per mode) ───────────────────────────────────────

  const HANDLERS: Record<FormMode, (f: FormFields) => Promise<void>> = {
    login: async ({ username, password }) => {
      await login(username, password);
    },
    register: async ({ username, email, password }) => {
      await register(username, email, password);
      setModeState('login');
      setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
    },
    'forgot-password': async ({ email }) => {
      await forgotPassword(email);
      setModeState('verify-code');
      setSuccessMessage('Mã xác nhận đã được gửi về email của bạn.');
    },
    'verify-code': async ({ email, otpCode }) => {
      await verifyResetCode(email, otpCode);
      setModeState('reset-password');
      setSuccessMessage('Mã xác nhận hợp lệ. Vui lòng đặt mật khẩu mới.');
    },
    'reset-password': async ({ email, otpCode, password }) => {
      await resetPassword(email, otpCode, password);
      setModeState('login');
      setSuccessMessage('Đổi mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
    },
  };

  // ── Main submit ──────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const validationError = VALIDATORS[mode](fields);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await HANDLERS[mode](fields);
    } catch (err) {
      console.error('❌ Auth Error:', err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, fields, clearMessages]);

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