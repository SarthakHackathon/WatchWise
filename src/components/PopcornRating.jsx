import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRatings } from '../context/RatingsContext';

export default function PopcornRating({ filmId, onAuthRequired, size = 'md' }) {
  const { isAuthenticated } = useAuth();
  const { getRating, rateFilm } = useRatings();
  const [hover, setHover] = useState(0);

  const current = getRating(filmId);
  const display = hover || current;

  const sizeClass = size === 'sm' ? 'text-lg' : 'text-2xl';

  const handleClick = (rating) => {
    if (!isAuthenticated) { onAuthRequired?.(); return; }
    rateFilm(filmId, rating);
  };

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${i} out of 5`}
          className={`${sizeClass} transition-all duration-100 hover:scale-125 active:scale-95`}
          style={{
            filter: i <= display ? 'none' : 'grayscale(1) brightness(0.5)',
          }}
        >
          🍿
        </button>
      ))}
      {current > 0 && (
        <span className="text-xs text-gray-400 ml-1">{current}/5</span>
      )}
    </div>
  );
}
