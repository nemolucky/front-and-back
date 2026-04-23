import { Router } from 'express'
import * as controller from './user.controller'
import {
	validateCreateUserDto,
	validateUpdateUserDto,
	validateUserIdParams,
} from './user.validation'

const router = Router()

router.post('/', validateCreateUserDto, controller.createUser)
router.get('/', controller.getUsers)
router.get('/:id', validateUserIdParams, controller.getUserById)
router.patch('/:id', validateUserIdParams, validateUpdateUserDto, controller.updateUser)
router.delete('/:id', validateUserIdParams, controller.deleteUser)

export default router
