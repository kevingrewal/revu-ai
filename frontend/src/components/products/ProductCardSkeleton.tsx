import { Skeleton } from '../ui/Skeleton';

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-surface rounded-xl border border-surface-border dark:border-dark-border overflow-hidden">
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
