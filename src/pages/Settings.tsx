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
    <div className="settings-page min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="settings-title">Cài đặt</h1>

        {/* Global message alert */}
        {message && (
          <div className={`settings-alert ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-container">
          {/* Sidebar */}
          <div>
            <SettingsSidebar activeTab={activeTab} theme={theme} onTabChange={setActiveTab} />
          </div>

          {/* Tab content */}
          <div className="settings-content">
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