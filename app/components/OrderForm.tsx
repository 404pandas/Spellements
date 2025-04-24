'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Order } from '@/db/schema'
import Button from './ui/Button'
import {
  Form,
  FormGroup,
  FormLabel,
  FormSelect,
  FormInput,
  FormError,
} from './ui/Form'
import { createOrder, updateOrder, ActionResponse } from '@/app/actions/orders'

interface OrderFormProps {
  order?: Order
  userId: string
  isEditing?: boolean
}

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

export default function OrderForm({
  order,
  userId,
  isEditing = false,
}: OrderFormProps) {
  const router = useRouter()

  // Use useActionState hook for the form submission action
  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    const data = {
      total_amount: formData.get('total_amount') as string,
      shipping_address: formData.get('shipping_address') as string,
      shipping_status: formData.get('shipping_status') as
        | 'pending'
        | 'shipped'
        | 'delivered'
        | 'returned',
      order_status: formData.get('order_status') as
        | 'processing'
        | 'completed'
        | 'cancelled',
      user_id: userId,
    }

    try {
      // Call the appropriate action based on whether we're editing or creating
      const result = isEditing
        ? await updateOrder(order!.id, data)
        : await createOrder(data)

      // Return a result matching the ActionResponse interface
      if (result.success) {
        return {
          success: true,
          message: isEditing
            ? 'Order updated successfully'
            : 'Order created successfully',
          errors: undefined,
        }
      }

      return {
        success: false,
        message: 'Failed to process the order',
        errors: undefined,
      }
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'An error occurred',
        errors: undefined,
      }
    }
  }, initialState)

  const shippingStatusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Returned', value: 'returned' },
  ]

  const orderStatusOptions = [
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  return (
    <Form action={formAction}>
      {state?.message && (
        <FormError
          className={`mb-4 ${
            state.success ? 'bg-green-100 text-green-800 border-green-300' : ''
          }`}
        >
          {state.message}
        </FormError>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Amount Field */}
        <FormGroup>
          <FormLabel htmlFor="total_amount">Total Amount</FormLabel>
          <FormInput
            id="total_amount"
            name="total_amount"
            type="text"
            defaultValue={order?.total_amount || ''}
            required
            aria-describedby="total_amount-error"
            className={state?.errors?.total_amount ? 'border-red-500' : ''}
          />
          {state?.errors?.total_amount && (
            <p id="total_amount-error" className="text-sm text-red-500">
              {state.errors.total_amount[0]}
            </p>
          )}
        </FormGroup>

        {/* Shipping Address Field */}
        <FormGroup>
          <FormLabel htmlFor="shipping_address">Shipping Address</FormLabel>
          <FormInput
            id="shipping_address"
            name="shipping_address"
            type="text"
            defaultValue={order?.shipping_address || ''}
            required
            aria-describedby="shipping_address-error"
            className={state?.errors?.shipping_address ? 'border-red-500' : ''}
          />
          {state?.errors?.shipping_address && (
            <p id="shipping_address-error" className="text-sm text-red-500">
              {state.errors.shipping_address[0]}
            </p>
          )}
        </FormGroup>

        {/* Shipping Status Select */}
        <FormGroup>
          <FormLabel htmlFor="shipping_status">Shipping Status</FormLabel>
          <FormSelect
            id="shipping_status"
            name="shipping_status"
            defaultValue={order?.shipping_status || 'pending'}
            options={shippingStatusOptions}
            disabled={isPending}
            required
            aria-describedby="shipping_status-error"
            className={state?.errors?.shipping_status ? 'border-red-500' : ''}
          />
          {state?.errors?.shipping_status && (
            <p id="shipping_status-error" className="text-sm text-red-500">
              {state.errors.shipping_status[0]}
            </p>
          )}
        </FormGroup>

        {/* Order Status Select */}
        <FormGroup>
          <FormLabel htmlFor="order_status">Order Status</FormLabel>
          <FormSelect
            id="order_status"
            name="order_status"
            defaultValue={order?.order_status || 'processing'}
            options={orderStatusOptions}
            disabled={isPending}
            required
            aria-describedby="order_status-error"
            className={state?.errors?.order_status ? 'border-red-500' : ''}
          />
          {state?.errors?.order_status && (
            <p id="order_status-error" className="text-sm text-red-500">
              {state.errors.order_status[0]}
            </p>
          )}
        </FormGroup>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Update Order' : 'Create Order'}
        </Button>
      </div>
    </Form>
  )
}
