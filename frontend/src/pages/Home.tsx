import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/products/ProductGrid';
import { Star } from 'lucide-react';

export const Home = () => {
  const { data, isLoading, error } = useProducts({ sort: 'rating_desc', limit: 20 });

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
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
          Top Rated Products
        </h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
            Error loading products. Please try again.
          </div>
        )}

        <ProductGrid
          products={data?.products || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
