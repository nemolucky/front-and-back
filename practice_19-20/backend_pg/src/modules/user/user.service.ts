import * as repo from './user.repository'
import { CreateUserBodyDto, UpdateUserBodyDto } from './user.dto'

export const createUser = (data: CreateUserBodyDto) => {
	return repo.createUser(data)
}

export const getUsers = () => {
	return repo.getUsers()
}

export const getUserById = (id: number) => {
	return repo.getUserById(id)
}

export const updateUser = (id: number, data: UpdateUserBodyDto) => {
	return repo.updateUser(id, data)
}

export const deleteUser = (id: number) => {
	return repo.deleteUser(id)
}
