import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Film, Tv, LayoutGrid } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import FilmCard from '../components/FilmCard';
import { useTMDB } from '../hooks/useTMDB';

const MEDIA_TABS = [
  { value: 'all', label: 'All', icon: LayoutGrid },
  { value: 'movie', label: 'Movies', icon: Film },
  { value: 'tv', label: 'TV Shows', icon: Tv },
];

const LANGUAGES = [
  { code: '', label: 'All' },
  { code: 'en', label: 'English' },
  { code: 'ko', label: 'Korean' },
  { code: 'ja', label: 'Japanese' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chinese' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ar', label: 'Arabic' },
];

export default function Browse({ onAuthRequired }) {
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get('genre') || 'All';

  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    setSelectedGenre(searchParams.get('genre') || 'All');
  }, [searchParams]);

  const { items, loading, loadMore, hasMore } = useTMDB({ mediaType, query, language: selectedLanguage });

  const filtered =
    selectedGenre === 'All' ? items : items.filter((f) => f.genres.includes(selectedGenre));

  const availableGenres = [
    'All',
    ...new Set(items.flatMap((f) => f.genres)),
  ].sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)));

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Browse</h1>
        <p className="text-gray-400">Discover popular movies and TV shows.</p>
      </div>

      {/* Media type tabs */}
      <div className="flex gap-2 mb-6">
        {MEDIA_TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => {
              setMediaType(value);
              setSelectedGenre('All');
              setSelectedLanguage('');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              mediaType === value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
          <SlidersHorizontal size={15} />
          <span>Filters</span>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Genre</p>
          <GenreFilter items={availableGenres} selected={selectedGenre} onSelect={setSelectedGenre} />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Language</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setSelectedLanguage(code)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedLanguage === code
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white font-semibold">{filtered.length}</span> result
          {filtered.length !== 1 ? 's' : ''}
          {selectedGenre !== 'All' && <span className="text-orange-400"> · {selectedGenre}</span>}
          {selectedLanguage && (
            <span className="text-orange-400">
              {' '}· {LANGUAGES.find((l) => l.code === selectedLanguage)?.label}
            </span>
          )}
          {query && <span className="text-orange-400"> · "{query}"</span>}
        </p>
        {(selectedGenre !== 'All' || selectedLanguage || query) && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedGenre('All');
              setSelectedLanguage('');
            }}
            className="text-xs text-gray-500 hover:text-orange-400 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((film) => (
              <FilmCard key={film.id} film={film} onAuthRequired={onAuthRequired} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-5xl mb-4">🎬</span>
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400 max-w-sm">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedGenre('All');
              setSelectedLanguage('');
            }}
            className="mt-6 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </main>
  );
}
