import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { productsApi } from '../api/products.api'
import { ProductForm } from '../components/ProductForm'
import type { Product, ProductInput } from '../types/product'
import { UserRole } from '../types/auth'

type ProductDetailsPageProps = {
  onLogout: () => void
  userName: string
  userRole: UserRole
}

export function ProductDetailsPage({
  onLogout,
  userName,
  userRole,
}: ProductDetailsPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const canManageProducts = userRole === 'seller' || userRole === 'admin'
  const canDeleteProducts = userRole === 'admin'

  useEffect(() => {
    if (!id) {
      setError('Некорректный id товара')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    productsApi
      .getById(id)
      .then(setProduct)
      .catch(() => setError('Товар не найден или недоступен'))
      .finally(() => setLoading(false))
  }, [id])

  const headerText = useMemo(() => {
    if (!product) {
      return 'Детали товара'
    }

    return `Товар: ${product.title}`
  }, [product])

  const handleUpdate = async (payload: ProductInput) => {
    if (!id) {
      return
    }

    setBusy(true)
    setError('')
    try {
      const updated = await productsApi.update(id, payload)
      setProduct(updated)
    } catch {
      setError('Не удалось обновить товар')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!id) {
      return
    }

    setBusy(true)
    setError('')
    try {
      await productsApi.remove(id)
      navigate('/products', { replace: true })
    } catch {
      setError('Не удалось удалить товар')
      setBusy(false)
    }
  }

  return (
    <main className='mx-auto w-full max-w-5xl px-4 py-8'>
      <header className='mb-8 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-wide text-sky-700'>
            {userName}
          </p>
          <h1 className='text-2xl font-extrabold text-slate-900'>{headerText}</h1>
        </div>

        <div className='flex gap-3'>
          {userRole === 'admin' ? (
            <Link
              to='/users'
              className='rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100'
            >
              Пользователи
            </Link>
          ) : null}
          <Link
            to='/products'
            className='rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100'
          >
            К списку
          </Link>
          <button
            type='button'
            onClick={onLogout}
            className='rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-black'
          >
            Выйти
          </button>
        </div>
      </header>

      {loading ? <p className='text-slate-700'>Загрузка...</p> : null}
      {error ? <p className='mb-4 text-sm text-rose-700'>{error}</p> : null}

      {product ? (
        <section className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
          <img
            src={product.image}
            alt={product.title}
            className='mb-6 h-56 w-full rounded-2xl object-cover sm:h-72'
          />

          {canManageProducts ? (
            <ProductForm
              mode='edit'
              initialValue={product}
              submitLabel={busy ? 'Обновляем...' : 'Обновить товар'}
              onSubmit={handleUpdate}
            />
          ) : (
            <p className='text-slate-700'>
              Редактирование доступно только продавцу и администратору.
            </p>
          )}

          {canDeleteProducts ? (
            <button
              disabled={busy}
              type='button'
              onClick={handleDelete}
              className='mt-4 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60'
            >
              Удалить товар
            </button>
          ) : null}
        </section>
      ) : null}
    </main>
  )
}
