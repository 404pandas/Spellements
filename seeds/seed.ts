import { elementSeeds } from '@/seeds/element-seeds'
import { userSeeds } from '@/seeds/user-seeds'
import { productSeeds } from '@/seeds/product-seeds' // Assuming you have a product seed file
import { db } from '../db'
import { elements, Element } from '../db/schema'
import { users, User } from '../db/schema'
import { products, Product } from '../db/schema'
import { orders, Order } from '../db/schema'

import { v4 as uuidv4 } from 'uuid'

const elementData: Element[] = elementSeeds.map((element) => ({
  id: uuidv4(), // Generate a unique ID for each element
  symbol: element.symbol,
  name: element.name,
  atomicNumber: element.atomicNumber,
  atomicMass: element.atomicMass.toString(), // Ensure it's a string
  group: element.group,
  period: element.period,
  category: element.category,
  phase: element.phase,
  discoveredBy: element.discoveredBy || null, // Allow null if not provided
  appearance: element.appearance || null, // Allow null if not provided
  density: element.density.toString() || null, // Allow null if not provided
  meltingPoint: element.meltingPoint.toString() || null, // Allow null if not provided
  boilingPoint: element.boilingPoint.toString() || null, // Allow null if not provided
  createdAt: new Date(),
  updatedAt: new Date(),
}))

const userData: User[] = userSeeds.map((user) => ({
  id: uuidv4(), // Generate a unique ID for each user
  email: user.email,
  password: user.password,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

const productData: Product[] = productSeeds.map((product) => ({
  id: uuidv4(), // Generate a unique ID for each product
  name: product.name,
  description: product.description,
  material: product.material,
  sizes: product.sizes,
  colors: product.colors,
  price: product.price.toString(),
  empire_builder_price: product.empire_builder_price.toString(),
  suggested_sales_price: product.suggested_sales_price.toString(),
  estimated_profit: product.estimated_profit.toString(),
  production_time: product.production_time,
  product_care_instructions: product.product_care_instructions,
  style: product.style,
  print_type: product.print_type,
  print_location: product.print_location,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

// Assuming orders require a userId to be assigned randomly
const orderData: Order[] = userData.map((user, index) => {
  const randomProduct =
    productData[Math.floor(Math.random() * productData.length)]
  const totalAmount = randomProduct.price + '1000' // Random total for demonstration
  const id = uuidv4() // Generate a unique ID for each order
  return {
    id: id, // Generate a unique ID for each product

    userId: user.id,
    totalAmount: totalAmount, // Ensure the total is a string with 2 decimals
    shippingAddress: `Random Address ${index + 1}, City, State, Zip ${
      index + 1
    }`,
    shippingStatus: 'pending', // Default shipping status
    orderStatus: 'processing', // Default order status
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})

async function main() {
  console.log('Starting database seeding...')

  // Delete existing data to ensure a clean slate
  await db.delete(orders)
  await db.delete(users)
  await db.delete(elements)
  await db.delete(products)

  // Insert new users, elements, products, and orders into the database
  await db.insert(users).values(userData).returning()
  await db.insert(orders).values(orderData).returning()
  await db.insert(elements).values(elementData).returning()
  await db.insert(products).values(productData).returning()

  console.log(`Created ${userData.length} users`)
  console.log(`Created ${elementData.length} elements`)
  console.log(`Created ${productData.length} products`)
  console.log(`Created ${orderData.length} orders`)

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Seed script finished')
  })
