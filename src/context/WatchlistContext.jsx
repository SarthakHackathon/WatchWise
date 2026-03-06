import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setWatchlist([]);
      return;
    }

    supabase
      .from('watchlist')
      .select('film_data')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setWatchlist(data ? data.map(r => r.film_data) : []);
      });
  }, [isAuthenticated, user]);

  const addToWatchlist = async (film) => {
    if (isInWatchlist(film.id)) return;
    setWatchlist(prev => [...prev, film]);
    await supabase.from('watchlist').insert({
      user_id: user.id,
      film_id: String(film.id),
      film_data: film,
    });
  };

  const removeFromWatchlist = async (filmId) => {
    setWatchlist(prev => prev.filter(f => f.id !== filmId));
    await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('film_id', String(filmId));
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
