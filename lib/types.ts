export type Status = 'backlog' | 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export type ProductWithUser = Product & {
  user: {
    id: string
    email: string
  }
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  material: string
  sizes: string[] // Array of size names like ["S", "M", "L"]
  printMethod: string
  printLocation: string
  style: string
  careInstructions: string[] // Array of instruction strings like ["Machine wash cold", "Do not bleach"]
  createdAt?: string | Date
  updatedAt?: string | Date
}
