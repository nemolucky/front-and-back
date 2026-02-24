import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { IProduct, ProductCategory } from '../types/product.interface'

interface Props {
	isOpen: boolean
	mode: 'create' | 'edit'
	initialData?: IProduct
	onSubmit: (data: IProduct) => void
	onClose: () => void
}

export function ProductModal({
	isOpen,
	mode,
	initialData,
	onSubmit,
	onClose,
}: Props) {
	const { register, handleSubmit, reset } = useForm<IProduct>()

	useEffect(() => {
		if (mode === 'edit' && initialData) {
			reset(initialData)
		} else {
			reset({
				title: '',
				description: '',
				category: ProductCategory.OTHER,
				price: 0,
				leftInStock: 0,
			})
		}
	}, [mode, initialData, reset])

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black/50'>
			<div className='bg-white p-6 rounded-lg shadow-lg w-96'>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
					<button type='button' onClick={onClose} className='text-2xl'>
						×
					</button>

					<input
						{...register('title', { required: true })}
						placeholder='Title'
						className='border p-2 w-full'
					/>

					<textarea
						{...register('description')}
						placeholder='Description'
						className='border p-2 w-full'
					/>

					<select {...register('category')} className='border p-2 w-full'>
						{Object.values(ProductCategory).map(cat => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>

					<input
						type='number'
						{...register('price', { valueAsNumber: true })}
						placeholder='Price'
						className='border p-2 w-full'
					/>

					<input
						type='number'
						{...register('leftInStock', { valueAsNumber: true })}
						placeholder='Left in stock'
						className='border p-2 w-full'
					/>

					<button
						type='submit'
						className='bg-blue-500 text-white px-4 py-2 rounded w-full'
					>
						{mode === 'create' ? 'Create' : 'Update'}
					</button>
				</form>
			</div>
		</div>
	)
}
