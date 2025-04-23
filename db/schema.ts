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
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stockQuantity: serial('stock_quantity').notNull(),
  material: text('material').notNull(), // e.g., Cotton
  sizes: json('sizes').notNull(), // e.g., ["XS", "S", "M", "L", "XL", "XXL"]
  printMethod: text('print_method').notNull(), // e.g., "Direct-to-Garment"
  printLocation: text('print_location').notNull(), // e.g., "Front only"
  style: text('style').notNull(), // e.g., "Crew neck, short sleeves, side seamed, unisex fit"
  careInstructions: json('care_instructions').notNull(), // e.g., ["Machine wash cold", "Do not dry clean", "Tumble dry low", "No chemical cleaners"]
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
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text('shipping_address').notNull(),
  shippingStatus: shippingStatusEnum('shipping_status')
    .default('pending')
    .notNull(),
  orderStatus: orderStatusEnum('order_status').default('processing').notNull(), // Added orderStatus
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// OrderItems table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: serial('order_id').notNull(),
  productId: serial('product_id').notNull(),
  quantity: serial('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
})

export const elements = pgTable('elements', {
  id: serial('id').primaryKey(),
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
    fields: [orders.userId],
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
