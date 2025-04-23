import { elementSeeds } from '@/seeds/element-seeds'
import { userSeeds } from '@/seeds/user-seeds'
import { db } from '../db'
import { elements, Element } from '../db/schema'
import { users, User } from '../db/schema'

import { v4 as uuidv4 } from 'uuid'

const elementData: Element[] = elementSeeds.map((element) => ({
  id: parseInt(uuidv4()), // Generate a unique ID for each element
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
  id: uuidv4().toString(), // Generate a unique ID for each user
  email: user.email,
  password: user.password,
  createdAt: new Date(),
  updatedAt: new Date(),
}))

async function main() {
  console.log('Starting database seeding for elements...')

  await db.delete(users)
  await db.insert(users).values(userData).returning()

  // Clean up existing data in the elements table
  await db.delete(elements)

  // Bulk insert all elements into the elements table
  await db.insert(elements).values(elementData).returning()

  console.log(`Created ${elementData.length} elements`)

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
