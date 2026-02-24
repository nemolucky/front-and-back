import { ProductsService } from './products.service.js'
import { IProduct } from './types/products.types.js'
import type { Request, Response } from 'express'

export class ProductsController {
	private service = new ProductsService()

	getAll = (req: Request, res: Response) => {
		const products = this.service.allProducts()
		res.status(200).json(products)
	}

	getById = (req: Request<{ id: string }>, res: Response) => {
		const id = req.params.id
		const product = this.service.productById(id)

		if (product) {
			res.status(200).json(product)
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	}

	addProduct = (req: Request<{}, {}, Omit<IProduct, 'id'>>, res: Response) => {
		const product = this.service.addProduct(req.body)
		res.status(201).json(product)
	}

	deleteProduct = (req: Request<{ id: string }>, res: Response) => {
		const id = req.params.id
		const isDeleted = this.service.deleteProduct(id)

		if (isDeleted) {
			res.status(200).json({ message: 'Product deleted' })
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	}

	updateProduct = (
		req: Request<
			{ id: string },
			IProduct | { message: string },
			Partial<Omit<IProduct, 'id'>>
		>,
		res: Response,
	) => {
		const id = req.params.id
		const product = this.service.updateProduct(id, req.body)

		if (product) {
			res.status(200).json(product)
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	}
}
