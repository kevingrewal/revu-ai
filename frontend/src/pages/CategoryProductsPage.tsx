import { useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import type { UseProductsParams } from '../hooks/useProducts';
import { ProductGrid } from '../components/products/ProductGrid';
import { Pagination } from '../components/ui/Pagination';
import { SortSelect, type SortOption } from '../components/ui/SortSelect';
import { ChevronRight } from 'lucide-react';

const SORT_OPTIONS: SortOption[] = [
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'rating_asc', label: 'Lowest Rated' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'newest', label: 'Newest' },
];

export const CategoryProductsPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = (searchParams.get('sort') || 'rating_desc') as NonNullable<UseProductsParams['sort']>;

  const { data, isLoading, error } = useProducts({
    category: slug,
    sort,
    page,
    limit: 20,
  });

  // Reset to page 1 when navigating to a different category
  const prevSlugRef = useRef(slug);
  useEffect(() => {
    if (prevSlugRef.current !== slug) {
      setSearchParams({ page: '1', sort: 'rating_desc' }, { replace: true });
      prevSlugRef.current = slug;
    }
  }, [slug, setSearchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage), sort });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams({ page: '1', sort: newSort });
  };

  const categoryName = slug?.replace(/-/g, ' ') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        <Link to="/categories" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-slate-100 capitalize">{categoryName}</span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 capitalize">
            {categoryName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {data?.total ?? 0} products found
          </p>
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
  );
};
