import { useCallback, useEffect, useState } from 'react'
import { useCustomerContext } from '../context/useCustomerContext'
import type { Customer, CustomerFormData } from '../types/customer'

const BASE_URL = '/api/customers'

export function useCustomerApi() {
  const { state, dispatch } = useCustomerContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async () => {
    const response = await fetch(BASE_URL)
    if (!response.ok) {
      throw new Error(`Failed to load customers (${response.status})`)
    }
    const data: Customer[] = await response.json()
    dispatch({ type: 'SET_CUSTOMERS', payload: data })
  }, [dispatch])

  const run = useCallback(
    async (operation: () => Promise<void>): Promise<boolean> => {
      setLoading(true)
      setError(null)
      try {
        await operation()
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchCustomers()
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [fetchCustomers])

  const addCustomer = useCallback(
    (formData: CustomerFormData) =>
      run(async () => {
        const response = await fetch(BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (!response.ok) {
          throw new Error(`Failed to add customer (${response.status})`)
        }
        await fetchCustomers()
      }),
    [run, fetchCustomers],
  )

  const updateCustomer = useCallback(
    (customer: Customer) =>
      run(async () => {
        const response = await fetch(`${BASE_URL}/${customer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer),
        })
        if (!response.ok) {
          throw new Error(`Failed to update customer (${response.status})`)
        }
        await fetchCustomers()
      }),
    [run, fetchCustomers],
  )

  const deleteCustomer = useCallback(
    (id: number) =>
      run(async () => {
        const response = await fetch(`${BASE_URL}/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error(`Failed to delete customer (${response.status})`)
        }
        await fetchCustomers()
      }),
    [run, fetchCustomers],
  )

  return {
    customers: state.customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
