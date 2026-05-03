import bcrypt from 'bcrypt'

export const USER_ROLES = ['user', 'seller', 'admin'] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface User {
	id: string
	firstName: string
	lastName: string
	email: string
	password: string
	role: UserRole
	isBlocked: boolean
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345'

export const USERS: User[] = [
	{
		id: 'admin-seed',
		firstName: 'System',
		lastName: 'Admin',
		email: 'admin@example.com',
		password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
		role: 'admin',
		isBlocked: false,
	},
]
