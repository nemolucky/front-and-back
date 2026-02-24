import { ProductCard } from './ProductCard'
import { IProduct } from '../types/product.interface'

interface Props {
	products: IProduct[]
	loading: boolean
	setProducts: (products: IProduct[]) => void
	onEdit: (product: IProduct) => void
	onDelete: (id: string) => void
}

export function ProductList({ products, loading, onDelete, onEdit }: Props) {
	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"'>
			{products.map(product => (
				<ProductCard
					key={product.id}
					product={product}
					onEdit={() => onEdit(product)}
					onDelete={onDelete}
				/>
			))}
		</div>
	)
}
