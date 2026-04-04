interface NotificationSettings {
  email: boolean;
  push: boolean;
  newsletter: boolean;
}

interface Props {
  notifications: NotificationSettings;
  onChange: (key: keyof NotificationSettings) => void;
}

const ITEMS: { key: keyof NotificationSettings; label: string; description: string }[] = [
  { key: 'email', label: 'Thông báo Email', description: 'Nhận thông báo qua email' },
  { key: 'push', label: 'Thông báo Push', description: 'Nhận thông báo trình duyệt' },
  { key: 'newsletter', label: 'Bản tin', description: 'Nhận email bản tin hàng tuần' },
];

export function NotificationsTab({ notifications, onChange }: Props) {
  return (
    <div>
      <h2>Cài đặt thông báo</h2>
      <div className="settings-divider"></div>
      <div className="space-y-4">
        {ITEMS.map(({ key, label, description }) => (
          <div key={key} className="settings-toggle">
            <input
              type="checkbox"
              checked={notifications[key]}
              onChange={() => onChange(key)}
            />
            <div className="flex-1">
              <p className="font-semibold">{label}</p>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
