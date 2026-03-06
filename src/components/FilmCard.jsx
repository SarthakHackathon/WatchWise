import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Star, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useRatings } from '../context/RatingsContext';

export default function FilmCard({ film, onAuthRequired }) {
  const { isAuthenticated } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { getRating } = useRatings();
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const popcornRating = getRating(film.id);

  const inWatchlist = isInWatchlist(film.id);

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    if (inWatchlist) {
      removeFromWatchlist(film.id);
    } else {
      addToWatchlist(film);
    }
  };

  const ratingColor =
    film.rating >= 8
      ? 'bg-green-500/90'
      : film.rating >= 6.5
      ? 'bg-yellow-500/90'
      : 'bg-red-500/90';

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-gray-800 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 hover:-translate-y-1"
      onClick={() => navigate(`/film/${film.id}`)}
    >
      {/* Poster area */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {!imgError && film.poster ? (
          <img
            src={film.poster}
            alt={film.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 select-none">
            <span className="text-5xl mb-2">🎬</span>
            <span className="text-gray-400 text-xs text-center px-3 font-medium line-clamp-2">
              {film.title}
            </span>
          </div>
        )}

        {/* Rating badge */}
        {film.rating != null && (
          <div
            className={`absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md text-white text-xs font-bold ${ratingColor} shadow-md backdrop-blur-sm`}
          >
            <Star className="w-2.5 h-2.5 fill-current" />
            {Number(film.rating).toFixed(1)}
          </div>
        )}

        {/* Watchlist button — always visible on mobile, visible on hover for desktop */}
        <button
          onClick={handleWatchlistToggle}
          aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          className={`absolute top-2.5 left-2.5 p-1.5 rounded-lg backdrop-blur-sm transition-all duration-200 shadow-md
            md:opacity-0 md:group-hover:opacity-100
            ${
              inWatchlist
                ? 'bg-orange-500 text-white'
                : 'bg-gray-900/70 text-gray-300 hover:bg-orange-500 hover:text-white'
            }`}
        >
          <Bookmark
            className={`w-4 h-4 transition-all ${inWatchlist ? 'fill-current' : ''}`}
          />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-gray-950 via-gray-900/95 to-gray-900/80 p-4">
          {/* Synopsis */}
          {film.synopsis && (
            <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 mb-3">
              {film.synopsis}
            </p>
          )}

          {/* Streaming platforms */}
          {film.streaming?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {film.streaming.slice(0, 3).map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: s.color || '#374151' }}
                >
                  {s.platform}
                </a>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Link
              to={`/film/${film.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Details
            </Link>
            <button
              onClick={handleWatchlistToggle}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                inWatchlist
                  ? 'bg-orange-500/20 border-orange-500 text-orange-400 hover:bg-orange-500/30'
                  : 'bg-gray-700/60 border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-400'
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-current' : ''}`}
              />
              {inWatchlist ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3">
        {/* Genres */}
        {film.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {film.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-full bg-gray-700/80 text-gray-400 text-[10px] font-medium"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-white text-sm font-semibold leading-tight line-clamp-1 group-hover:text-orange-400 transition-colors">
          {film.title}
        </h3>
        <div className="flex items-center justify-between mt-0.5">
          {film.year && <p className="text-gray-500 text-xs">{film.year}</p>}
          {popcornRating > 0 && (
            <span className="text-xs text-gray-400 flex items-center gap-0.5">
              {'🍿'.repeat(popcornRating)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
