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
  material: string // e.g. Cotton
  sizes: string[] // e.g. ["XS" "S" "M" "L" "XL" "XXL"]
  colors: string[] // e.g. ["White" "Black"]
  price: number
  empire_builder_price: number
  suggested_sales_price: number
  estimated_profit: number
  production_time: string // e.g. "3-5 business days"
  product_care_instructions: string[] // e.g. ["Machine wash cold" "Do not dry clean" "Tumble dry low" "No chemical cleaners"]
  print_type: string // e.g. "Direct-to-Garment"
  print_location: string // e.g. "Front only"
  style: string // e.g. "Crew neck short sleeves side seamed unisex fit"
  createdAt: string | Date
  updatedAt: string | Date
}
