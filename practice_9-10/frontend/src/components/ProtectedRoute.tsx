import { Navigate } from 'react-router-dom'
import { ReactElement } from 'react'

type ProtectedRouteProps = {
  isAuthed: boolean
  isBootstrapping: boolean
  children: ReactElement
}

export function ProtectedRoute({
  isAuthed,
  isBootstrapping,
  children,
}: ProtectedRouteProps) {
  if (isBootstrapping) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-lg font-semibold text-slate-700'>Проверяем сессию...</p>
      </div>
    )
  }

  if (!isAuthed) {
    return <Navigate to='/login' replace />
  }

  return children
}
