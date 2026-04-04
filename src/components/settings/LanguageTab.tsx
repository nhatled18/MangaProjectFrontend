interface Props {
  language: 'vi' | 'en';
  onChange: (lang: 'vi' | 'en') => void;
}

const LANGUAGES: { value: 'vi' | 'en'; label: string }[] = [
  { value: 'vi', label: 'VN Tiếng Việt' },
  { value: 'en', label: 'EN English' },
];

export function LanguageTab({ language, onChange }: Props) {
  return (
    <div>
      <h2>Ngôn ngữ</h2>
      <div className="settings-divider"></div>
      <div className="space-y-2">
        {LANGUAGES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`w-full p-4 rounded-lg text-left transition-all ${
              language === value
                ? 'bg-red-500 text-white font-semibold'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
