import { useState } from 'react';
import { Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { genres, moods, getAIPicks } from '../data/films';
import FilmCard from '../components/FilmCard';

const displayGenres = genres.filter((g) => g !== 'All');
const displayMoods = moods.filter((m) => m !== 'All');

function getReason(film, selGenres, selMoods) {
  const matchGenres = film.genres.filter((g) => selGenres.includes(g));
  const matchMoods = film.mood.filter((m) => selMoods.includes(m));
  const parts = [];
  if (matchGenres.length > 0) parts.push(`matches your interest in ${matchGenres.join(' & ')}`);
  if (matchMoods.length > 0) parts.push(`delivers the ${matchMoods.join(' & ')} feeling you're looking for`);
  if (parts.length === 0) return 'A highly acclaimed film we think you\'ll love.';
  return `Recommended because it ${parts.join(' and ')}.`;
}

function TogglePill({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
        selected
          ? 'bg-orange-500 border-orange-500 text-white'
          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-orange-500 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

export default function AIPicks({ onAuthRequired }) {
  const [selGenres, setSelGenres] = useState([]);
  const [selMoods, setSelMoods] = useState([]);
  const [picks, setPicks] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = (arr, setArr, val) =>
    setArr((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));

  const handleGenerate = () => {
    setLoading(true);
    // Simulate AI "thinking"
    setTimeout(() => {
      setPicks(getAIPicks(selGenres, selMoods));
      setHasGenerated(true);
      setLoading(false);
    }, 900);
  };

  const handleReset = () => {
    setSelGenres([]);
    setSelMoods([]);
    setPicks([]);
    setHasGenerated(false);
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-5">
          <Sparkles size={14} />
          Powered by WatchWise AI
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Your Personalised{' '}
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Film Picks
          </span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-lg">
          Tell us what you're in the mood for. Our AI will curate the perfect films just for you.
        </p>
      </div>

      {/* Preferences */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
              <span>🎬</span> What genres do you enjoy?
            </h2>
            <p className="text-gray-500 text-sm mb-4">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {displayGenres.map((g) => (
                <TogglePill
                  key={g}
                  label={g}
                  selected={selGenres.includes(g)}
                  onClick={() => toggle(selGenres, setSelGenres, g)}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 mb-6">
            <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
              <span>✨</span> What's your mood?
            </h2>
            <p className="text-gray-500 text-sm mb-4">How do you want to feel after watching?</p>
            <div className="flex flex-wrap gap-2">
              {displayMoods.map((m) => (
                <TogglePill
                  key={m}
                  label={m}
                  selected={selMoods.includes(m)}
                  onClick={() => toggle(selMoods, setSelMoods, m)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Analysing your taste...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  {hasGenerated ? 'Regenerate Picks' : 'Get My AI Picks'}
                </>
              )}
            </button>
            {hasGenerated && (
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-full border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white text-sm font-medium transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* No selections hint */}
        {!hasGenerated && !loading && (
          <p className="text-center text-gray-600 text-sm">
            No selections? No problem — we'll show you our top all-time picks.
          </p>
        )}
      </div>

      {/* Results */}
      {hasGenerated && !loading && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={22} className="text-orange-500" />
            <h2 className="text-2xl font-bold text-white">
              {picks.length > 0 ? `${picks.length} films picked for you` : 'No matches found'}
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-8">
            {selGenres.length > 0 || selMoods.length > 0
              ? `Based on your interest in: ${[...selGenres, ...selMoods].join(', ')}`
              : 'Our all-time staff picks'}
          </p>

          {picks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-4">No films matched your exact preferences.</p>
              <button
                onClick={handleReset}
                className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
              >
                Try different selections
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {picks.map((film, i) => (
                <div
                  key={film.id}
                  className="flex flex-col sm:flex-row gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-orange-800/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-full sm:w-28">
                    <div className="sm:hidden">
                      <FilmCard film={film} onAuthRequired={onAuthRequired} />
                    </div>
                    <div className="hidden sm:block">
                      <FilmCard film={film} onAuthRequired={onAuthRequired} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 sm:py-2">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{film.title}</h3>
                        <p className="text-gray-500 text-sm">{film.year} · {film.director}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{film.synopsis}</p>
                    <div className="flex items-start gap-2 bg-orange-500/5 border border-orange-800/20 rounded-lg px-3 py-2">
                      <Sparkles size={13} className="text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-orange-300/80 text-xs leading-relaxed">
                        <span className="font-semibold text-orange-400">AI reasoning: </span>
                        {getReason(film, selGenres, selMoods)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
