import { AuthService } from './auth.service.js'
import type { Request, Response } from 'express'
import { UserLoginDto, UserRegisterDto } from './types/auth.dto.js'

export class AuthController {
	private service = new AuthService()

	register = async (req: Request, res: Response) => {
		const user: UserRegisterDto = req.body
		const userCreated = await this.service.register(user)
		if (!userCreated) {
			return res.status(400).json({ message: 'User already exists' })
		}
		res.status(201).json(userCreated)
	}
	login = async (req: Request, res: Response) => {
		const user: UserLoginDto = req.body
		const userFound = await this.service.login(user)
		if (!userFound) {
			return res.status(400).json({ message: 'User not found' })
		}
		res.status(200).json(userFound)
	}
	me = (req: Request, res: Response) => {
		const payload = (req as any).userId
		const user = this.service.findById(payload.id)
		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}
		res.status(200).json(user)
	}
}
