import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.email || !data.password || !data.createdAt) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      )
    }

    // Create the user
    const newUser = await db
      .insert(users)
      .values({
        id: data.id,
        email: data.email,
        password: data.password,
        createdAt: data.createdAt,
      })
      .returning()

    return NextResponse.json(
      { message: 'User created successfully', user: newUser[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
