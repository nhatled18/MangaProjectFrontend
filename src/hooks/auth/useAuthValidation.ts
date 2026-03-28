import { FormFields } from './useAuthFields';

export type FormMode = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'reset-password';

const VALIDATORS: Record<FormMode, (fields: FormFields) => string | null> = {
  login: ({ username, password }) => {
    if (!username || !password) return 'Vui lòng điền đầy đủ thông tin';
    return null;
  },
  register: ({ username, email, password, confirmPassword }) => {
    if (!username || !email || !password || !confirmPassword)
      return 'Vui lòng điền đầy đủ thông tin';
    if (password !== confirmPassword) return 'Mật khẩu không khớp';
    if (password.length < 6) return 'Mật khẩu phải từ 6 ký tự trở lên';
    return null;
  },
  'forgot-password': ({ email }) => {
    if (!email) return 'Vui lòng nhập email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email không hợp lệ';
    return null;
  },
  'verify-code': ({ otpCode }) => {
    if (!otpCode) return 'Vui lòng nhập mã xác nhận';
    if (otpCode.length < 6) return 'Mã xác nhận phải đủ 6 ký tự';
    return null;
  },
  'reset-password': ({ password, confirmPassword }) => {
    if (!password || !confirmPassword) return 'Vui lòng nhập mật khẩu mới';
    if (password !== confirmPassword) return 'Mật khẩu không khớp';
    if (password.length < 6) return 'Mật khẩu mới phải từ 6 ký tự trở lên';
    return null;
  },
};

export function validateForm(mode: FormMode, fields: FormFields): string | null {
  return VALIDATORS[mode](fields);
}
