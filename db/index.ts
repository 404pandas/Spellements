import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import { neon } from '@neondatabase/serverless'

import * as schema from './schema'

import 'dotenv/config'

console.log(process.env.DATABASE_URL)
export const db = process.env.VERCEL
  ? drizzleNeon({
      client: neon(process.env.DATABASE_URL!),
      schema,
      casing: 'snake_case',
    })
  : drizzlePostgres(process.env.DATABASE_URL!, { schema, casing: 'snake_case' })
