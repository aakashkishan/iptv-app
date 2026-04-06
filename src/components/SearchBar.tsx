import { useState } from 'react';
import { useStore } from '@/store';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { setSearchQuery } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  const handleClear = () => {
    setQuery('');
    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search channels..."
          className="w-full px-4 py-3 pl-12 rounded-lg text-white focus:outline-none transition-colors"
          style={{ backgroundColor: 'var(--bg2)', border: '1px solid var(--bg3)' }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--bright-blue)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bg3)'}
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: 'var(--fg4)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: 'var(--fg4)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fg1)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--fg4)'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
