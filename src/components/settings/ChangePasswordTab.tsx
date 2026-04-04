import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getApiUrl } from '@/utils/image';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  onMessage: (msg: { type: 'success' | 'error'; text: string }) => void;
}

export function ChangePasswordTab({ onMessage }: Props) {
  const { token } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof passwords) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswords(prev => ({ ...prev, [field]: e.target.value }));

  const toggleShow = (field: keyof typeof show) =>
    setShow(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      onMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      onMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      return;
    }
    if (passwords.new.length < 6) {
      onMessage({ type: 'error', text: 'Mật khẩu mới phải ít nhất 6 ký tự' });
      return;
    }
    if (passwords.current === passwords.new) {
      onMessage({ type: 'error', text: 'Mật khẩu mới phải khác mật khẩu hiện tại' });
      return;
    }
    if (!token) {
      onMessage({ type: 'error', text: 'Bạn chưa đăng nhập' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await response.json();
      if (!response.ok) {
        onMessage({ type: 'error', text: data.error || data.message || `Error ${response.status}` });
        return;
      }
      onMessage({ type: 'success', text: data.message || 'Đổi mật khẩu thành công!' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      onMessage({ type: 'error', text: err instanceof Error ? err.message : 'Lỗi khi kết nối đến server' });
    } finally {
      setLoading(false);
    }
  };

  const fields: { key: keyof typeof passwords; label: string; placeholder: string }[] = [
    { key: 'current', label: 'Mật khẩu hiện tại', placeholder: 'Nhập mật khẩu hiện tại' },
    { key: 'new', label: 'Mật khẩu mới', placeholder: 'Nhập mật khẩu mới' },
    { key: 'confirm', label: 'Xác nhận mật khẩu mới', placeholder: 'Nhập lại mật khẩu mới' },
  ];

  return (
    <div>
      <h2>Đổi mật khẩu</h2>
      <div className="settings-divider"></div>
      <div className="space-y-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="settings-group">
            <label>{label}</label>
            <div className="relative">
              <input
                type={show[key] ? 'text' : 'password'}
                value={passwords[key]}
                onChange={set(key)}
                placeholder={placeholder}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => toggleShow(key)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                disabled={loading}
              >
                {show[key] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="settings-button"
        >
          {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
        </button>
      </div>
    </div>
  );
}
