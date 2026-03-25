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
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Ngôn ngữ</h2>
      <div className="space-y-2">
        {LANGUAGES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`w-full p-4 rounded-lg text-left transition-all ${
              language === value
                ? 'bg-yellow-500 text-gray-900 font-semibold'
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
