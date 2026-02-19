import { Skeleton } from '../ui/Skeleton';

export const CategoryCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-surface rounded-xl border border-surface-border dark:border-dark-border overflow-hidden">
    <div className="p-6 flex flex-col items-center space-y-3">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

export const CategoryGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <CategoryCardSkeleton key={i} />
    ))}
  </div>
);
