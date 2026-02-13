export interface Product {
	id: number
	title: string
	price: number
}

export const PRODUCTS: Product[] = [
	{
		id: 1,
		title: 'Пирожок',
		price: 10,
	},
	{
		id: 2,
		title: 'Булочка',
		price: 12,
	},
	{
		id: 3,
		title: 'Круассан',
		price: 18,
	},
	{
		id: 4,
		title: 'Пончик',
		price: 15,
	},
	{
		id: 5,
		title: 'Чизкейк',
		price: 35,
	},
]
