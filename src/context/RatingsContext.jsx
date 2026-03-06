import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const RatingsContext = createContext(null);

export function RatingsProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setRatings({});
      return;
    }
    supabase
      .from('ratings')
      .select('film_id, popcorn_rating')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) {
          const map = {};
          data.forEach(r => { map[r.film_id] = r.popcorn_rating; });
          setRatings(map);
        }
      });
  }, [isAuthenticated, user]);

  const rateFilm = async (filmId, rating) => {
    if (!user) return;
    setRatings(prev => ({ ...prev, [filmId]: rating }));
    await supabase.from('ratings').upsert(
      { user_id: user.id, film_id: filmId, popcorn_rating: rating },
      { onConflict: 'user_id,film_id' }
    );
  };

  const getRating = (filmId) => ratings[filmId] || 0;

  return (
    <RatingsContext.Provider value={{ rateFilm, getRating, ratings }}>
      {children}
    </RatingsContext.Provider>
  );
}

export const useRatings = () => {
  const ctx = useContext(RatingsContext);
  if (!ctx) throw new Error('useRatings must be used within RatingsProvider');
  return ctx;
};
