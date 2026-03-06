import { useState, useEffect, useCallback } from 'react';
import {
  fetchPopularMovies,
  fetchPopularTV,
  searchMulti,
  fetchMovieGenres,
  fetchTVGenres,
  normalizeMovie,
  normalizeTV,
} from '../lib/tmdb';

export function useTMDB({ mediaType = 'all', query = '' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genreMaps, setGenreMaps] = useState(null);

  useEffect(() => {
    Promise.all([fetchMovieGenres(), fetchTVGenres()])
      .then(([mg, tg]) => setGenreMaps({ movie: mg, tv: tg }))
      .catch(console.error);
  }, []);

  // Reset when query or mediaType changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
  }, [query, mediaType]);

  useEffect(() => {
    if (!genreMaps) return;

    setLoading(true);

    let promise;

    if (query.trim()) {
      promise = searchMulti(query, page).then((data) => {
        const results = data.results
          .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
          .filter((item) => mediaType === 'all' || item.media_type === mediaType)
          .map((item) =>
            item.media_type === 'movie'
              ? normalizeMovie(item, genreMaps.movie)
              : normalizeTV(item, genreMaps.tv)
          );
        return { results, totalPages: data.total_pages };
      });
    } else if (mediaType === 'movie') {
      promise = fetchPopularMovies(page).then((data) => ({
        results: data.results.map((m) => normalizeMovie(m, genreMaps.movie)),
        totalPages: data.total_pages,
      }));
    } else if (mediaType === 'tv') {
      promise = fetchPopularTV(page).then((data) => ({
        results: data.results.map((s) => normalizeTV(s, genreMaps.tv)),
        totalPages: data.total_pages,
      }));
    } else {
      promise = Promise.all([fetchPopularMovies(page), fetchPopularTV(page)]).then(
        ([movies, tv]) => {
          const movieResults = movies.results.map((m) => normalizeMovie(m, genreMaps.movie));
          const tvResults = tv.results.map((s) => normalizeTV(s, genreMaps.tv));
          // Interleave movies and TV
          const results = [];
          const len = Math.max(movieResults.length, tvResults.length);
          for (let i = 0; i < len; i++) {
            if (movieResults[i]) results.push(movieResults[i]);
            if (tvResults[i]) results.push(tvResults[i]);
          }
          return { results, totalPages: Math.max(movies.total_pages, tv.total_pages) };
        }
      );
    }

    promise
      .then(({ results, totalPages: tp }) => {
        setItems((prev) => (page === 1 ? results : [...prev, ...results]));
        setTotalPages(tp);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [genreMaps, query, mediaType, page]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loading) setPage((p) => p + 1);
  }, [page, totalPages, loading]);

  return { items, loading, loadMore, hasMore: page < totalPages };
}
