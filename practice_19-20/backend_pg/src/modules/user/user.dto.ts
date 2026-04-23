export interface CreateUserBodyDto {
	first_name: string
	last_name: string
	age: number
}

export interface UpdateUserBodyDto {
	first_name: string
	last_name: string
	age: number
}

export interface UserIdParamsDto {
	id: string
}
