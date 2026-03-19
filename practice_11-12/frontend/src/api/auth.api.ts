import { apiClient } from './http'
import type { AuthTokens, LoginDto, RegisterDto, UserProfile } from '../types/auth'

export const authApi = {
  register(payload: RegisterDto) {
    return apiClient.post('/auth/register', payload)
  },

  async login(payload: LoginDto): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/login', payload)
    return response.data
  },

  async me(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/auth/me')
    return response.data
  },
}
