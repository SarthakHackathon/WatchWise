import { Link } from 'react-router-dom';
import { X, Bookmark, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';

export default function WatchlistSidebar({ isOpen, onClose }) {
  const { isAuthenticated } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 z-40 bg-gray-900 border-l border-gray-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-orange-500 fill-orange-500" />
            <h2 className="text-white font-semibold text-sm">My Watchlist</h2>
            {watchlist.length > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                {watchlist.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close watchlist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto py-2 min-h-0">
          {watchlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
              <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <Bookmark className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-300 text-sm font-medium">Nothing saved yet</p>
              <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                Tap the bookmark icon on any film or show to add it here
              </p>
            </div>
          ) : (
            <ul className="space-y-0.5 px-2">
              {watchlist.map((film) => (
                <li
                  key={film.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800 group transition-colors"
                >
                  <Link
                    to={`/film/${film.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    {film.poster ? (
                      <img
                        src={film.poster}
                        alt={film.title}
                        className="w-10 h-[60px] object-cover rounded flex-shrink-0 bg-gray-700"
                      />
                    ) : (
                      <div className="w-10 h-[60px] rounded flex-shrink-0 bg-gray-700 flex items-center justify-center">
                        <Bookmark className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate leading-snug">
                        {film.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {film.year && (
                          <span className="text-gray-500 text-xs">{film.year}</span>
                        )}
                        {film.year && film.rating && (
                          <span className="text-gray-700 text-xs">·</span>
                        )}
                        {film.rating && (
                          <span className="text-orange-400 text-xs">★ {film.rating}</span>
                        )}
                      </div>
                      {film.genres?.length > 0 && (
                        <p className="text-gray-600 text-xs mt-0.5 truncate">
                          {film.genres.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFromWatchlist(film.id)}
                    className="p-1.5 rounded text-gray-700 hover:text-red-400 hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    aria-label={`Remove ${film.title} from watchlist`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {watchlist.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-800 flex-shrink-0">
            <Link
              to="/watchlist"
              onClick={onClose}
              className="flex items-center justify-center w-full py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
            >
              View Full Watchlist
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
