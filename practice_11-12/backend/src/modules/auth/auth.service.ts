import bcrypt from 'bcrypt'
import { User, UserRole, USERS } from './types/user.interface.js'
import { UserLoginDto, UserRegisterDto } from './types/auth.dto.js'
import { createId } from '@paralleldrive/cuid2'
import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export class AuthService {
	private users: User[]
	private refreshTokens = new Set<string>()
	private accessSecret =
		process.env.ACCESS_JWT_SECRET || process.env.JWT_SECRET || ''
	private refreshSecret = process.env.REFRESH_JWT_SECRET || 'refresh_secret'
	private ACCESS_JWT_EXPIRES_IN: SignOptions['expiresIn'] = '15m'
	private REFRESH_JWT_EXPIRES_IN: SignOptions['expiresIn'] = '1d'

	constructor() {
		this.users = USERS
	}

	async register(user: UserRegisterDto) {
		const existingUser = this.findByEmail(user.email)
		if (existingUser) {
			return false
		}

		const userCreated = {
			...user,
			id: createId(),
			password: await this.hashPassword(user.password),
			role: user.role || 'user',
			isBlocked: false,
		}
		this.users.push(userCreated)
		return {
			id: userCreated.id,
			email: userCreated.email,
			firstName: userCreated.firstName,
			lastName: userCreated.lastName,
			role: userCreated.role,
			isBlocked: userCreated.isBlocked,
		}
	}

	async login(dto: UserLoginDto) {
		const user = await this.verifyUser(dto)
		if (!user) {
			return false
		}

		const accessToken = this.generateAccessToken(user.id, user.role)
		const refreshToken = this.generateRefreshToken(user.id, user.role)
		this.refreshTokens.add(refreshToken)

		return {
			accessToken,
			refreshToken,
		}
	}

	refresh(refreshToken: string) {
		if (!this.refreshTokens.has(refreshToken)) {
			return false
		}

		try {
			const payload = jwt.verify(refreshToken, this.refreshSecret)
			const userId = this.extractUserId(payload)
			if (!userId) {
				return false
			}

			const user = this.users.find(item => item.id === userId)
			if (!user || user.isBlocked) {
				return false
			}

			this.refreshTokens.delete(refreshToken)
			const newAccessToken = this.generateAccessToken(user.id, user.role)
			const newRefreshToken = this.generateRefreshToken(user.id, user.role)
			this.refreshTokens.add(newRefreshToken)

			return {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			}
		} catch {
			return false
		}
	}

	async verifyUser(dto: UserLoginDto) {
		const user = this.findByEmail(dto.email)
		if (!user) {
			return false
		}
		const isPasswordValid = await bcrypt.compare(dto.password, user.password)
		if (!isPasswordValid) {
			return false
		}
		if (user.isBlocked) {
			return false
		}
		return user
	}

	findByEmail(email: string) {
		return this.users.find(user => user.email === email)
	}

	findById(id: string) {
		const user = this.users.find(user => user.id === id)
		if (!user) {
			return false
		}
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			isBlocked: user.isBlocked,
		}
	}

	private async hashPassword(password: string, round: number = 10) {
		return bcrypt.hash(password, round)
	}

	private generateAccessToken(id: string, role: UserRole) {
		return jwt.sign({ sub: id, role }, this.accessSecret, {
			expiresIn: this.ACCESS_JWT_EXPIRES_IN,
		})
	}

	private generateRefreshToken(id: string, role: UserRole) {
		return jwt.sign({ sub: id, role }, this.refreshSecret, {
			expiresIn: this.REFRESH_JWT_EXPIRES_IN,
		})
	}

	private extractUserId(payload: string | jwt.JwtPayload) {
		if (typeof payload === 'string') {
			return null
		}
		if (typeof payload.sub !== 'string') {
			return null
		}
		return payload.sub
	}
}
