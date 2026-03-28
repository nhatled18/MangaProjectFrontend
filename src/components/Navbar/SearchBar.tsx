import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  className?: string;
  mobile?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(({ onSearch, className = '', mobile = false }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onSearch?.(searchQuery.trim());
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm truyện..."
            className={`w-full bg-gray-800 text-white px-4 py-2 ${
              mobile ? 'pr-10 border border-gray-700' : ''
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500`}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500"
          >
            <Search size={mobile ? 18 : 20} />
          </button>
        </div>
      </form>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
