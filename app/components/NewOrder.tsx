import { redirect } from 'next/navigation'
import OrderForm from './OrderForm'
import { getCurrentUser } from '@/lib/dal'

const NewOrder = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/signin')
  }

  return <OrderForm userId={user.id} />
}

export default NewOrder
