import { NextResponse } from 'next/server'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: any } }
) {
  try {
    const id = params.id

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: any } }
) {
  const id = params.id

  try {
    const data = await request.json()

    // Validate required fields
    if (!data.id || !data.email || !data.password) {
      return NextResponse.json(
        { error: 'Id, email, and password are required' },
        { status: 400 }
      )
    }

    // Update the order
    const updatedOrder = await db
      .update(orders)
      .set({
        userId: data.userId,
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        shippingStatus: data.shippingStatus,
        orderStatus: data.orderStatus,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
      .where(eq(orders.id, id))
      .returning()

    return NextResponse.json(
      { message: 'Order updated successfully', order: updatedOrder[0] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: any } }
) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: 'Id is required' }, { status: 400 })
  }
  try {
    const deletedOrder = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning()

    if (deletedOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Order deleted successfully', order: deletedOrder[0] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}
