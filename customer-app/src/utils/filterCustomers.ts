import type { Customer } from '../types/customer'

export function filterCustomers(
  customers: Customer[],
  query: string,
): Customer[] {
  const q = query.trim().toLowerCase()
  if (!q) return customers
  return customers.filter((customer) =>
    [customer.name, customer.email, customer.city].some((field) =>
      field.toLowerCase().includes(q),
    ),
  )
}
