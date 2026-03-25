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
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Cài đặt thông báo</h2>
      <div className="space-y-4">
        {ITEMS.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white font-semibold">{label}</p>
              <p className="text-gray-400 text-sm">{description}</p>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() => onChange(key)}
              className={`w-12 h-6 rounded-full transition-colors ${notifications[key] ? 'bg-yellow-500' : 'bg-gray-700'}`}
              role="switch"
              aria-checked={notifications[key]}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications[key] ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
