import axios from 'axios'
import { IProduct } from '../types/product.interface'

const apiClient = axios.create({
	baseURL: 'http://localhost:3000/api',
	headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
	},
})

export const apiProduct = {
	getProducts: async () => {
		const response = await apiClient.get('/products')
		return response.data
	},
	deleteProduct: async (id: string) => {
		await apiClient.delete(`/products/${id}`)
		return true
	},
	createProduct: async (product: Omit<IProduct, 'id'>) => {
		const response = await apiClient.post('/products', product)
		return response.data
	},
	updateProduct: async (id: string, product: Omit<IProduct, 'id'>) => {
		const response = await apiClient.patch(`/products/${id}`, product)
		return response.data
	},
}
