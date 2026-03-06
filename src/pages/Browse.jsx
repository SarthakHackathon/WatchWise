import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { films, genres, moods, searchFilms, filterByGenre, filterByMood } from '../data/films';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import FilmCard from '../components/FilmCard';

export default function Browse({ onAuthRequired }) {
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get('genre') || 'All';

  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedMood, setSelectedMood] = useState('All');

  useEffect(() => {
    setSelectedGenre(searchParams.get('genre') || 'All');
  }, [searchParams]);

  const filtered = (() => {
    let result = query.trim() ? searchFilms(query) : films;
    if (selectedGenre !== 'All') result = result.filter((f) => f.genres.includes(selectedGenre));
    if (selectedMood !== 'All') result = result.filter((f) => f.mood.includes(selectedMood));
    return result;
  })();

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Browse Films</h1>
        <p className="text-gray-400">Discover your next favourite film from our curated collection.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
          <SlidersHorizontal size={15} />
          <span>Filters</span>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Genre</p>
          <GenreFilter items={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Mood</p>
          <GenreFilter items={moods} selected={selectedMood} onSelect={setSelectedMood} />
        </div>
      </div>

      {/* Results count */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white font-semibold">{filtered.length}</span> film{filtered.length !== 1 ? 's' : ''}
          {selectedGenre !== 'All' && <span className="text-orange-400"> · {selectedGenre}</span>}
          {selectedMood !== 'All' && <span className="text-orange-400"> · {selectedMood}</span>}
          {query && <span className="text-orange-400"> · "{query}"</span>}
        </p>
        {(selectedGenre !== 'All' || selectedMood !== 'All' || query) && (
          <button
            onClick={() => { setQuery(''); setSelectedGenre('All'); setSelectedMood('All'); }}
            className="text-xs text-gray-500 hover:text-orange-400 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Film Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((film) => (
            <FilmCard key={film.id} film={film} onAuthRequired={onAuthRequired} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-5xl mb-4">🎬</span>
          <h3 className="text-xl font-semibold text-white mb-2">No films found</h3>
          <p className="text-gray-400 max-w-sm">
            Try adjusting your search or filters to find something you'd like to watch.
          </p>
          <button
            onClick={() => { setQuery(''); setSelectedGenre('All'); setSelectedMood('All'); }}
            className="mt-6 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </main>
  );
}
