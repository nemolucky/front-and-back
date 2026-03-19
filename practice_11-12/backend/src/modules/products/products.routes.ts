import { Router } from 'express'
import { ProductsController } from './products.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { rolesMiddleware } from '../../middleware/roles.middleware.js'

const router = Router()
const controller = new ProductsController()

router.get('/', authMiddleware, rolesMiddleware(['user', 'seller', 'admin']), controller.getAll)
router.get(
	'/:id',
	authMiddleware,
	rolesMiddleware(['user', 'seller', 'admin']),
	controller.getById,
)
router.post(
	'/',
	authMiddleware,
	rolesMiddleware(['seller', 'admin']),
	controller.addProduct,
)
router.put(
	'/:id',
	authMiddleware,
	rolesMiddleware(['seller', 'admin']),
	controller.updateProduct,
)
router.delete(
	'/:id',
	authMiddleware,
	rolesMiddleware(['admin']),
	controller.deleteProduct,
)

export default router
