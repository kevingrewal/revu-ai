import { ArrowUpDown } from 'lucide-react';

export interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
}

export const SortSelect = ({ value, onChange, options }: SortSelectProps) => {
  return (
    <div className="relative inline-flex items-center">
      <ArrowUpDown className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-9 pr-8 py-2 text-sm font-medium rounded-lg bg-white dark:bg-dark-surface border border-surface-border dark:border-dark-border text-slate-700 dark:text-slate-200 hover:border-brand-400 dark:hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-dark transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="absolute right-2.5 pointer-events-none text-slate-400 dark:text-slate-500 text-xs">
        ▾
      </span>
    </div>
  );
};
