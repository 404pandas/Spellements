import { Order } from '@/db/schema'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card'

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const { id, totalAmount, createdAt, userId } = order

  return (
    <Link href={`/orders/${id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Order #{id.slice(0, 8)} {/* short UUID */}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-medium">Customer:</span> {userId || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Total:</span> ${totalAmount}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-gray-500">
          Placed {formatRelativeTime(new Date(createdAt))}
        </CardFooter>
      </Card>
    </Link>
  )
}
