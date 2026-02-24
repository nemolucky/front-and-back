import axios from 'axios'
import { IProduct } from '../types/product.interface'

const apiProductClient = axios.create({
	baseURL: 'http://localhost:3000/api/products',
	headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
	},
})

export const apiProduct = {
	getProducts: async () => {
		const response = await apiProductClient.get('/')
		return response.data
	},
	deleteProduct: async (id: string) => {
		await apiProductClient.delete(`/${id}`)
		return true
	},
	createProduct: async (product: Omit<IProduct, 'id'>) => {
		const response = await apiProductClient.post('/', product)
		return response.data
	},
	updateProduct: async (id: string, product: Omit<IProduct, 'id'>) => {
		const response = await apiProductClient.patch(`/${id}`, product)
		return response.data
	},
}
