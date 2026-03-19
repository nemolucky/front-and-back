import type { Request, Response } from 'express'
import { UsersService } from './users.service.js'
import { UpdateUserDto } from './types/update-user.dto.js'

export class UsersController {
	private service = new UsersService()

	getAll = (_req: Request, res: Response) => {
		const users = this.service.getAll()
		res.status(200).json(users)
	}

	getById = (req: Request<{ id: string }>, res: Response) => {
		const user = this.service.getById(req.params.id)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		return res.status(200).json(user)
	}

	updateById = (
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

		return res.status(200).json(updated)
	}

	blockById = (req: Request<{ id: string }>, res: Response) => {
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

		return res.status(200).json(blocked)
	}
}
