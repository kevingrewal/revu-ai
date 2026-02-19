import { useQuery } from '@tanstack/react-query';
import api from '../config/api';
import type { Category } from '../types/product';

export const useSearchCategories = (query: string) => {
  return useQuery({
    queryKey: ['categories', 'search', query],
    queryFn: async () => {
      const response = await api.get<Category[]>(
        `/categories/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    },
    enabled: query.trim().length > 0,
  });
};
