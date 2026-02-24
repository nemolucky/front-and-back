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
}

export const PRODUCTS: IProduct[] = [
	{
		id: nanoid(6),
		title: 'Wireless Headphones',
		description: 'Noise cancelling over-ear headphones',
		category: ProductCategory.ELECTRONICS,
		price: 120,
		leftInStock: 15,
	},
	{
		id: nanoid(6),
		title: 'Smartphone',
		description: 'Latest generation smartphone',
		category: ProductCategory.ELECTRONICS,
		price: 899,
		leftInStock: 8,
	},
	{
		id: nanoid(6),
		title: 'Gaming Mouse',
		description: 'RGB high precision gaming mouse',
		category: ProductCategory.ELECTRONICS,
		price: 59,
		leftInStock: 25,
	},
	{
		id: nanoid(6),
		title: 'T-Shirt',
		description: '100% cotton oversized t-shirt',
		category: ProductCategory.CLOTHING,
		price: 25,
		leftInStock: 40,
	},
	{
		id: nanoid(6),
		title: 'Jeans',
		description: 'Slim fit blue jeans',
		category: ProductCategory.CLOTHING,
		price: 70,
		leftInStock: 18,
	},
	{
		id: nanoid(6),
		title: 'Sneakers',
		description: 'Comfortable everyday sneakers',
		category: ProductCategory.CLOTHING,
		price: 95,
		leftInStock: 12,
	},
	{
		id: nanoid(6),
		title: 'Chocolate Bar',
		description: 'Dark chocolate 85% cocoa',
		category: ProductCategory.FOOD,
		price: 3,
		leftInStock: 100,
	},
	{
		id: nanoid(6),
		title: 'Organic Coffee',
		description: 'Premium roasted coffee beans',
		category: ProductCategory.FOOD,
		price: 18,
		leftInStock: 35,
	},
	{
		id: nanoid(6),
		title: 'Protein Bars Pack',
		description: 'Box of 12 protein bars',
		category: ProductCategory.FOOD,
		price: 22,
		leftInStock: 50,
	},
	{
		id: nanoid(6),
		title: 'Laptop Backpack',
		description: 'Water resistant backpack',
		category: ProductCategory.OTHER,
		price: 45,
		leftInStock: 20,
	},
	{
		id: nanoid(6),
		title: 'Desk Lamp',
		description: 'LED adjustable desk lamp',
		category: ProductCategory.OTHER,
		price: 30,
		leftInStock: 27,
	},
	{
		id: nanoid(6),
		title: 'Bluetooth Speaker',
		description: 'Portable waterproof speaker',
		category: ProductCategory.ELECTRONICS,
		price: 75,
		leftInStock: 16,
	},
	{
		id: nanoid(6),
		title: 'Jacket',
		description: 'Winter insulated jacket',
		category: ProductCategory.CLOTHING,
		price: 150,
		leftInStock: 9,
	},
	{
		id: nanoid(6),
		title: 'Energy Drink',
		description: 'Sugar-free energy drink',
		category: ProductCategory.FOOD,
		price: 2,
		leftInStock: 200,
	},
	{
		id: nanoid(6),
		title: 'Office Chair',
		description: 'Ergonomic office chair',
		category: ProductCategory.OTHER,
		price: 180,
		leftInStock: 6,
	},
]
