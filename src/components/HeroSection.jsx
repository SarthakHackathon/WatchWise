import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Clock, Info } from 'lucide-react';
import StreamingBadge from './StreamingBadge';

export default function HeroSection({ film }) {
  const [imgError, setImgError] = useState(false);

  if (!film) return null;

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-950">
      {/* Backdrop image */}
      {!imgError && film.backdrop ? (
        <img
          src={film.backdrop}
          alt={film.title}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-14 md:pb-20">
        <div className="max-w-2xl">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {film.rating != null && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-sm font-bold">
                  {Number(film.rating).toFixed(1)}
                </span>
                <span className="text-yellow-500/60 text-xs">IMDb</span>
              </div>
            )}
            {film.year && (
              <span className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock className="w-3.5 h-3.5" />
                {film.year}
              </span>
            )}
            {film.genres?.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800/70 text-gray-300 border border-gray-700/50 backdrop-blur-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-2xl">
            {film.title}
          </h1>

          {/* Synopsis */}
          {film.synopsis && (
            <p className="text-gray-300 text-base md:text-lg leading-relaxed line-clamp-2 mb-6 max-w-xl">
              {film.synopsis}
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {film.imdb_url ? (
              <a
                href={film.imdb_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Now
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500/50 text-white/60 font-semibold text-sm cursor-not-allowed"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Now
              </button>
            )}

            <Link
              to={`/film/${film.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-500 hover:border-white bg-gray-900/40 hover:bg-gray-800/60 backdrop-blur-sm text-gray-200 hover:text-white font-semibold text-sm transition-all duration-200"
            >
              <Info className="w-4 h-4" />
              More Details
            </Link>
          </div>

          {/* Streaming badges */}
          {film.streaming?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 font-medium mr-1">Stream on</span>
              {film.streaming.map((platform, i) => (
                <StreamingBadge key={i} platform={platform} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none" />
    </section>
  );
}
