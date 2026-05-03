import { Router } from 'express'
import { UsersController } from './users.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { rolesMiddleware } from '../../middleware/roles.middleware.js'
import validationMiddleware from '../../middleware/validation.middleware.js'
import { UpdateUserDto } from './types/update-user.dto.js'
import { cacheMiddleware } from '../../middleware/cache/cache.middleware.js'

const router = Router()
const controller = new UsersController()

router.use(authMiddleware, rolesMiddleware(['admin']))

router.get('/', cacheMiddleware(() => 'users:all'), controller.getAll)
router.get('/:id', cacheMiddleware(req => `users:${req.params.id}`), controller.getById)
router.put('/:id', validationMiddleware(UpdateUserDto), controller.updateById)
router.delete('/:id', controller.blockById)

export default router
