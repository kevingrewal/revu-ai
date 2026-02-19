import { Skeleton } from '../ui/Skeleton';

export const ReviewCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-surface rounded-xl border border-surface-border dark:border-dark-border p-4 space-y-3">
    <div className="flex justify-between">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);
