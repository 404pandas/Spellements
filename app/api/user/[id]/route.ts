import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: any } }
) {
  try {
    const id = params.id

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
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

    // Update the user
    const updatedUser = await db
      .update(users)
      .set({
        email: data.email,
        password: data.password,
      })
      .where(eq(users.id, id))
      .returning()

    return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser[0] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
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
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning()

    if (deletedUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'User deleted successfully', user: deletedUser[0] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
