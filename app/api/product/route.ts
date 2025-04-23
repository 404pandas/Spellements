import { NextResponse } from 'next/server'
import { db } from '@/db'

export async function GET() {
  try {
    const allProducts = await db.query.products.findMany()
    return NextResponse.json(allProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
