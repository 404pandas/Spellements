// src/app/api/orders/actions.ts
'use server'

import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'
import { getCurrentUser } from '@/lib/dal'
import { z } from 'zod'

// Define Zod schema for issue validation
const shippingStatusEnum = z.enum(
  ['pending', 'shipped', 'delivered', 'returned'],
  {
    errorMap: () => ({ message: 'Please select a valid shipping status' }),
  }
)

const orderStatusEnum = z.enum(['processing', 'completed', 'cancelled'], {
  errorMap: () => ({ message: 'Please select a valid order status' }),
})

// Updated OrderSchema
const OrderSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  total_amount: z.string().refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
    message: 'Total amount must be a valid decimal with up to 2 decimal places',
  }),
  shipping_address: z.string().min(1, 'Shipping address is required'),

  shipping_status: shippingStatusEnum.default('pending'),
  order_status: orderStatusEnum.default('processing'),
})

export type OrderData = z.infer<typeof OrderSchema>

// Create a new order
export async function createOrder(data: OrderData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized access',
        error: 'Unauthorized',
      }
    }

    // Validate with Zod
    const validationResult = OrderSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const validatedData = validationResult.data

    const newOrder = await db
      .insert(orders)
      .values({
        id: uuidv4(), // Generate a unique UUID for the order ID
        user_id: validatedData.user_id,
        total_amount: validatedData.total_amount,
        shipping_address: validatedData.shipping_address,
        shipping_status: validatedData.shipping_status,
        order_status: validatedData.order_status,
      })
      .returning()

    revalidatePath('/orders') // Adjust as needed for your app
    return {
      success: true,
      message: 'Order created successfully',
      data: newOrder[0],
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating order:', error)
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message, // Now TypeScript knows `error` has a `message` property
      }
    }
    // If it's not an instance of `Error`, handle it in a way that makes sense (e.g., return a generic message)
    console.error('Unknown error creating order:', error)
    return {
      success: false,
      message: 'Failed to create order',
      error: 'An unknown error occurred',
    }
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
export async function deleteOrder(id: string): Promise<ActionResponse> {
  try {
    const deleted = await db.delete(orders).where(eq(orders.id, id)).returning()

    revalidatePath('/orders') // Update path to reflect UI changes

    if (!deleted.length) {
      return {
        success: false,
        message: 'Order not found or already deleted',
        error: 'Not found',
      }
    }

    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error)

    return {
      success: false,
      message: 'Failed to delete order',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Update an order by ID
export async function updateOrder(id: string, data: OrderData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized access',
        error: 'Unauthorized',
      }
    }

    // Validate with Zod
    const validationResult = OrderSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const validatedData = validationResult.data

    const updatedOrder = await db
      .update(orders)
      .set({
        total_amount: validatedData.total_amount,
        shipping_address: validatedData.shipping_address,
        shipping_status: validatedData.shipping_status,
        order_status: validatedData.order_status,
      })
      .where(eq(orders.id, id))
      .returning()

    revalidatePath('/orders') // Adjust as needed for your app
    return {
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder[0],
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating order:', error)
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message, // Now TypeScript knows `error` has a `message` property
      }
    }
    // If it's not an instance of `Error`, handle it in a way that makes sense (e.g., return a generic message)
    console.error('Unknown error creating order:', error)
    return {
      success: false,
      message: 'Failed to create order',
      error: 'An unknown error occurred',
    }
  }
}
// ActionResponse type for form submission
export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string>
  error?: string
}
