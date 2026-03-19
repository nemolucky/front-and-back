import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator'
import { USER_ROLES, UserRole } from '../../auth/types/user.interface.js'

export class UpdateUserDto {
	@IsOptional()
	@IsString({ message: 'Имя должно быть строкой' })
	@MinLength(3, { message: 'Имя должно содержать минимум 3 символа' })
	firstName?: string

	@IsOptional()
	@IsString({ message: 'Фамилия должна быть строкой' })
	@MinLength(3, { message: 'Фамилия должна содержать минимум 3 символа' })
	lastName?: string

	@IsOptional()
	@IsEmail({}, { message: 'Некорректный формат email' })
	email?: string

	@IsOptional()
	@IsIn(USER_ROLES, { message: 'Некорректная роль' })
	role?: UserRole

	@IsOptional()
	@IsBoolean({ message: 'Поле isBlocked должно быть boolean' })
	isBlocked?: boolean
}
