import { useState, useEffect } from 'react';
import { SettingsSidebar, SettingsTab } from '@/components/settings/SettingsSidebar';
import { ChangePasswordTab } from '@/components/settings/ChangePasswordTab';
import { NotificationsTab } from '@/components/settings/NotificationsTab';
import { ThemeTab } from '@/components/settings/ThemeTab';
import { LanguageTab } from '@/components/settings/LanguageTab';

type Message = { type: 'success' | 'error'; text: string };

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('password');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newsletter: true,
  });
  const [message, setMessage] = useState<Message | null>(null);

  // Auto-clear alert after 5 s
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setMessage({ type: 'success', text: 'Cập nhật cài đặt thành công' });
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    setMessage({ type: 'success', text: `Đã thay đổi giao diện thành ${newTheme === 'dark' ? 'tối' : 'sáng'}` });
  };

  const handleLanguageChange = (lang: 'vi' | 'en') => {
    setLanguage(lang);
    setMessage({ type: 'success', text: 'Đã thay đổi ngôn ngữ' });
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Cài đặt</h1>

        {/* Global message alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg transition-all ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500 text-green-300'
                : 'bg-red-500/20 border border-red-500 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SettingsSidebar activeTab={activeTab} theme={theme} onTabChange={setActiveTab} />
          </div>

          {/* Tab content */}
          <div className="lg:col-span-3">
            {activeTab === 'password' && <ChangePasswordTab onMessage={setMessage} />}
            {activeTab === 'notifications' && (
              <NotificationsTab notifications={notifications} onChange={handleNotificationChange} />
            )}
            {activeTab === 'theme' && <ThemeTab theme={theme} onChange={handleThemeChange} />}
            {activeTab === 'language' && <LanguageTab language={language} onChange={handleLanguageChange} />}
          </div>
        </div>
      </div>
    </div>
  );
}