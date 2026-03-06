import { useState, useEffect } from 'react';
import { fetchMovieDetails, fetchTVDetails, posterUrl, backdropUrl } from '../lib/tmdb';

export function useTMDBDetail(routeId) {
  const [film, setFilm] = useState(null);
  const [cast, setCast] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const movieMatch = routeId?.match(/^tmdb-movie-(\d+)$/);
  const tvMatch = routeId?.match(/^tmdb-tv-(\d+)$/);
  const isTMDB = !!(movieMatch || tvMatch);

  useEffect(() => {
    if (!isTMDB) return;

    const tmdbId = movieMatch ? movieMatch[1] : tvMatch[1];
    const isMovie = !!movieMatch;

    setLoading(true);
    setFilm(null);
    setCast(null);
    setSimilar([]);
    setError(null);

    const fetchFn = isMovie ? fetchMovieDetails : fetchTVDetails;

    fetchFn(tmdbId)
      .then((data) => {
        const genres = data.genres?.map((g) => g.name) || [];

        let director = null;
        if (isMovie && data.credits?.crew) {
          const d = data.credits.crew.find((c) => c.job === 'Director');
          if (d) director = d.name;
        } else if (!isMovie && data.created_by?.length > 0) {
          director = data.created_by.map((c) => c.name).join(', ');
        }

        const normalized = {
          id: routeId,
          tmdb_id: data.id,
          mediaType: isMovie ? 'movie' : 'tv',
          title: isMovie ? data.title : data.name,
          year: isMovie
            ? data.release_date ? parseInt(data.release_date) : null
            : data.first_air_date ? parseInt(data.first_air_date) : null,
          synopsis: data.overview,
          rating: data.vote_average ? Math.round(data.vote_average * 10) / 10 : null,
          genres,
          poster: posterUrl(data.poster_path),
          backdrop: backdropUrl(data.backdrop_path),
          runtime: isMovie ? data.runtime : data.episode_run_time?.[0] || null,
          director,
          imdb_url: data.imdb_id ? `https://www.imdb.com/title/${data.imdb_id}/` : null,
          streaming: [],
          seasons: !isMovie ? data.number_of_seasons : null,
          episodes: !isMovie ? data.number_of_episodes : null,
        };

        setFilm(normalized);

        if (data.credits?.cast) {
          setCast(data.credits.cast.slice(0, 12));
        }

        if (data.similar?.results?.length > 0) {
          const IMG = 'https://image.tmdb.org/t/p';
          setSimilar(
            data.similar.results.slice(0, 5).map((item) => ({
              id: isMovie ? `tmdb-movie-${item.id}` : `tmdb-tv-${item.id}`,
              tmdb_id: item.id,
              mediaType: isMovie ? 'movie' : 'tv',
              title: isMovie ? item.title : item.name,
              year: isMovie
                ? item.release_date ? parseInt(item.release_date) : null
                : item.first_air_date ? parseInt(item.first_air_date) : null,
              rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
              genres,
              synopsis: item.overview,
              poster: item.poster_path ? `${IMG}/w500${item.poster_path}` : null,
              backdrop: item.backdrop_path ? `${IMG}/w1280${item.backdrop_path}` : null,
              streaming: [],
            }))
          );
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [routeId]);

  return { film, cast, similar, loading, error, isTMDB };
}
