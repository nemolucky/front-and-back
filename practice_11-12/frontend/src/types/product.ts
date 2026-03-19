export type ProductCategory = 'ELECTRONICS' | 'FOOD' | 'CLOTHING' | 'OTHER'

export interface Product {
  id: string
  title: string
  description: string
  category: ProductCategory
  price: number
  leftInStock: number
  image: string
}

export type ProductInput = Omit<Product, 'id'>
