import { motion } from 'framer-motion';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductCardSkeleton';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const ProductGrid = ({ products, isLoading = false }: ProductGridProps) => {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <PackageOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};
