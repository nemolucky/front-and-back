import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import type { RegisterDto, UserRole } from '../types/auth'

type RegisterPageProps = {
  loading: boolean
  error: string
  onSubmit: (payload: RegisterDto) => Promise<void>
}

export function RegisterPage({ loading, error, onSubmit }: RegisterPageProps) {
  const [form, setForm] = useState<RegisterDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(form)
  }

  return (
    <main className='mx-auto flex min-h-screen w-full max-w-xl items-center px-4'>
      <section className='w-full rounded-3xl border border-sky-200 bg-white/90 p-8 shadow-xl shadow-sky-100/70 backdrop-blur'>
        <p className='mb-2 text-sm font-semibold uppercase tracking-wide text-sky-700'>
          Practice 9-10
        </p>
        <h1 className='mb-1 text-3xl font-extrabold text-slate-900'>Регистрация</h1>
        <p className='mb-6 text-sm text-slate-600'>
          Создайте пользователя, затем сможете войти и работать с товарами.
        </p>

        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='grid gap-4 sm:grid-cols-2'>
            <input
              required
              minLength={3}
              className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500'
              placeholder='Имя'
              value={form.firstName}
              onChange={event =>
                setForm(prev => ({ ...prev, firstName: event.target.value }))
              }
            />
            <input
              required
              minLength={3}
              className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500'
              placeholder='Фамилия'
              value={form.lastName}
              onChange={event =>
                setForm(prev => ({ ...prev, lastName: event.target.value }))
              }
            />
          </div>

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
            minLength={8}
            className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500'
            placeholder='Пароль (минимум 8 символов)'
            value={form.password}
            onChange={event =>
              setForm(prev => ({ ...prev, password: event.target.value }))
            }
          />

          <select
            className='w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500'
            value={form.role}
            onChange={event =>
              setForm(prev => ({ ...prev, role: event.target.value as UserRole }))
            }
          >
            <option value='user'>Пользователь</option>
            <option value='seller'>Продавец</option>
            <option value='admin'>Администратор</option>
          </select>

          {error ? <p className='text-sm text-rose-700'>{error}</p> : null}

          <button
            disabled={loading}
            type='submit'
            className='w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-70'
          >
            {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className='mt-6 text-sm text-slate-600'>
          Уже есть аккаунт?{' '}
          <Link className='font-semibold text-sky-700 underline' to='/login'>
            Войти
          </Link>
        </p>
      </section>
    </main>
  )
}
