import { getOrder } from '@/lib/dal'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Button from '@/app/components/ui/Button'
import { ArrowLeftIcon, Edit2Icon } from 'lucide-react'
import DeleteOrderButton from '../../components/DeleteOrderButton.js'

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  const {
    totalAmount,
    shippingAddress,
    shippingStatus,
    orderStatus,
    createdAt,
    updatedAt,
    user,
  } = order

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">{orderStatus}</h1>
          <div className="flex items-center space-x-2">
            <Link href={`/orders/${id}/edit`}>
              <Button variant="outline" size="sm">
                <span className="flex items-center">
                  <Edit2Icon size={16} className="mr-1" />
                  Edit
                </span>
              </Button>
            </Link>
            <DeleteOrderButton id={id} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="text-sm text-gray-500">
            Created {formatRelativeTime(new Date(createdAt))}
          </div>
          {updatedAt !== createdAt && (
            <div className="text-sm text-gray-500">
              Updated {formatRelativeTime(new Date(updatedAt))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-2">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Assigned to
            </p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total</p>
            <p>${totalAmount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Shipping</p>
            <p>{shippingAddress}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Shipping Status
            </p>
            <p>{shippingStatus}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
