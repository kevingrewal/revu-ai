import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/products/ProductGrid';

export const Home = () => {
  const { data, isLoading, error } = useProducts({ sort: 'rating_desc', limit: 20 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Top Rated Products
        </h1>
        <p className="text-gray-600">
          Discover the best products based on AI-driven sentiment analysis
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading products. Please try again.
        </div>
      )}

      <ProductGrid
        products={data?.products || []}
        isLoading={isLoading}
      />
    </div>
  );
};
