import { User, USERS } from '../auth/types/user.interface.js'
import { UpdateUserDto } from './types/update-user.dto.js'

export class UsersService {
	private users: User[]

	constructor() {
		this.users = USERS
	}

	getAll() {
		return this.users.map(this.toPublicUser)
	}

	getById(id: string) {
		const user = this.users.find(item => item.id === id)
		if (!user) {
			return false
		}

		return this.toPublicUser(user)
	}

	updateById(id: string, dto: UpdateUserDto) {
		const user = this.users.find(item => item.id === id)
		if (!user) {
			return false
		}

		if (dto.email && dto.email !== user.email) {
			const emailTaken = this.users.some(item => item.email === dto.email)
			if (emailTaken) {
				return null
			}
		}

		Object.assign(user, dto)

		return this.toPublicUser(user)
	}

	blockById(id: string) {
		const user = this.users.find(item => item.id === id)
		if (!user) {
			return false
		}

		user.isBlocked = true
		return this.toPublicUser(user)
	}

	private toPublicUser(user: User) {
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			role: user.role,
			isBlocked: user.isBlocked,
		}
	}
}
