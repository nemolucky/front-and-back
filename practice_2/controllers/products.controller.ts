import { Router, type Request, type Response } from 'express'
import { ProductsService } from '../services/products.service.js'

const productsService = new ProductsService()

const router = Router()

router.get('/', (req: Request, res: Response) => {
	const products = productsService.allProducts()
	res.status(200).json(products)
})

router.get('/:id', (req: Request, res: Response) => {
	const id = Number(req.params.id)
	const product = productsService.productById(id)
	if (!product) {
		return res.status(404).json({ message: 'Product not found' })
	}
	res.status(200).json(product)
})

router.post('/', (req: Request, res: Response) => {
	const { title, price } = req.body
	if (!title || price === undefined) {
		return res.status(400).json({ message: 'Invalid product data' })
	}
	const newProduct = productsService.addProduct({ title, price })
	res.status(201).json(newProduct)
})

router.delete('/:id', (req: Request, res: Response) => {
	const id = Number(req.params.id)
	const deleted = productsService.deleteProduct(id)

	if (!deleted) {
		return res.sendStatus(404)
	}

	res.sendStatus(204)
})

router.patch('/:id', (req: Request, res: Response) => {
	const id = Number(req.params.id)
	const updated = productsService.updateProduct(id, req.body)
	if (!updated) {
		return res.sendStatus(404)
	}
	res.status(200).json(updated)
})

export const productsRouter = router
