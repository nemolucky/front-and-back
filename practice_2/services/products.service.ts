import { PRODUCTS, type Product } from '../types/products.interface.js'

export class ProductsService {
	constructor(private products: Product[] = PRODUCTS) {}

	allProducts() {
		return this.products
	}

	productById(id: number) {
		return this.products.find(product => product.id === id)
	}

	addProduct(product: Product) {
		this.products.push(product)
	}

	deleteProduct(id: number) {
		this.products = this.products.filter(product => product.id !== id)
	}

	updateProduct(id: number, updatedProduct: Product) {
		const index = this.products.findIndex(p => p.id === id)

		if (index === -1) return

		this.products[index] = {
			...this.products[index],
			...updatedProduct,
		}
	}
}
