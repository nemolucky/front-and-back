import { Router } from 'express'
import { ProductsController } from './products.controller.js'

const router = Router()
const controller = new ProductsController()

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', controller.addProduct)
router.delete('/:id', controller.deleteProduct)
router.patch('/:id', controller.updateProduct)

export default router
