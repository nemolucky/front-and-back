import bcrypt from 'bcrypt'
import { User, USERS } from './types/user.interface.js'
import { UserLoginDto, UserRegisterDto } from './types/auth.dto.js'
import { createId } from '@paralleldrive/cuid2'
import jwt, { SignOptions } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export class AuthService {
	private users: User[]
	private JWT_EXPIRES_IN: SignOptions['expiresIn'] = '1d'

	constructor() {
		this.users = USERS
	}

	async register(user: UserRegisterDto) {
		const userCreated = {
			...user,
			id: createId(),
			password: await this.hashPassword(user.password),
		}
		this.users.push(userCreated)
		return {
			id: userCreated.id,
			email: userCreated.email,
			firstName: userCreated.firstName,
			lastName: userCreated.lastName,
		}
	}

	async login(dto: UserLoginDto) {
		const user = await this.verifyUser(dto)
		if (!user) {
			return false
		}
		const token = this.generateToken(user.id)
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			token: token,
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
		}
	}

	private async hashPassword(password: string, round: number = 10) {
		return bcrypt.hash(password, round)
	}

	private generateToken(id: string) {
		const token = jwt.sign({ id }, process.env.JWT_SECRET || '', {
			expiresIn: this.JWT_EXPIRES_IN,
		})

		return token
	}
}
