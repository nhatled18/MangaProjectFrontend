import { Moon, Sun } from 'lucide-react';

interface Props {
  theme: 'dark' | 'light';
  onChange: (theme: 'dark' | 'light') => void;
}

const THEMES: { value: 'dark' | 'light'; label: string; Icon: typeof Moon }[] = [
  { value: 'dark', label: 'Chế độ tối', Icon: Moon },
  { value: 'light', label: 'Chế độ sáng', Icon: Sun },
];

export function ThemeTab({ theme, onChange }: Props) {
  return (
    <div>
      <h2>Giao diện</h2>
      <div className="settings-divider"></div>
      <div className="grid grid-cols-2 gap-4">
        {THEMES.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`p-6 rounded-lg border-2 transition-all ${
              theme === value
                ? 'border-red-500 bg-red-500/10'
                : 'border-gray-700 bg-gray-800 hover:border-red-500/50'
            }`}
          >
            <Icon size={24} className="mx-auto mb-2 text-red-500" />
            <p className="text-white font-semibold">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
