import { useQuery } from '@tanstack/react-query';
import api from '../config/api';
import type { ProductDetail } from '../types/product';

export const useProduct = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');
      const response = await api.get<ProductDetail>(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId,
  });
};
