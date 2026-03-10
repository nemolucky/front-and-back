import { Router } from 'express'
import { ProductsController } from './products.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()
const controller = new ProductsController()

router.get('/', controller.getAll)
router.get('/:id', authMiddleware, controller.getById)
router.post('/', controller.addProduct)
router.delete('/:id', authMiddleware, controller.deleteProduct)
router.put('/:id', authMiddleware, controller.updateProduct)

export default router
