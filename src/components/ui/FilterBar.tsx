interface FilterBarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { value: 'unlockedAt', label: 'Recent' },
  { value: 'name', label: 'Name' },
  { value: 'encounters', label: 'Encounters' },
];

export function FilterBar({ sortBy, onSortChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto no-select">
      <span className="text-xs text-zhu-muted mr-1 shrink-0">Sort:</span>
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSortChange(opt.value)}
          className={`tap-target px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            sortBy === opt.value
              ? 'bg-zhu-accent text-white'
              : 'bg-gray-100 text-zhu-muted active:bg-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}