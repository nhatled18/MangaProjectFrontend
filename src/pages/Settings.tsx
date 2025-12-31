import { useState, useEffect } from 'react';
import { Eye, EyeOff, Moon, Sun, Bell, Globe } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'password' | 'notifications' | 'theme' | 'language'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newsletter: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Get API URL from environment or use default
  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  };

  // Auto clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChangePassword = async () => {
    // Validation
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      return;
    }

    if (passwords.new.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải ít nhất 6 ký tự' });
      return;
    }

    if (passwords.current === passwords.new) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải khác mật khẩu hiện tại' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'Bạn chưa đăng nhập' });
        setLoading(false);
        return;
      }

      const payload = {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      };

      console.log('🔍 DEBUG INFO:');
      console.log('📤 Token:', token.substring(0, 20) + '...');
      console.log('📤 Payload:', payload);
      console.log('📤 Payload keys:', Object.keys(payload));
      
      setDebugInfo({
        timestamp: new Date().toISOString(),
        hasToken: !!token,
        tokenLength: token?.length,
        payloadKeys: Object.keys(payload),
        payloadValues: payload,
      });
      
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Headers:', response.headers);

      const data = await response.json();
      console.log('📥 Response Body:', data);

      if (!response.ok) {
        const errorMsg = data.error || data.message || `Error ${response.status}`;
        console.error('❌ Error:', errorMsg);
        setMessage({ type: 'error', text: errorMsg });
        setDebugInfo((prev: any) => ({ ...prev, error: data }));
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: data.message || 'Đổi mật khẩu thành công!' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi khi kết nối đến server';
      console.error('❌ Exception:', errorMsg);
      setMessage({ 
        type: 'error', 
        text: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    setMessage({ type: 'success', text: `Đã thay đổi giao diện thành ${newTheme === 'dark' ? 'tối' : 'sáng'}` });
  };

  const handleLanguageChange = (newLang: 'vi' | 'en') => {
    setLanguage(newLang);
    setMessage({ type: 'success', text: `Đã thay đổi ngôn ngữ` });
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setMessage({ type: 'success', text: 'Cập nhật cài đặt thành công' });
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Cài đặt</h1>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg transition-all ${message.type === 'success' ? 'bg-green-500 bg-opacity-20 border border-green-500 text-green-300' : 'bg-red-500 bg-opacity-20 border border-red-500 text-red-300'}`}>
            {message.text}
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-300 text-sm">
            <p className="font-semibold mb-2">🐛 Debug Info:</p>
            <pre className="text-xs overflow-auto bg-gray-900 p-2 rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
            <button
              onClick={() => setDebugInfo(null)}
              className="mt-2 text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-500"
            >
              ✕ Đóng
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'password'
                    ? 'bg-yellow-500 text-gray-900 font-semibold'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                🔐 Đổi mật khẩu
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-yellow-500 text-gray-900 font-semibold'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Bell size={16} className="inline mr-2" />
                Thông báo
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'theme'
                    ? 'bg-yellow-500 text-gray-900 font-semibold'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {theme === 'dark' ? <Moon size={16} className="inline mr-2" /> : <Sun size={16} className="inline mr-2" />}
                Giao diện
              </button>
              <button
                onClick={() => setActiveTab('language')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'language'
                    ? 'bg-yellow-500 text-gray-900 font-semibold'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Globe size={16} className="inline mr-2" />
                Ngôn ngữ
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Change Password */}
            {activeTab === 'password' && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Đổi mật khẩu</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Nhập mật khẩu hiện tại"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Nhập mật khẩu mới"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                        disabled={loading}
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Nhập lại mật khẩu mới"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="w-full bg-yellow-500 text-gray-900 font-semibold py-2 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Cài đặt thông báo</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Thông báo Email</p>
                      <p className="text-gray-400 text-sm">Nhận thông báo qua email</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('email')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications.email ? 'bg-yellow-500' : 'bg-gray-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.email ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Thông báo Push</p>
                      <p className="text-gray-400 text-sm">Nhận thông báo trình duyệt</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('push')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications.push ? 'bg-yellow-500' : 'bg-gray-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.push ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Bản tin</p>
                      <p className="text-gray-400 text-sm">Nhận email bản tin hàng tuần</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('newsletter')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications.newsletter ? 'bg-yellow-500' : 'bg-gray-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications.newsletter ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Theme */}
            {activeTab === 'theme' && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Giao diện</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-yellow-500 bg-gray-800'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Moon size={24} className="mx-auto mb-2 text-yellow-500" />
                    <p className="text-white font-semibold">Chế độ tối</p>
                  </button>

                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-yellow-500 bg-gray-800'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Sun size={24} className="mx-auto mb-2 text-yellow-500" />
                    <p className="text-white font-semibold">Chế độ sáng</p>
                  </button>
                </div>
              </div>
            )}

            {/* Language */}
            {activeTab === 'language' && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Ngôn ngữ</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => handleLanguageChange('vi')}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      language === 'vi'
                        ? 'bg-yellow-500 text-gray-900 font-semibold'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    VN Tiếng Việt
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      language === 'en'
                        ? 'bg-yellow-500 text-gray-900 font-semibold'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    EN English
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}