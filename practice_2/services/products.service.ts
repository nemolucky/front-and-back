import { PRODUCTS, type Product } from '../types/products.interface.js'

export class ProductsService {
	constructor(private products: Product[] = PRODUCTS) {}

	private currentId =
		PRODUCTS.length > 0 ? Math.max(...PRODUCTS.map(p => p.id)) : 0

	allProducts() {
		return this.products
	}

	productById(id: number) {
		return this.products.find(product => product.id === id)
	}

	addProduct(product: Omit<Product, 'id'>) {
		this.currentId++
		const newProduct: Product = {
			id: this.currentId,
			...product,
		}
		this.products.push(newProduct)

		return newProduct
	}

	deleteProduct(id: number) {
		const index = this.products.findIndex(p => p.id === id)

		if (index === -1) return false

		this.products.splice(index, 1)
		return true
	}

	updateProduct(id: number, updatedProduct: Partial<Omit<Product, 'id'>>) {
		const product = this.products.find(p => p.id === id)

		if (!product) return undefined

		if (updatedProduct.title !== undefined) product.title = updatedProduct.title
		if (updatedProduct.price !== undefined) product.price = updatedProduct.price

		return product
	}
}
