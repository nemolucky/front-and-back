import * as repo from './user.repository'

export const createUser = (data: any) => repo.createUser(data)

export const getUsers = () => repo.getUsers()

export const getUserById = (id: string) => repo.getUserById(id)

export const updateUser = (id: string, data: any) => repo.updateUser(id, data)

export const deleteUser = (id: string) => repo.deleteUser(id)
