import { apiProduct } from '../api/products.api'
import { IProduct } from './product.interface'

export const loadProducts = async (
	setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
	try {
		const data = await apiProduct.getProducts()
		setProducts(data)
	} finally {
		setLoading(false)
	}
}

export const handleDeleteProduct = async (
	id: string,
	setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>,
) => {
	const ok = window.confirm('Удалить товар?')
	if (!ok) return

	const res = await apiProduct.deleteProduct(id)
	if (!res) throw new Error('Failed to delete product')

	setProducts(prev => prev.filter(p => p.id !== id))
}

export const handleSubmitProduct = async (
	mode: 'create' | 'edit',
	data: IProduct,
	selectedProduct: IProduct | null,
	setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>,
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
	if (mode === 'create') {
		const newProduct = await apiProduct.createProduct(data)
		if (!newProduct) throw new Error('Failed to create')

		setProducts(prev => [...prev, newProduct])
	}

	if (mode === 'edit' && selectedProduct) {
		const updatedProduct = await apiProduct.updateProduct(
			selectedProduct.id,
			data,
		)

		if (!updatedProduct) throw new Error('Failed to update')

		setProducts(prev =>
			prev.map(p => (p.id === selectedProduct.id ? updatedProduct : p)),
		)
	}

	setIsOpen(false)
}
