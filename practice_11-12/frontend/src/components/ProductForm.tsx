import { FormEvent, useEffect, useState } from 'react'
import type { Product, ProductCategory, ProductInput } from '../types/product'

const CATEGORIES: ProductCategory[] = ['ELECTRONICS', 'FOOD', 'CLOTHING', 'OTHER']

const initialState: ProductInput = {
  title: '',
  description: '',
  category: 'OTHER',
  price: 1,
  leftInStock: 1,
  image: '',
}

type ProductFormProps = {
  mode: 'create' | 'edit'
  initialValue?: Product | null
  submitLabel: string
  onSubmit: (payload: ProductInput) => Promise<void>
  onCancel?: () => void
}

export function ProductForm({
  mode,
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductInput>(initialState)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initialValue) {
      const { id: _id, ...rest } = initialValue
      setForm(rest)
      return
    }

    if (mode === 'create') {
      setForm(initialState)
    }
  }, [initialValue, mode])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(form)
      if (mode === 'create') {
        setForm(initialState)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid gap-4 md:grid-cols-2'>
        <input
          required
          className='rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500'
          placeholder='Название'
          value={form.title}
          onChange={event => setForm(prev => ({ ...prev, title: event.target.value }))}
        />
        <input
          required
          className='rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500'
          placeholder='URL картинки'
          value={form.image}
          onChange={event => setForm(prev => ({ ...prev, image: event.target.value }))}
        />
      </div>

      <textarea
        required
        className='min-h-24 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500'
        placeholder='Описание'
        value={form.description}
        onChange={event =>
          setForm(prev => ({ ...prev, description: event.target.value }))
        }
      />

      <div className='grid gap-4 md:grid-cols-3'>
        <select
          className='rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500'
          value={form.category}
          onChange={event =>
            setForm(prev => ({
              ...prev,
              category: event.target.value as ProductCategory,
            }))
          }
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          required
          type='number'
          min={1}
          className='rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500'
          placeholder='Цена'
          value={form.price}
          onChange={event =>
            setForm(prev => ({ ...prev, price: Number(event.target.value) }))
          }
        />

        <input
          required
          type='number'
          min={0}
          className='rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-sky-500'
          placeholder='Остаток'
          value={form.leftInStock}
          onChange={event =>
            setForm(prev => ({ ...prev, leftInStock: Number(event.target.value) }))
          }
        />
      </div>

      <div className='flex gap-3'>
        <button
          type='submit'
          disabled={submitting}
          className='rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-70'
        >
          {submitting ? 'Сохраняем...' : submitLabel}
        </button>

        {onCancel ? (
          <button
            type='button'
            className='rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100'
            onClick={onCancel}
          >
            Отмена
          </button>
        ) : null}
      </div>
    </form>
  )
}
