export default function StreamingBadge({ platform, size = 'sm' }) {
  if (!platform) return null;

  const { platform: name, url, color } = platform;

  const baseClass =
    'inline-flex items-center font-semibold transition-all duration-150 hover:opacity-80 hover:scale-105 active:scale-95';

  const sizeClass =
    size === 'lg'
      ? 'px-4 py-2 rounded-xl text-sm gap-1.5'
      : 'px-2.5 py-1 rounded-lg text-[11px]';

  const style = {
    backgroundColor: color || '#374151',
    color: '#ffffff',
  };

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${sizeClass}`}
        style={style}
        aria-label={size === 'lg' ? `Watch on ${name}` : name}
      >
        {size === 'lg' && (
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {size === 'lg' ? `Watch on ${name}` : name}
      </a>
    );
  }

  return (
    <span
      className={`${baseClass} ${sizeClass} cursor-default`}
      style={style}
      aria-label={name}
    >
      {size === 'lg' ? `Watch on ${name}` : name}
    </span>
  );
}
