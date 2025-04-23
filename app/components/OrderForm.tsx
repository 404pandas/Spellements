'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Order, SHIPPING_STATUS } from '@/db/schema'
import Button from './ui/Button'
import { Form, FormGroup, FormLabel, FormSelect, FormError } from './ui/Form'
import {
  createOrder,
  updateOrder,
  ActionResponse,
} from '@/app/actions/orders.js'

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
    // Extract data from form
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as
        | 'backlog'
        | 'todo'
        | 'in_progress'
        | 'done',
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      userId,
    }

    try {
      // Call the appropriate action based on whether we're editing or creating
      const result = isEditing
        ? await updateOrder(Number(order!.id), data)
        : await createOrder(data)

      // Handle successful submission
      if (result.success) {
        router.refresh()
        if (!isEditing) {
          router.push('/dashboard')
        }
      }

      return result
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'An error occurred',
        errors: undefined,
      }
    }
  }, initialState)

  const statusOptions = Object.values(SHIPPING_STATUS).map(
    ({ label, value }) => ({
      label,
      value,
    })
  )

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
        <FormGroup>
          <FormLabel htmlFor="status">Status</FormLabel>
          <FormSelect
            id="status"
            name="status"
            defaultValue={order?.orderStatus || 'backlog'}
            options={statusOptions}
            disabled={isPending}
            required
            aria-describedby="status-error"
            className={state?.errors?.status ? 'border-red-500' : ''}
          />
          {state?.errors?.status && (
            <p id="status-error" className="text-sm text-red-500">
              {state.errors.status[0]}
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
