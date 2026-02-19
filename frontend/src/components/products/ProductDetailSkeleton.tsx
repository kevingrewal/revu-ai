import { Skeleton } from '../ui/Skeleton';

export const ProductDetailSkeleton = () => (
  <div className="space-y-8">
    {/* Hero Section */}
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-surface-border dark:border-dark-border overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <Skeleton className="h-9 w-3/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>

    {/* Pros & Cons */}
    <div>
      <Skeleton className="h-7 w-36 mb-4" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>

    {/* Reviews */}
    <div>
      <Skeleton className="h-7 w-48 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-dark-surface rounded-xl border border-surface-border dark:border-dark-border p-4 space-y-3"
          >
            <div className="flex justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
