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
		return res.sendStatus(404)
	}
	res.status(200).json(product)
})

router.post('/', (req: Request, res: Response) => {
	const product = req.body
	if (!product?.id || !product?.title || !product?.price) {
		return res.status(400).json({ message: 'Invalid product data' })
	}
	productsService.addProduct(product)
	res.sendStatus(201)
})

router.delete('/:id', (req: Request, res: Response) => {
	const id = Number(req.params.id)
	productsService.deleteProduct(id)
	res.sendStatus(200)
})

router.put('/:id', (req: Request, res: Response) => {
	const id = Number(req.params.id)
	const product = req.body
	const existing = productsService.productById(id)
	if (!existing) {
		return res.sendStatus(404)
	}
	productsService.updateProduct(id, product)
	res.sendStatus(200)
})

export const productsRouter = router
