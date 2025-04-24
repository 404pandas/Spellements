import { Order } from '@/db/schema'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card'

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const { id, total_amount, created_at, user_id } = order

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
            <span className="font-medium">Customer:</span> {user_id || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Total:</span> ${total_amount}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-gray-500">
          Placed {formatRelativeTime(new Date(created_at))}
        </CardFooter>
      </Card>
    </Link>
  )
}
