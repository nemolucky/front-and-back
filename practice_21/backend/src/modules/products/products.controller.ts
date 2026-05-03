import { ProductsService } from './products.service.js'
import { IProduct } from './types/products.types.js'
import type { Request, Response } from 'express'
import {
	invalidateProductsCache,
	PRODUCTS_CACHE_TTL_SEC,
	saveToCache,
} from '../../cache/cache.service.js'

export class ProductsController {
	private service = new ProductsService()

	getAll = async (req: Request, res: Response) => {
		const products = this.service.allProducts()
		const cacheKey = res.locals.cacheKey
		if (typeof cacheKey === 'string') {
			await saveToCache(cacheKey, products, PRODUCTS_CACHE_TTL_SEC)
		}

		res.status(200).json({
			source: 'server',
			data: products,
		})
	}

	getById = async (req: Request<{ id: string }>, res: Response) => {
		const id = req.params.id
		const product = this.service.productById(id)

		if (product) {
			const cacheKey = res.locals.cacheKey
			if (typeof cacheKey === 'string') {
				await saveToCache(cacheKey, product, PRODUCTS_CACHE_TTL_SEC)
			}

			res.status(200).json({
				source: 'server',
				data: product,
			})
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	}

	addProduct = async (
		req: Request<{}, {}, Omit<IProduct, 'id'>>,
		res: Response,
	) => {
		const product = this.service.addProduct(req.body)
		await invalidateProductsCache()
		res.status(201).json(product)
	}

	deleteProduct = async (req: Request<{ id: string }>, res: Response) => {
		const id = req.params.id
		const isDeleted = this.service.deleteProduct(id)

		if (isDeleted) {
			await invalidateProductsCache(id)
			res.status(200).json({ message: 'Product deleted' })
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	}

	updateProduct = async (
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
			await invalidateProductsCache(id)
			res.status(200).json(product)
		} else {
			res.status(404).json({ message: 'Product not found' })
		}
	}
}
