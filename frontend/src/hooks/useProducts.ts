import { useQuery } from '@tanstack/react-query';
import api from '../config/api';
import type { ProductListResponse } from '../types/product';

interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  sort?: 'rating_desc' | 'rating_asc' | 'price_asc' | 'price_desc' | 'newest';
}

export const useProducts = (params: UseProductsParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.category) queryParams.append('category', params.category);
      if (params.sort) queryParams.append('sort', params.sort);

      const response = await api.get<ProductListResponse>(
        `/products?${queryParams.toString()}`
      );
      return response.data;
    },
  });
};
