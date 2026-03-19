import { AuthService } from './auth.service.js'
import type { Request, Response } from 'express'
import { UserLoginDto, UserRegisterDto } from './types/auth.dto.js'

export class AuthController {
	private service = new AuthService()

	register = async (req: Request, res: Response) => {
		const user: UserRegisterDto = req.body
		const userCreated = await this.service.register(user)
		if (!userCreated) {
			return res.status(409).json({ message: 'User already exists' })
		}
		res.status(201).json(userCreated)
	}

	login = async (req: Request, res: Response) => {
		const user: UserLoginDto = req.body
		const userFound = await this.service.login(user)
		if (!userFound) {
			return res.status(401).json({ message: 'Invalid credentials' })
		}
		res.status(200).json(userFound)
	}

	refresh = (req: Request, res: Response) => {
		const refreshTokenHeader = req.headers['x-refresh-token']
		const refreshTokenBody = req.body?.refreshToken
		const fromHeader =
			typeof refreshTokenHeader === 'string' ? refreshTokenHeader : ''
		const fromBody = typeof refreshTokenBody === 'string' ? refreshTokenBody : ''
		const rawRefreshToken = fromHeader || fromBody
		if (!rawRefreshToken.trim()) {
			return res.status(400).json({
				message: 'Missing refresh token (x-refresh-token header or body)',
			})
		}

		const refreshToken = rawRefreshToken.startsWith('Bearer ')
			? rawRefreshToken.slice('Bearer '.length)
			: rawRefreshToken

		const refreshed = this.service.refresh(refreshToken)
		if (!refreshed) {
			return res
				.status(401)
				.json({ message: 'Invalid or expired refresh token' })
		}

		return res.status(200).json(refreshed)
	}

	me = (req: Request, res: Response) => {
		const userId = req.user?.id
		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized' })
		}

		const user = this.service.findById(userId)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		res.status(200).json(user)
	}
}
