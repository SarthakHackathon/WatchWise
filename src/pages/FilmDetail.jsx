import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Clock, Calendar, Bookmark, BookmarkCheck,
  ExternalLink, Play, Users, Tv,
} from 'lucide-react';
import { getFilmById, films } from '../data/films';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useFilmCredits } from '../hooks/useFilmCredits';
import { useTMDBDetail } from '../hooks/useTMDBDetail';
import FilmCard from '../components/FilmCard';
import PopcornRating from '../components/PopcornRating';

function StreamingButton({ platform }) {
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 hover:scale-105 active:scale-95"
      style={{ backgroundColor: platform.color }}
    >
      <Play size={16} fill="currentColor" />
      Watch on {platform.platform}
    </a>
  );
}

export default function FilmDetail({ onAuthRequired }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const staticFilm = getFilmById(id);
  const { cast: staticTmdbCast, imgBase } = useFilmCredits(staticFilm?.tmdb_id);
  const { film: tmdbFilm, cast: tmdbCast, similar: tmdbSimilar, loading: tmdbLoading, isTMDB } = useTMDBDetail(id);

  const film = isTMDB ? tmdbFilm : staticFilm;
  const cast = isTMDB ? tmdbCast : staticTmdbCast;
  const similar = isTMDB
    ? tmdbSimilar
    : films.filter((f) => f.id !== id && f.genres.some((g) => film?.genres.includes(g))).slice(0, 5);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isTMDB && tmdbLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-6xl mb-4">🎬</span>
        <h2 className="text-2xl font-bold text-white mb-2">Film not found</h2>
        <p className="text-gray-400 mb-6">We couldn't find this film in our database.</p>
        <Link to="/browse" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-colors">
          Browse Films
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(film.id);
  const hours = film.runtime ? Math.floor(film.runtime / 60) : null;
  const mins = film.runtime ? film.runtime % 60 : null;

  const handleWatchlist = () => {
    if (!isAuthenticated) { onAuthRequired(); return; }
    inWatchlist ? removeFromWatchlist(film.id) : addToWatchlist(film);
  };

  return (
    <main>
      {/* Backdrop */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={film.backdrop}
          alt={film.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-48 md:w-56 mx-auto md:mx-0">
              <img
                src={film.poster}
                alt={film.title}
                className="w-full rounded-2xl shadow-2xl border border-gray-700"
                onError={(e) => {
                  e.target.src = `https://placehold.co/300x450/111827/f97316?text=${encodeURIComponent(film.title)}`;
                }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">{film.title}</h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                <Star size={14} fill="currentColor" />
                {film.rating}/10
                <span className="text-yellow-500/60 font-normal text-xs">IMDb</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar size={14} />
                {film.year}
              </div>
              {film.mediaType === 'tv' && film.seasons && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Tv size={14} />
                  {film.seasons} season{film.seasons !== 1 ? 's' : ''}
                  {film.episodes ? ` · ${film.episodes} episodes` : ''}
                </div>
              )}
              {film.runtime && film.mediaType !== 'tv' && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Clock size={14} />
                  {hours}h {mins}m
                </div>
              )}
              {film.runtime && film.mediaType === 'tv' && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Clock size={14} />
                  ~{film.runtime}m / episode
                </div>
              )}
            </div>

            {/* Genres + Popcorn Rating */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {film.genres.map((g) => (
                <Link
                  key={g}
                  to={`/browse?genre=${g}`}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-xs font-medium transition-colors border border-gray-700"
                >
                  {g}
                </Link>
              ))}
              <div className="flex items-center gap-2 ml-1 border-l border-gray-700 pl-3">
                <span className="text-xs text-gray-500">Your rating:</span>
                <PopcornRating filmId={film.id} onAuthRequired={onAuthRequired} />
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl text-base">
              {film.synopsis}
            </p>

            {/* Director / Creator */}
            {film.director && (
              <p className="text-gray-400 text-sm mb-6">
                <span className="text-gray-500">
                  {film.mediaType === 'tv' ? 'Created by ' : 'Directed by '}
                </span>
                <span className="text-white font-medium">{film.director}</span>
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={handleWatchlist}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 ${
                  inWatchlist
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                }`}
              >
                {inWatchlist ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
              {film.imdb_url && (
                <a
                  href={film.imdb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-yellow-500 hover:bg-yellow-400 text-black transition-all hover:scale-105 active:scale-95"
                >
                  <ExternalLink size={16} />
                  View on IMDb
                </a>
              )}
            </div>

            {/* Streaming */}
            {film.streaming?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">
                  Where to Watch
                </h3>
                <div className="flex flex-wrap gap-3">
                  {film.streaming.map((s) => (
                    <StreamingButton key={s.platform} platform={s} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Cast */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-5">
            <Users size={20} className="text-orange-500" />
            <h2 className="text-xl font-bold text-white">Cast</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(cast || film.cast || []).map((member) => {
              const name = member.name;
              const role = member.character || member.role;
              const photo = member.profile_path ? `${imgBase}${member.profile_path}` : null;
              const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
              return (
                <div key={name} className="bg-gray-800/60 rounded-xl p-4 border border-gray-700 flex flex-col items-center">
                  {photo ? (
                    <img
                      src={photo}
                      alt={name}
                      className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-gray-600"
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 items-center justify-center text-white font-bold text-xl mb-3"
                    style={{ display: photo ? 'none' : 'flex' }}
                  >
                    {initials}
                  </div>
                  <p className="text-white text-sm font-semibold text-center leading-tight">{name}</p>
                  <p className="text-gray-400 text-xs text-center mt-1 leading-tight">{role}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Similar */}
        {similar?.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold text-white mb-5">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similar.map((f) => (
                <FilmCard key={f.id} film={f} onAuthRequired={onAuthRequired} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
