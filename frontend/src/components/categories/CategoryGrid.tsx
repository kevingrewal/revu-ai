import { motion } from 'framer-motion';
import type { Category } from '../../types/product';
import { CategoryCard } from './CategoryCard';
import { CategoryGridSkeleton } from './CategoryCardSkeleton';
import { FolderOpen } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
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

export const CategoryGrid = ({ categories, isLoading = false }: CategoryGridProps) => {
  if (isLoading) {
    return <CategoryGridSkeleton />;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <FolderOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-lg">No categories found</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {categories.map((category) => (
        <motion.div key={category.id} variants={itemVariants}>
          <CategoryCard category={category} />
        </motion.div>
      ))}
    </motion.div>
  );
};
