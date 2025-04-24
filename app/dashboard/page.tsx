import { getCurrentUser, getOrders } from '@/lib/dal'
import Link from 'next/link'
import Button from '../components/ui/Button'
import { PlusIcon } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

export default async function DashboardPage() {
  await getCurrentUser()
  const orders = await getOrders()

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Orders
        </h1>
        <Link href="/orders/new">
          <Button>
            <span className="flex items-center">
              <PlusIcon size={18} className="mr-2" />
              New Order
            </span>
          </Button>
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-dark-border-default bg-white dark:bg-dark-high shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-dark-elevated border-b border-gray-200 dark:border-dark-border-default">
            <div className="col-span-4">Order ID</div>
            <div className="col-span-4">Customer</div>
            <div className="col-span-4">Created</div>
          </div>

          {/* Order list */}
          <div className="divide-y divide-gray-100 dark:divide-dark-border-default">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-4 font-medium text-gray-800 dark:text-white truncate">
                    {order.id}
                  </div>
                  <div className="col-span-4 text-gray-700 dark:text-gray-300 truncate">
                    {order.user?.email || '—'}
                  </div>
                  <div className="col-span-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(new Date(order.created_at))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 dark:border-dark-border-default rounded-2xl bg-white dark:bg-dark-high p-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Get started by creating your first order.
          </p>
          <Link href="/orders/new">
            <Button>
              <span className="flex items-center">
                <PlusIcon size={18} className="mr-2" />
                Create Order
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
