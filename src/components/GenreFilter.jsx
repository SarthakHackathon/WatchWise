export default function GenreFilter({ items = [], selected, onSelect, label }) {
  return (
    <div className="w-full">
      {label && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          {label}
        </p>
      )}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {items.map((item) => {
          const isSelected =
            typeof selected === 'string'
              ? selected === item
              : Array.isArray(selected)
              ? selected.includes(item)
              : false;

          return (
            <button
              key={item}
              onClick={() => onSelect(item)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 border
                ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white hover:border-gray-600'
                }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
