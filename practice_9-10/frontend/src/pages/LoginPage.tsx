import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import type { LoginDto } from '../types/auth'

type LoginPageProps = {
  loading: boolean
  error: string
  onSubmit: (payload: LoginDto) => Promise<void>
}

export function LoginPage({ loading, error, onSubmit }: LoginPageProps) {
  const [form, setForm] = useState<LoginDto>({ email: '', password: '' })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(form)
  }

  return (
    <main className='mx-auto flex min-h-screen w-full max-w-md items-center px-4'>
      <section className='w-full rounded-3xl border border-amber-200 bg-white/90 p-8 shadow-xl shadow-amber-100/70 backdrop-blur'>
        <p className='mb-2 text-sm font-semibold uppercase tracking-wide text-amber-700'>
          Practice 9-10
        </p>
        <h1 className='mb-1 text-3xl font-extrabold text-slate-900'>Вход в систему</h1>
        <p className='mb-6 text-sm text-slate-600'>
          Авторизуйтесь, чтобы управлять товарами.
        </p>

        <form className='space-y-4' onSubmit={handleSubmit}>
          <input
            required
            type='email'
            className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500'
            placeholder='Email'
            value={form.email}
            onChange={event => setForm(prev => ({ ...prev, email: event.target.value }))}
          />
          <input
            required
            type='password'
            className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500'
            placeholder='Пароль (минимум 8 символов)'
            value={form.password}
            onChange={event =>
              setForm(prev => ({ ...prev, password: event.target.value }))
            }
          />

          {error ? <p className='text-sm text-rose-700'>{error}</p> : null}

          <button
            disabled={loading}
            type='submit'
            className='w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-70'
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className='mt-6 text-sm text-slate-600'>
          Нет аккаунта?{' '}
          <Link className='font-semibold text-sky-700 underline' to='/register'>
            Зарегистрироваться
          </Link>
        </p>
      </section>
    </main>
  )
}
