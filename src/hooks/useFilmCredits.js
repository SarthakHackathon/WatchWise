import { useState, useEffect } from 'react';

const IMG_BASE = 'https://image.tmdb.org/t/p/w185';

export function useFilmCredits(tmdbId) {
  const [cast, setCast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!tmdbId || !apiKey) return;

    setLoading(true);
    fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${apiKey}`)
      .then(r => r.json())
      .then(data => {
        if (data.cast) setCast(data.cast.slice(0, 12));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tmdbId]);

  return { cast, loading, imgBase: IMG_BASE };
}
