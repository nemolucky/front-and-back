import { apiClient } from './http'
import { UpdateUserDto, UserItem } from '../types/user'

export const usersApi = {
	async getAll(): Promise<UserItem[]> {
		const response = await apiClient.get<UserItem[]>('/users')
		return response.data
	},

	async getById(id: string): Promise<UserItem> {
		const response = await apiClient.get<UserItem>(`/users/${id}`)
		return response.data
	},

	async updateById(id: string, payload: UpdateUserDto): Promise<UserItem> {
		const response = await apiClient.put<UserItem>(`/users/${id}`, payload)
		return response.data
	},

	async blockById(id: string): Promise<UserItem> {
		const response = await apiClient.delete<UserItem>(`/users/${id}`)
		return response.data
	},
}
