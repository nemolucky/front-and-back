import { Request, Response, NextFunction } from 'express'
import * as service from './user.service'

export const createUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await service.createUser(req.body)
		res.status(201).json(user)
	} catch (e) {
		next(e)
	}
}

export const getUsers = async (
	_: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const users = await service.getUsers()
		res.json(users)
	} catch (e) {
		next(e)
	}
}

export const getUserById = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await service.getUserById(req.params.id)
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json(user)
	} catch (e) {
		next(e)
	}
}

export const updateUser = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await service.updateUser(req.params.id, req.body)
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json(user)
	} catch (e) {
		next(e)
	}
}

export const deleteUser = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await service.deleteUser(req.params.id)
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json({ message: 'User deleted', user })
	} catch (e) {
		next(e)
	}
}
