import { useQuery } from '@tanstack/react-query';
import api from '../config/api';
import type { Category } from '../types/product';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    },
  });
};
