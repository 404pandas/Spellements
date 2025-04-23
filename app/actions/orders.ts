// src/app/api/orders/actions.ts
'use server'

import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

// Create a new order
export async function createOrder(data: {
  userId: string
  totalAmount: string
  shippingAddress: string
  shippingStatus: string
  orderStatus: string
  createdAt: Date
  updatedAt: Date
}) {
  try {
    const newOrder = await db
      .insert(orders)
      .values({
        id: uuidv4(), // required by the schema
        userId: data.userId, // pass this from the frontend        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        shippingStatus: data.shippingStatus,
        orderStatus: data.orderStatus,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .returning()

    revalidatePath('/orders') // Adjust as needed for your app
    return newOrder[0]
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('Failed to create order')
  }
}

// Get all orders
export async function getAllOrders() {
  try {
    const allOrders = await db.query.orders.findMany()
    return allOrders
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

// Get a specific order by ID
export async function getOrderById(id: string) {
  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, id))
    return order
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error)
    throw new Error('Failed to fetch order')
  }
}

// Delete an order by ID
export async function deleteOrder(id: string) {
  try {
    const deleted = await db.delete(orders).where(eq(orders.id, id)).returning()

    revalidatePath('/orders') // Update path to reflect UI changes
    return deleted[0]
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error)
    throw new Error('Failed to delete order')
  }
}
