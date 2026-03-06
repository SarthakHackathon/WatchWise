const IMG_BASE = 'https://image.tmdb.org/t/p';

function getApiKey() {
  return import.meta.env.VITE_TMDB_API_KEY;
}

async function tmdbFetch(endpoint, params = {}) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('TMDB API key not configured');

  const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

export function posterUrl(path, size = 'w500') {
  return path ? `${IMG_BASE}/${size}${path}` : null;
}

export function backdropUrl(path, size = 'w1280') {
  return path ? `${IMG_BASE}/${size}${path}` : null;
}

export async function fetchMovieGenres() {
  const data = await tmdbFetch('/genre/movie/list');
  return Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
}

export async function fetchTVGenres() {
  const data = await tmdbFetch('/genre/tv/list');
  return Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
}

export function normalizeMovie(movie, genreMap = {}) {
  return {
    id: `tmdb-movie-${movie.id}`,
    tmdb_id: movie.id,
    mediaType: 'movie',
    title: movie.title,
    year: movie.release_date ? parseInt(movie.release_date) : null,
    synopsis: movie.overview,
    rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : null,
    genres: (movie.genre_ids || []).map((id) => genreMap[id]).filter(Boolean),
    poster: posterUrl(movie.poster_path),
    backdrop: backdropUrl(movie.backdrop_path),
    runtime: null,
    streaming: [],
  };
}

export function normalizeTV(show, genreMap = {}) {
  return {
    id: `tmdb-tv-${show.id}`,
    tmdb_id: show.id,
    mediaType: 'tv',
    title: show.name,
    year: show.first_air_date ? parseInt(show.first_air_date) : null,
    synopsis: show.overview,
    rating: show.vote_average ? Math.round(show.vote_average * 10) / 10 : null,
    genres: (show.genre_ids || []).map((id) => genreMap[id]).filter(Boolean),
    poster: posterUrl(show.poster_path),
    backdrop: backdropUrl(show.backdrop_path),
    runtime: null,
    streaming: [],
  };
}

export async function fetchPopularMovies(page = 1) {
  return tmdbFetch('/movie/popular', { page });
}

export async function fetchPopularTV(page = 1) {
  return tmdbFetch('/tv/popular', { page });
}

export async function searchMulti(query, page = 1) {
  return tmdbFetch('/search/multi', { query, page });
}

export async function fetchMovieDetails(tmdbId) {
  return tmdbFetch(`/movie/${tmdbId}`, { append_to_response: 'credits,similar' });
}

export async function fetchTVDetails(tmdbId) {
  return tmdbFetch(`/tv/${tmdbId}`, { append_to_response: 'credits,similar' });
}
