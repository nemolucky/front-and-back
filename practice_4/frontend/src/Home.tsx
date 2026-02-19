import { useEffect, useState } from 'react'
import { Header } from './common/Header'
import { ProductList } from './components/ProductList'
import { ProductModal } from './components/ProductModal'
import { IProduct } from './types/product.interface'
import {
	handleDeleteProduct,
	handleSubmitProduct,
	loadProducts,
} from './types/home.handlers'

function Home() {
	const [isOpen, setIsOpen] = useState(false)
	const [mode, setMode] = useState<'create' | 'edit'>('create')
	const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)

	const [products, setProducts] = useState<IProduct[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadProducts(setProducts, setLoading)
	}, [])

	const openCreate = () => {
		setMode('create')
		setSelectedProduct(null)
		setIsOpen(true)
	}

	const openEdit = (product: IProduct) => {
		setMode('edit')
		setSelectedProduct(product)
		setIsOpen(true)
	}

	return (
		<div className='min-h-screen bg-gray-300'>
			<div className='container mx-auto px-4 py-10'>
				<Header onOpen={openCreate} />

				<ProductList
					products={products}
					setProducts={setProducts}
					loading={loading}
					onEdit={openEdit}
					onDelete={id => handleDeleteProduct(id, setProducts)}
				/>

				<ProductModal
					mode={mode}
					isOpen={isOpen}
					initialData={selectedProduct ?? undefined}
					onClose={() => setIsOpen(false)}
					onSubmit={data =>
						handleSubmitProduct(
							mode,
							data,
							selectedProduct,
							setProducts,
							setIsOpen,
						)
					}
				/>
			</div>
		</div>
	)
}

export default Home
