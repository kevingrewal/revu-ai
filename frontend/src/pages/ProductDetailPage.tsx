import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { ProductDetail } from '../components/products/ProductDetail';
import { Spinner } from '../components/ui/Spinner';
import { ChevronRight } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        {product.category && (
          <>
            <Link
              to={`/categories/${product.category}`}
              className="hover:text-blue-600"
            >
              {product.category.replace('-', ' ')}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-gray-900">{product.name}</span>
      </div>

      <ProductDetail product={product} />
    </div>
  );
};
