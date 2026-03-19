import { apiClient } from './http'
import type { Product, ProductInput } from '../types/product'

export const productsApi = {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products')
    return response.data
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  async create(payload: ProductInput): Promise<Product> {
    const response = await apiClient.post<Product>('/products', payload)
    return response.data
  },

  async update(id: string, payload: Partial<ProductInput>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, payload)
    return response.data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`)
  },
}
