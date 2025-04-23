import { db } from '@/db'
import { getSession } from './auth'
import { eq } from 'drizzle-orm'
import { cache } from 'react'
import { orders, users } from '@/db/schema'
import { mockDelay } from './utils'
import { unstable_cacheTag as cacheTag } from 'next/cache'

// Current user
export const getCurrentUser = cache(async () => {
  const session = await getSession()
  if (!session) return null

  // Skip database query during prerendering if we don't have a session
  // hack until we have PPR https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
  if (
    typeof window === 'undefined' &&
    process.env.NEXT_PHASE === 'phase-production-build'
  ) {
    return null
  }

  await mockDelay(700)
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))

    return result[0] || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
})

// Fetcher functions for React Query
export async function getOrder(id: number) {
  try {
    await mockDelay(700)
    const result = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        user: true,
      },
    })
    return result
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error)
    throw new Error('Failed to fetch order')
  }
}

export async function getOrders() {
  'use cache'
  cacheTag('orders')
  try {
    await mockDelay(700)
    const result = await db.query.orders.findMany({
      with: {
        user: true,
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    })
    return result
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

export async function getAllProducts() {
  'use cache'
  cacheTag('products')
  try {
    await mockDelay(700)
    const result = await db.query.products.findMany({
      orderBy: (products, { asc }) => [asc(products.id)],
    })
    return result.map((product) => ({
      ...product,
      price: Number(product.price),
      stockQuantity: Number(product.stockQuantity),
      sizes: product.sizes as string[],
      careInstructions: product.careInstructions as string[],
      createdAt: product.createdAt?.toString(),
      updatedAt: product.updatedAt?.toString(),
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}
