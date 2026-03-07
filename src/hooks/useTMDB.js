import { useState, useEffect, useCallback } from 'react';
import {
  fetchPopularMovies,
  fetchPopularTV,
  fetchTopRatedMovies,
  fetchTopRatedTV,
  fetchTrendingMovies,
  fetchTrendingTV,
  discoverMovies,
  discoverTV,
  searchMulti,
  fetchMovieGenres,
  fetchTVGenres,
  normalizeMovie,
  normalizeTV,
} from '../lib/tmdb';

export function useTMDB({ mediaType = 'all', query = '', language = '', sort = 'popular' }) {
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

  // Reset when filters change
  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotalPages(1);
  }, [query, mediaType, language, sort]);

  useEffect(() => {
    if (!genreMaps) return;

    setLoading(true);

    const lang = language || null;

    let promise;

    if (query.trim()) {
      // Search: fetch then filter by language client-side
      promise = searchMulti(query, page).then((data) => {
        const results = data.results
          .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
          .filter((item) => mediaType === 'all' || item.media_type === mediaType)
          .filter((item) => !lang || item.original_language === lang)
          .map((item) =>
            item.media_type === 'movie'
              ? normalizeMovie(item, genreMaps.movie)
              : normalizeTV(item, genreMaps.tv)
          );
        return { results, totalPages: data.total_pages };
      });
    } else if (mediaType === 'movie') {
      const fetch = sort === 'top_rated' ? fetchTopRatedMovies : sort === 'trending' ? fetchTrendingMovies : lang ? discoverMovies : fetchPopularMovies;
      promise = fetch(page, lang).then((data) => ({
        results: data.results.map((m) => normalizeMovie(m, genreMaps.movie)),
        totalPages: data.total_pages,
      }));
    } else if (mediaType === 'tv') {
      const fetch = sort === 'top_rated' ? fetchTopRatedTV : sort === 'trending' ? fetchTrendingTV : lang ? discoverTV : fetchPopularTV;
      promise = fetch(page, lang).then((data) => ({
        results: data.results.map((s) => normalizeTV(s, genreMaps.tv)),
        totalPages: data.total_pages,
      }));
    } else {
      // 'all' — fetch both
      const fetchM = sort === 'top_rated' ? fetchTopRatedMovies : sort === 'trending' ? fetchTrendingMovies : lang ? discoverMovies : fetchPopularMovies;
      const fetchT = sort === 'top_rated' ? fetchTopRatedTV : sort === 'trending' ? fetchTrendingTV : lang ? discoverTV : fetchPopularTV;
      promise = Promise.all([fetchM(page, lang), fetchT(page, lang)]).then(([movies, tv]) => {
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
      });
    }

    promise
      .then(({ results, totalPages: tp }) => {
        setItems((prev) => (page === 1 ? results : [...prev, ...results]));
        setTotalPages(tp);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [genreMaps, query, mediaType, language, sort, page]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loading) setPage((p) => p + 1);
  }, [page, totalPages, loading]);

  return { items, loading, loadMore, hasMore: page < totalPages };
}
