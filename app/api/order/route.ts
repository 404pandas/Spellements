import { NextResponse } from 'next/server'
import { orders } from '@/db/schema'
import { db } from '@/db'

import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const allOrders = await db.query.orders.findMany()
    return NextResponse.json(allOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (
      !data.userId ||
      !data.totalAmount ||
      !data.shippingAddress ||
      !data.shippingStatus ||
      !data.orderStatus ||
      !data.createdAt ||
      !data.updatedAt
    ) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      )
    }

    // Create the order
    const newOrder = await db
      .insert(orders)
      .values({
        id: uuidv4(), // This allows DB to auto-generate UUID
        userId: data.userId,
        totalAmount: data.totalAmount || null,
        shippingAddress: data.shippingAddress,
        shippingStatus: data.shippingStatus,
        orderStatus: data.orderStatus,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .returning()

    return NextResponse.json(
      { message: 'Order created successfully', order: newOrder[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
