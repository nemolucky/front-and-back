import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { authApi } from './api/auth.api'
import { setUnauthorizedHandler } from './api/http'
import { ProtectedRoute } from './components/ProtectedRoute'
import { tokenStorage } from './lib/token'
import { LoginPage } from './pages/LoginPage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { ProductsPage } from './pages/ProductsPage'
import { RegisterPage } from './pages/RegisterPage'
import type { LoginDto, RegisterDto, UserProfile } from './types/auth'

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      'Ошибка запроса'
    )
  }
  return 'Неизвестная ошибка'
}

export default function App() {
  const navigate = useNavigate()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const isAuthed = Boolean(user && tokenStorage.getAccessToken())
  const userName = useMemo(() => {
    if (!user) {
      return 'Гость'
    }
    return `${user.firstName} ${user.lastName}`
  }, [user])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    setAuthError('')
    navigate('/login', { replace: true })
  }, [navigate])

  const bootstrapSession = useCallback(async () => {
    const accessToken = tokenStorage.getAccessToken()
    if (!accessToken) {
      setUser(null)
      setIsBootstrapping(false)
      return
    }

    try {
      const profile = await authApi.me()
      setUser(profile)
    } catch {
      tokenStorage.clear()
      setUser(null)
    } finally {
      setIsBootstrapping(false)
    }
  }, [])

  useEffect(() => {
    void bootstrapSession()
  }, [bootstrapSession])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStorage.clear()
      setUser(null)
      navigate('/login', { replace: true })
    })

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [navigate])

  const handleLogin = async (payload: LoginDto) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      const tokens = await authApi.login(payload)
      tokenStorage.save(tokens)
      const profile = await authApi.me()
      setUser(profile)
      navigate('/products', { replace: true })
    } catch (error) {
      setAuthError(getErrorMessage(error))
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async (payload: RegisterDto) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      await authApi.register(payload)
      await handleLogin({ email: payload.email, password: payload.password })
    } catch (error) {
      setAuthError(getErrorMessage(error))
      setAuthLoading(false)
    }
  }

  return (
    <Routes>
      <Route
        path='/login'
        element={
          isAuthed ? (
            <Navigate to='/products' replace />
          ) : (
            <LoginPage
              loading={authLoading}
              error={authError}
              onSubmit={handleLogin}
            />
          )
        }
      />
      <Route
        path='/register'
        element={
          isAuthed ? (
            <Navigate to='/products' replace />
          ) : (
            <RegisterPage
              loading={authLoading}
              error={authError}
              onSubmit={handleRegister}
            />
          )
        }
      />
      <Route
        path='/products'
        element={
          <ProtectedRoute isAuthed={isAuthed} isBootstrapping={isBootstrapping}>
            <ProductsPage userName={userName} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path='/products/:id'
        element={
          <ProtectedRoute isAuthed={isAuthed} isBootstrapping={isBootstrapping}>
            <ProductDetailsPage userName={userName} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path='*'
        element={<Navigate to={isAuthed ? '/products' : '/login'} replace />}
      />
    </Routes>
  )
}
