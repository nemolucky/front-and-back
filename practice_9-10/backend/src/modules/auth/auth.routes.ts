import { Router } from 'express'
import { AuthController } from './auth.controller.js'
import validationMiddleware from '../../middleware/validation.middleware.js'
import { UserLoginDto, UserRegisterDto } from './types/auth.dto.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()
const controller = new AuthController()

router.post(
	'/register',
	validationMiddleware(UserRegisterDto),
	controller.register,
)
router.post('/login', validationMiddleware(UserLoginDto), controller.login)
router.post('/refresh', controller.refresh)
router.get('/me', authMiddleware, controller.me)

export default router
