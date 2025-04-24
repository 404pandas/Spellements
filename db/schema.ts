import { InferSelectModel, relations } from 'drizzle-orm'
import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  decimal,
  json,
} from 'drizzle-orm/pg-core'

// Enums for issue status, priority, shipping status, and order status
export const statusEnum = pgEnum('status', [
  'backlog',
  'todo',
  'in_progress',
  'done',
])

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high'])

export const shippingStatusEnum = pgEnum('shipping_status', [
  'pending',
  'shipped',
  'delivered',
  'returned',
])

export const orderStatusEnum = pgEnum('order_status', [
  'processing',
  'completed',
  'cancelled',
])

export const orderSizesEnum = pgEnum('order_size', [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
])

// Products table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  material: text('material').notNull(), // e.g., Cotton
  sizes: json('sizes').notNull(), // e.g., ["XS", "S", "M", "L", "XL", "XXL"]
  colors: json('colors').notNull(), // e.g., ["White", "Black"]
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  empire_builder_price: decimal('empire_builder_price', {
    precision: 10,
    scale: 2,
  }).notNull(),
  suggested_sales_price: decimal('suggested_sales_price', {
    precision: 10,
    scale: 2,
  }).notNull(),
  estimated_profit: decimal('estimated_profit', {
    precision: 10,
    scale: 2,
  }).notNull(),
  production_time: text('production_time').notNull(), // e.g., "3-5 business days"
  product_care_instructions: json('product_care_instructions').notNull(), // e.g., ["Machine wash cold", "Do not dry clean", "Tumble dry low", "No chemical cleaners"]
  print_type: text('print_method').notNull(), // e.g., "Direct-to-Garment"
  print_location: text('print_location').notNull(), // e.g., "Front only"
  style: text('style').notNull(), // e.g., "Crew neck, short sleeves, side seamed, unisex fit"
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Orders table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull(),
  total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  shipping_address: text('shipping_address').notNull(),
  shipping_status: shippingStatusEnum('shipping_status')
    .default('pending')
    .notNull(),
  order_status: orderStatusEnum('order_status').default('processing').notNull(), // Added orderStatus
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

// OrderItems table
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: serial('order_id').notNull(),
  productId: serial('product_id').notNull(),
  quantity: serial('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
})

export const elements = pgTable('elements', {
  id: text('id').primaryKey(),
  symbol: text('symbol').notNull().unique(), // e.g., "H"
  name: text('name').notNull(), // e.g., "Hydrogen"
  atomicNumber: serial('atomic_number').notNull(), // e.g., 1
  atomicMass: decimal('atomic_mass', { precision: 8, scale: 4 }).notNull(), // e.g., 1.0079
  group: serial('group').notNull(), // Vertical column (e.g., 1)
  period: serial('period').notNull(), // Horizontal row (e.g., 1)
  category: text('category').notNull(), // e.g., "Nonmetal", "Alkali Metal", "Transition Metal"
  phase: text('phase').notNull(), // e.g., "Gas", "Solid", "Liquid"
  discoveredBy: text('discovered_by'), // e.g., "Henry Cavendish"
  appearance: text('appearance'), // e.g., "Colorless gas"
  density: decimal('density', { precision: 10, scale: 4 }), // e.g., 0.00008988 g/cm³
  meltingPoint: decimal('melting_point', { precision: 10, scale: 2 }), // in Kelvin
  boilingPoint: decimal('boiling_point', { precision: 10, scale: 2 }), // in Kelvin
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relations between tables
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}))

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}))

export const elementsRelations = relations(elements, ({ many }) => ({
  orderItems: many(orderItems), // assuming elements are linked with products
}))

// Types
export type Product = InferSelectModel<typeof products>
export type User = InferSelectModel<typeof users>
export type Order = InferSelectModel<typeof orders>
export type OrderItem = InferSelectModel<typeof orderItems>
export type Element = InferSelectModel<typeof elements>

// Shipping status labels for display
export const SHIPPING_STATUS = {
  pending: { label: 'Pending', value: 'pending' },
  shipped: { label: 'Shipped', value: 'shipped' },
  delivered: { label: 'Delivered', value: 'delivered' },
  returned: { label: 'Returned', value: 'returned' },
}

// Order status labels for display
export const ORDER_STATUS = {
  processing: { label: 'Processing', value: 'processing' },
  completed: { label: 'Completed', value: 'completed' },
  cancelled: { label: 'Cancelled', value: 'cancelled' },
}

// Order item structure
export const ORDER_ITEM = {
  quantity: 1,
  price: 0.0,
}
