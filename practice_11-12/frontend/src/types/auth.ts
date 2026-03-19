export type UserRole = 'user' | 'seller' | 'admin'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto extends LoginDto {
  firstName: string
  lastName: string
  role?: UserRole
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isBlocked: boolean
}
