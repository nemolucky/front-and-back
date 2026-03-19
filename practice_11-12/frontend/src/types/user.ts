import { UserRole } from './auth'

export interface UserItem {
	id: string
	firstName: string
	lastName: string
	email: string
	role: UserRole
	isBlocked: boolean
}

export type UpdateUserDto = Partial<
	Pick<UserItem, 'firstName' | 'lastName' | 'email' | 'role' | 'isBlocked'>
>
