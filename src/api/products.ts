import { apiClient } from './client';

export type ApiProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

export async function fetchProducts(signal?: AbortSignal): Promise<ApiProduct[]> {
  const response = await apiClient.get<{ products?: ApiProduct[] }>('/products?limit=12', { signal });
  return response.data.products ?? [];
}
