import { Check, X } from 'lucide-react';

interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

export const ProConsList = ({ pros, cons }: ProsConsListProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Pros */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
          <Check className="h-5 w-5" />
          Pros
        </h3>
        {pros.length > 0 ? (
          <ul className="space-y-2">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2 text-emerald-800 dark:text-emerald-200">
                <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{pro}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-emerald-700 dark:text-emerald-300">No pros listed</p>
        )}
      </div>

      {/* Cons */}
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
          <X className="h-5 w-5" />
          Cons
        </h3>
        {cons.length > 0 ? (
          <ul className="space-y-2">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2 text-red-800 dark:text-red-200">
                <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{con}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-red-700 dark:text-red-300">No cons listed</p>
        )}
      </div>
    </div>
  );
};
