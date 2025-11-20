// components/SkillFilters.tsx
'use client';

interface SkillFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function SkillFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: SkillFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border border-slate-800 rounded-lg bg-slate-900/60 px-3 py-2">
      <span className="text-xs uppercase tracking-wide text-slate-400">
        Filter by category
      </span>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                isActive
                  ? 'border-sky-500 bg-sky-500/10 text-sky-200'
                  : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
