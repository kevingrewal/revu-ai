import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { ProductDetail } from '../components/products/ProductDetail';
import { ProductDetailSkeleton } from '../components/products/ProductDetailSkeleton';
import { ChevronRight } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link to="/" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        {product.category && (
          <>
            <Link
              to={`/categories/${product.category}`}
              className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors capitalize"
            >
              {product.category.replace('-', ' ')}
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
          </>
        )}
        <span className="text-slate-900 dark:text-slate-100 truncate">{product.name}</span>
      </div>

      <ProductDetail product={product} />
    </div>
  );
};
