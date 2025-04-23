import { NextResponse } from 'next/server'
import { db } from '@/db'
import { products } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: any } }
) {
  try {
    const id = params.id

    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
