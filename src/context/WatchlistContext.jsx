import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const key = `watchwise_watchlist_${user.email}`;
      const stored = localStorage.getItem(key);
      setWatchlist(stored ? JSON.parse(stored) : []);
    } else {
      setWatchlist([]);
    }
  }, [isAuthenticated, user]);

  const save = (newList) => {
    if (user) {
      const key = `watchwise_watchlist_${user.email}`;
      localStorage.setItem(key, JSON.stringify(newList));
    }
    setWatchlist(newList);
  };

  const addToWatchlist = (film) => {
    if (!isInWatchlist(film.id)) {
      save([...watchlist, film]);
    }
  };

  const removeFromWatchlist = (filmId) => {
    save(watchlist.filter(f => f.id !== filmId));
  };

  const isInWatchlist = (filmId) => watchlist.some(f => f.id === filmId);

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
};
