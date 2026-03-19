import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../api/products.api'
import { ProductForm } from '../components/ProductForm'
import type { Product, ProductInput } from '../types/product'
import { UserRole } from '../types/auth'

type ProductsPageProps = {
  userName: string
  userRole: UserRole
  onLogout: () => void
}

export function ProductsPage({ userName, userRole, onLogout }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const canManageProducts = userRole === 'seller' || userRole === 'admin'
  const canDeleteProducts = userRole === 'admin'

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await productsApi.getAll()
      setProducts(data)
    } catch {
      setError('Не удалось загрузить товары')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const totalItems = useMemo(
    () => products.reduce((sum, product) => sum + product.leftInStock, 0),
    [products],
  )

  const handleCreate = async (payload: ProductInput) => {
    setError('')
    try {
      const created = await productsApi.create(payload)
      setProducts(prev => [created, ...prev])
    } catch {
      setError('Не удалось создать товар')
      throw new Error('create_failed')
    }
  }

  const handleUpdate = async (payload: ProductInput) => {
    if (!editing) {
      return
    }

    setError('')
    try {
      const updated = await productsApi.update(editing.id, payload)
      setProducts(prev => prev.map(item => (item.id === updated.id ? updated : item)))
      setEditing(null)
    } catch {
      setError('Не удалось обновить товар')
      throw new Error('update_failed')
    }
  }

  const handleDelete = async (id: string) => {
    setError('')
    try {
      await productsApi.remove(id)
      setProducts(prev => prev.filter(item => item.id !== id))
      if (editing?.id === id) {
        setEditing(null)
      }
    } catch {
      setError('Не удалось удалить товар')
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
            <h1 className='text-3xl font-extrabold text-slate-900'>Управление товарами</h1>
            <p className='mt-1 text-slate-600'>
              Позиций: {products.length}, суммарный остаток: {totalItems}
            </p>
            <p className='mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500'>
              Роль: {userRole}
            </p>
          </div>

          <div className='flex gap-3'>
            {userRole === 'admin' ? (
              <Link
                to='/users'
                className='rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100'
              >
                Пользователи
              </Link>
            ) : null}

            <button
              type='button'
              onClick={onLogout}
              className='rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-black'
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {error ? <p className='mb-4 text-sm text-rose-700'>{error}</p> : null}

      {canManageProducts ? (
        <section className='mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-bold text-slate-900'>Добавить товар</h2>
          <ProductForm mode='create' submitLabel='Создать товар' onSubmit={handleCreate} />
        </section>
      ) : null}

      {canManageProducts ? (
        <section className='mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
          <h2 className='mb-4 text-xl font-bold text-slate-900'>Редактирование товара</h2>
          {editing ? (
            <ProductForm
              mode='edit'
              initialValue={editing}
              submitLabel='Сохранить изменения'
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <p className='text-slate-600'>Выберите товар в таблице ниже для редактирования.</p>
          )}
        </section>
      ) : null}

      <section className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold text-slate-900'>Список товаров</h2>
          <button
            type='button'
            className='rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100'
            onClick={() => void loadProducts()}
          >
            Обновить
          </button>
        </div>

        {loading ? <p className='text-slate-700'>Загрузка...</p> : null}

        {!loading && products.length === 0 ? (
          <p className='text-slate-700'>Пока нет товаров.</p>
        ) : null}

        <div className='grid gap-4 md:grid-cols-2'>
          {products.map(product => (
            <article
              key={product.id}
              className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'
            >
              <img
                src={product.image}
                alt={product.title}
                className='h-44 w-full object-cover'
              />

              <div className='space-y-2 p-4'>
                <div className='flex items-start justify-between gap-3'>
                  <h3 className='text-lg font-bold text-slate-900'>{product.title}</h3>
                  <span className='rounded-lg bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-800'>
                    {product.category}
                  </span>
                </div>

                <p className='text-sm text-slate-600'>{product.description}</p>
                <p className='text-sm font-semibold text-slate-800'>Цена: {product.price}</p>
                <p className='text-sm text-slate-700'>Остаток: {product.leftInStock}</p>

                <div className='mt-3 flex flex-wrap gap-2'>
                  <Link
                    to={`/products/${product.id}`}
                    className='rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100'
                  >
                    Детали
                  </Link>
                  {canManageProducts ? (
                    <button
                      type='button'
                      onClick={() => setEditing(product)}
                      className='rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-600'
                    >
                      Редактировать
                    </button>
                  ) : null}
                  {canDeleteProducts ? (
                    <button
                      type='button'
                      onClick={() => void handleDelete(product.id)}
                      className='rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700'
                    >
                      Удалить
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
