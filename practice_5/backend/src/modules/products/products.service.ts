import { nanoid } from 'nanoid'
import { IProduct, PRODUCTS } from './types/products.types.js'

export class ProductsService {
	constructor(private products: IProduct[] = PRODUCTS) {}

	allProducts() {
		return this.products
	}

	productById(id: string) {
		return this.products.find(product => product.id === id)
	}

	addProduct(product: Omit<IProduct, 'id'>) {
		const newProduct: IProduct = {
			id: nanoid(6),
			...product,
		}
		this.products.push(newProduct)

		return newProduct
	}

	deleteProduct(id: string) {
		const index = this.products.findIndex(p => p.id === id)

		if (index === -1) return false

		this.products.splice(index, 1)
		return true
	}

	updateProduct(id: string, updatedProduct: Partial<Omit<IProduct, 'id'>>) {
		const product = this.products.find(p => p.id === id)

		if (!product) return undefined

		Object.assign(product, updatedProduct)

		return product
	}
}
