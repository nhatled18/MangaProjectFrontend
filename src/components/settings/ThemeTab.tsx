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
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Giao diện</h2>
      <div className="grid grid-cols-2 gap-4">
        {THEMES.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`p-6 rounded-lg border-2 transition-all ${
              theme === value
                ? 'border-yellow-500 bg-gray-800'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <Icon size={24} className="mx-auto mb-2 text-yellow-500" />
            <p className="text-white font-semibold">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
