import { Bell, Globe, Moon, Sun } from 'lucide-react';

export type SettingsTab = 'password' | 'notifications' | 'theme' | 'language';

interface Props {
  activeTab: SettingsTab;
  theme: 'dark' | 'light';
  onTabChange: (tab: SettingsTab) => void;
}

const NAV_ITEMS: {
  tab: SettingsTab;
  label: string;
  icon?: (theme: 'dark' | 'light') => React.ReactNode;
}[] = [
  { tab: 'password', label: '🔐 Đổi mật khẩu' },
  {
    tab: 'notifications',
    label: 'Thông báo',
    icon: () => <Bell size={16} className="inline mr-2" />,
  },
  {
    tab: 'theme',
    label: 'Giao diện',
    icon: (t) =>
      t === 'dark' ? (
        <Moon size={16} className="inline mr-2" />
      ) : (
        <Sun size={16} className="inline mr-2" />
      ),
  },
  {
    tab: 'language',
    label: 'Ngôn ngữ',
    icon: () => <Globe size={16} className="inline mr-2" />,
  },
];

export function SettingsSidebar({ activeTab, theme, onTabChange }: Props) {
  return (
    <nav className="settings-sidebar">
      {NAV_ITEMS.map(({ tab, label, icon }) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`settings-tab-btn ${activeTab === tab ? 'active' : ''}`}
        >
          {icon?.(theme)}
          {label}
        </button>
      ))}
    </nav>
  );
}
