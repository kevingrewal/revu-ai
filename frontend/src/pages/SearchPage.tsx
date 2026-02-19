import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useSearchCategories } from '../hooks/useSearchCategories';
import type { UseProductsParams } from '../hooks/useProducts';
import { ProductGrid } from '../components/products/ProductGrid';
import { Pagination } from '../components/ui/Pagination';
import { SortSelect, type SortOption } from '../components/ui/SortSelect';
import { CategoryCard } from '../components/categories/CategoryCard';
import { ChevronRight } from 'lucide-react';

const SORT_OPTIONS: SortOption[] = [
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'rating_asc', label: 'Lowest Rated' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'newest', label: 'Newest' },
];

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = (searchParams.get('sort') || 'rating_desc') as NonNullable<UseProductsParams['sort']>;

  const { data, isLoading, error } = useProducts({
    search: query,
    sort,
    page,
    limit: 20,
  });

  const { data: matchingCategories } = useSearchCategories(query);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: String(newPage), sort });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams({ q: query, page: '1', sort: newSort });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-slate-100">Search</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {query ? (
              <>Results for &ldquo;{query}&rdquo;</>
            ) : (
              'Search'
            )}
          </h1>
          {data && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {data.total} {data.total === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>
        <SortSelect
          value={sort}
          onChange={handleSortChange}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Matching Categories */}
      {matchingCategories && matchingCategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Matching Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {matchingCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
          Error loading search results. Please try again.
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
  );
};
