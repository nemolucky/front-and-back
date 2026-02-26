import { nanoid } from 'nanoid'

const ProductCategory = {
	ELECTRONICS: 'ELECTRONICS',
	FOOD: 'FOOD',
	CLOTHING: 'CLOTHING',
	OTHER: 'OTHER',
} as const

export type ProductCategory =
	(typeof ProductCategory)[keyof typeof ProductCategory]

export interface IProduct {
	id: string
	title: string
	description: string
	category: ProductCategory
	price: number
	leftInStock: number
	image: string
}

export const PRODUCTS: IProduct[] = [
	{
		id: nanoid(6),
		title: 'Wireless Headphones',
		description: 'Noise cancelling over-ear headphones',
		category: ProductCategory.ELECTRONICS,
		price: 120,
		leftInStock: 15,
		image:
			'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=800&q=80',
	},
	{
		id: nanoid(6),
		title: 'Smartphone',
		description: 'Latest generation smartphone',
		category: ProductCategory.ELECTRONICS,
		price: 899,
		leftInStock: 8,
		image:
			'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
	},
	{
		id: nanoid(6),
		title: 'T-Shirt',
		description: '100% cotton oversized t-shirt',
		category: ProductCategory.CLOTHING,
		price: 25,
		leftInStock: 40,
		image:
			'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
	},
	{
		id: nanoid(6),
		title: 'Chocolate Bar',
		description: 'Dark chocolate 85% cocoa',
		category: ProductCategory.FOOD,
		price: 3,
		leftInStock: 100,
		image:
			'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
	},
	{
		id: nanoid(6),
		title: 'Office Chair',
		description: 'Ergonomic office chair',
		category: ProductCategory.OTHER,
		price: 180,
		leftInStock: 6,
		image:
			'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80',
	},
]
