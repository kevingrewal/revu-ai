import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import type { UseProductsParams } from '../hooks/useProducts';
import { ProductGrid } from '../components/products/ProductGrid';
import { Pagination } from '../components/ui/Pagination';
import { SortSelect, type SortOption } from '../components/ui/SortSelect';
import { Star } from 'lucide-react';

const SORT_OPTIONS: SortOption[] = [
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'rating_asc', label: 'Lowest Rated' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'newest', label: 'Newest' },
];

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = (searchParams.get('sort') || 'rating_desc') as NonNullable<UseProductsParams['sort']>;

  const { data, isLoading, error } = useProducts({ sort, limit: 20, page });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage), sort });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams({ page: '1', sort: newSort });
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Star className="h-10 w-10 text-white/80" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Discover the Best Products
          </h1>
          <p className="text-brand-100 text-lg max-w-2xl mx-auto">
            AI-powered sentiment analysis from thousands of reviews across the web
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Top Rated Products
            </h2>
            {data && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {data.total} products
              </p>
            )}
          </div>
          <SortSelect
            value={sort}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
            Error loading products. Please try again.
          </div>
        )}

        <ProductGrid
          products={data?.products || []}
          isLoading={isLoading}
        />

        <Pagination
          currentPage={page}
          totalPages={data?.pages ?? 1}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
