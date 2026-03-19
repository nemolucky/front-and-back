import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usersApi } from '../api/users.api'
import { UserRole } from '../types/auth'
import { UserItem } from '../types/user'

type UsersPageProps = {
	userName: string
	onLogout: () => void
}

type EditForm = {
	firstName: string
	lastName: string
	email: string
	role: UserRole
}

export function UsersPage({ userName, onLogout }: UsersPageProps) {
	const [users, setUsers] = useState<UserItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [editing, setEditing] = useState<UserItem | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const [form, setForm] = useState<EditForm>({
		firstName: '',
		lastName: '',
		email: '',
		role: 'user',
	})

	const loadUsers = async () => {
		setLoading(true)
		setError('')
		try {
			const data = await usersApi.getAll()
			setUsers(data)
		} catch {
			setError('Не удалось загрузить пользователей')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadUsers()
	}, [])

	const startEdit = (user: UserItem) => {
		setEditing(user)
		setForm({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			role: user.role,
		})
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!editing) {
			return
		}

		setSubmitting(true)
		setError('')
		try {
			const updated = await usersApi.updateById(editing.id, form)
			setUsers(prev => prev.map(user => (user.id === updated.id ? updated : user)))
			setEditing(null)
		} catch {
			setError('Не удалось обновить пользователя')
		} finally {
			setSubmitting(false)
		}
	}

	const handleBlock = async (id: string) => {
		setError('')
		try {
			const blocked = await usersApi.blockById(id)
			setUsers(prev => prev.map(user => (user.id === blocked.id ? blocked : user)))
			if (editing?.id === blocked.id) {
				setEditing(null)
			}
		} catch {
			setError('Не удалось заблокировать пользователя')
		}
	}

	return (
		<main className='mx-auto w-full max-w-6xl px-4 py-8'>
			<header className='mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<p className='text-sm font-semibold uppercase tracking-wide text-sky-700'>
							{userName}
						</p>
						<h1 className='text-3xl font-extrabold text-slate-900'>
							Управление пользователями
						</h1>
					</div>

					<div className='flex gap-3'>
						<Link
							to='/products'
							className='rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100'
						>
							К товарам
						</Link>
						<button
							type='button'
							onClick={onLogout}
							className='rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-black'
						>
							Выйти
						</button>
					</div>
				</div>
			</header>

			{error ? <p className='mb-4 text-sm text-rose-700'>{error}</p> : null}

			{editing ? (
				<section className='mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
					<h2 className='mb-4 text-xl font-bold text-slate-900'>
						Редактирование пользователя
					</h2>
					<form className='space-y-4' onSubmit={handleSubmit}>
						<div className='grid gap-4 sm:grid-cols-2'>
							<input
								required
								minLength={3}
								className='rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500'
								value={form.firstName}
								onChange={event =>
									setForm(prev => ({ ...prev, firstName: event.target.value }))
								}
							/>
							<input
								required
								minLength={3}
								className='rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500'
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
							value={form.email}
							onChange={event =>
								setForm(prev => ({ ...prev, email: event.target.value }))
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

						<div className='flex gap-3'>
							<button
								disabled={submitting}
								type='submit'
								className='rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-70'
							>
								{submitting ? 'Сохраняем...' : 'Сохранить'}
							</button>
							<button
								type='button'
								onClick={() => setEditing(null)}
								className='rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100'
							>
								Отмена
							</button>
						</div>
					</form>
				</section>
			) : null}

			<section className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
				<div className='mb-4 flex items-center justify-between'>
					<h2 className='text-xl font-bold text-slate-900'>Список пользователей</h2>
					<button
						type='button'
						className='rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100'
						onClick={() => void loadUsers()}
					>
						Обновить
					</button>
				</div>

				{loading ? <p className='text-slate-700'>Загрузка...</p> : null}

				<div className='overflow-x-auto'>
					<table className='w-full min-w-[700px] border-collapse'>
						<thead>
							<tr className='border-b border-slate-200 text-left text-sm text-slate-500'>
								<th className='py-2'>ID</th>
								<th className='py-2'>Email</th>
								<th className='py-2'>Имя</th>
								<th className='py-2'>Роль</th>
								<th className='py-2'>Статус</th>
								<th className='py-2'>Действия</th>
							</tr>
						</thead>
						<tbody>
							{users.map(user => (
								<tr key={user.id} className='border-b border-slate-100 text-sm'>
									<td className='py-3'>{user.id}</td>
									<td className='py-3'>{user.email}</td>
									<td className='py-3'>
										{user.firstName} {user.lastName}
									</td>
									<td className='py-3 uppercase'>{user.role}</td>
									<td className='py-3'>
										{user.isBlocked ? 'Заблокирован' : 'Активен'}
									</td>
									<td className='py-3'>
										<div className='flex flex-wrap gap-2'>
											<button
												type='button'
												onClick={() => startEdit(user)}
												className='rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600'
											>
												Редактировать
											</button>
											{!user.isBlocked ? (
												<button
													type='button'
													onClick={() => void handleBlock(user.id)}
													className='rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700'
												>
													Блокировать
												</button>
											) : null}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</main>
	)
}
