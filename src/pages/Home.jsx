import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { films, genres } from '../data/films';
import HeroSection from '../components/HeroSection';
import FilmCard from '../components/FilmCard';

const GENRE_ICONS = {
  Action: '💥', 'Sci-Fi': '🚀', Thriller: '🔪', Drama: '🎭',
  Comedy: '😂', Horror: '👻', Crime: '🔫', Romance: '❤️',
  Adventure: '🗺️', Music: '🎵', History: '📜', Mystery: '🔍',
};

function SectionHeader({ title, icon, linkTo, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
        >
          {linkLabel} <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

function HorizontalRow({ films, onAuthRequired }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/90 hover:bg-gray-800 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 shadow-lg"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {films.map((film) => (
          <div key={film.id} className="flex-shrink-0 w-36 sm:w-44">
            <FilmCard film={film} onAuthRequired={onAuthRequired} />
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/90 hover:bg-gray-800 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2 shadow-lg"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default function Home({ onAuthRequired }) {
  const featuredFilm = films[1]; // The Dark Knight
  const trending = films.slice(0, 10);
  const topRated = [...films].sort((a, b) => b.rating - a.rating).slice(0, 10);
  const displayGenres = genres.filter((g) => g !== 'All').slice(0, 10);

  return (
    <main>
      <HeroSection film={featuredFilm} onAuthRequired={onAuthRequired} />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Trending Now */}
        <section>
          <SectionHeader
            title="Trending Now"
            icon={<TrendingUp size={22} className="text-orange-500" />}
            linkTo="/browse"
            linkLabel="See all"
          />
          <HorizontalRow films={trending} onAuthRequired={onAuthRequired} />
        </section>

        {/* Top Rated */}
        <section>
          <SectionHeader
            title="Top Rated"
            icon={<Star size={22} className="text-yellow-400" />}
            linkTo="/browse?sort=top_rated"
            linkLabel="See all"
          />
          <HorizontalRow films={topRated} onAuthRequired={onAuthRequired} />
        </section>

        {/* Browse by Genre */}
        <section>
          <SectionHeader
            title="Browse by Genre"
            icon={<span className="text-xl">🎬</span>}
            linkTo="/browse"
            linkLabel="All genres"
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {displayGenres.map((genre) => (
              <Link
                key={genre}
                to={`/browse?genre=${genre}`}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500 transition-all group"
              >
                <span className="text-2xl">{GENRE_ICONS[genre] || '🎞️'}</span>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white">{genre}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* AI Picks CTA */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-900/40 via-gray-900 to-orange-900/20 border border-orange-800/30 p-8 md:p-12">
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} className="text-orange-400" />
                <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">Powered by AI</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Get Your Personalised<br />
                <span className="text-orange-400">Film Picks</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Tell us your favourite genres and moods. Our AI will curate a bespoke watchlist just for you.
              </p>
              <Link
                to="/ai-picks"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                <Sparkles size={16} />
                Get My AI Picks
              </Link>
            </div>
            {/* Decorative circles */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute right-16 bottom-0 w-40 h-40 bg-orange-400/5 rounded-full translate-y-1/2" />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 pt-8 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">Watch<span className="text-orange-500">Wise</span></span>
              <span className="text-gray-500 text-sm">— Find your next favourite film</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link to="/browse" className="hover:text-gray-300 transition-colors">Browse</Link>
              <Link to="/ai-picks" className="hover:text-gray-300 transition-colors">AI Picks</Link>
              <Link to="/watchlist" className="hover:text-gray-300 transition-colors">Watchlist</Link>
            </div>
            <p className="text-gray-600 text-xs">© 2026 WatchWise. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
