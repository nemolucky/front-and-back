export const ProductCategory = {
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
}
