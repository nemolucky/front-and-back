import { IsEmail, IsString, MinLength } from 'class-validator'

export class UserLoginDto {
	@IsEmail({}, { message: 'Некорректный формат email' })
	email!: string

	@IsString({ message: 'Имя должно быть строкой' })
	@MinLength(8, { message: 'Имя должно содержать минимум 8 символов' })
	password!: string
}

export class UserRegisterDto extends UserLoginDto {
	@IsString({ message: 'Имя должно быть строкой' })
	@MinLength(3, { message: 'Имя должно содержать минимум 3 символа' })
	firstName!: string

	@IsString({ message: 'Имя должно быть строкой' })
	@MinLength(3, { message: 'Имя должно содержать минимум 3 символа' })
	lastName!: string
}
