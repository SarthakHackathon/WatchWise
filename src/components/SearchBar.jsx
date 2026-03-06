import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div
      className={`flex items-center gap-3 w-full rounded-full px-5 py-3
        bg-gray-800 border transition-all duration-200 shadow-inner
        ${value ? 'border-orange-500 shadow-orange-500/10' : 'border-gray-700'}
        focus-within:border-orange-500 focus-within:shadow-orange-500/10`}
    >
      {/* Search icon */}
      <Search
        className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
          value ? 'text-orange-500' : 'text-gray-500'
        }`}
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search films, directors, genres..."
        className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none min-w-0"
        spellCheck={false}
        autoComplete="off"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          className="flex-shrink-0 p-1 rounded-full text-gray-500 hover:text-white hover:bg-gray-700 transition-all duration-150"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
