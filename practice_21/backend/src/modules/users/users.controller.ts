import type { Request, Response } from 'express'
import { UsersService } from './users.service.js'
import { UpdateUserDto } from './types/update-user.dto.js'
import {
	invalidateUsersCache,
	saveToCache,
	USERS_CACHE_TTL_SEC,
} from '../../cache/cache.service.js'

export class UsersController {
	private service = new UsersService()

	getAll = async (_req: Request, res: Response) => {
		const users = this.service.getAll()
		const cacheKey = res.locals.cacheKey
		if (typeof cacheKey === 'string') {
			await saveToCache(cacheKey, users, USERS_CACHE_TTL_SEC)
		}

		res.status(200).json({
			source: 'server',
			data: users,
		})
	}

	getById = async (req: Request<{ id: string }>, res: Response) => {
		const user = this.service.getById(req.params.id)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		const cacheKey = res.locals.cacheKey
		if (typeof cacheKey === 'string') {
			await saveToCache(cacheKey, user, USERS_CACHE_TTL_SEC)
		}

		return res.status(200).json({
			source: 'server',
			data: user,
		})
	}

	updateById = async (
		req: Request<{ id: string }, unknown, UpdateUserDto>,
		res: Response,
	) => {
		const updated = this.service.updateById(req.params.id, req.body)
		if (updated === false) {
			return res.status(404).json({ message: 'User not found' })
		}
		if (updated === null) {
			return res.status(409).json({ message: 'Email already exists' })
		}

		await invalidateUsersCache(req.params.id)
		return res.status(200).json(updated)
	}

	blockById = async (req: Request<{ id: string }>, res: Response) => {
		const targetId = req.params.id
		if (req.user?.id === targetId) {
			return res
				.status(400)
				.json({ message: 'Admin cannot block own account' })
		}

		const blocked = this.service.blockById(targetId)
		if (!blocked) {
			return res.status(404).json({ message: 'User not found' })
		}

		await invalidateUsersCache(targetId)
		return res.status(200).json(blocked)
	}
}
