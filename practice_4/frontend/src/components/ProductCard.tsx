import { EditIcon, Trash2Icon } from 'lucide-react'
import { IProduct } from '../types/product.interface'

interface Props {
	product: IProduct
	onEdit: () => void
	onDelete: (id: string) => void
}

export function ProductCard({ product, onEdit, onDelete }: Props) {
	return (
		<div className='bg-neutral-200 rounded-lg shadow-xl overflow-hidden'>
			<div className='w-full h-48 bg-gray-300'>
				<img
					src={product.image}
					alt={product.title}
					className='w-full h-full object-cover'
				/>
			</div>

			<div className='px-4 py-3'>
				<div className='flex flex-col gap-1'>
					<div className='flex flex-row justify-between items-start'>
						<span className='text-lg font-semibold'>{product.title}</span>
						<div className='flex gap-2'>
							<button onClick={onEdit}>
								<EditIcon size={22} />
							</button>
							<button onClick={() => onDelete(product.id)}>
								<Trash2Icon size={22} />
							</button>
						</div>
					</div>

					<div className='flex items-center'>
						<span className='text-sm text-gray-500'>#{product.id}</span>
						<span className='text-sm text-gray-500 ml-2 bg-gray-300 py-0.5 px-1 rounded'>
							{product.category.toLowerCase()}
						</span>
					</div>
				</div>

				<p className='my-2 text-md'>{product.description}</p>

				<div className='flex justify-between'>
					<span className='text-sm font-medium'>Price: ${product.price}</span>
					<span className='text-sm'>Left: {product.leftInStock}</span>
				</div>
			</div>
		</div>
	)
}
