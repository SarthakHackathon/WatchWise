import { Link } from 'react-router-dom';
import { Bookmark, LogIn, Film, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import FilmCard from '../components/FilmCard';

export default function Watchlist({ onAuthRequired }) {
  const { isAuthenticated, user } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-6">
          <Bookmark size={36} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in to view your Watchlist</h2>
        <p className="text-gray-400 max-w-sm mb-8">
          Keep track of all the films you want to watch. Sign in to save your personalised watchlist.
        </p>
        <button
          onClick={onAuthRequired}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          <LogIn size={18} />
          Sign In
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Or{' '}
          <Link to="/browse" className="text-orange-400 hover:text-orange-300 transition-colors">
            browse films
          </Link>{' '}
          without an account.
        </p>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-6">
          <Film size={36} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h2>
        <p className="text-gray-400 max-w-sm mb-8">
          Start adding films you want to watch. Browse our collection and hit the bookmark icon.
        </p>
        <Link
          to="/browse"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Browse Films
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Bookmark size={26} className="text-orange-500" />
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        </div>
        <p className="text-gray-400 ml-10">
          {user?.name}'s list &middot;{' '}
          <span className="text-white font-semibold">{watchlist.length}</span>{' '}
          film{watchlist.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {watchlist.map((film) => (
          <div key={film.id} className="relative group/item">
            <FilmCard film={film} onAuthRequired={onAuthRequired} />
            <button
              onClick={() => removeFromWatchlist(film.id)}
              title="Remove from watchlist"
              className="absolute top-2 left-2 z-20 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
