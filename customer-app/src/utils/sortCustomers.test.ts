import { beforeEach, describe, expect, it } from 'vitest'
import {
  loadSort,
  saveSort,
  sortCustomers,
  toggleSort,
} from './sortCustomers'
import type { Customer } from '../types/customer'

const base: Omit<Customer, 'id' | 'name' | 'email' | 'city' | 'state'> = {
  phone: '555-0100',
  address: '1 Main St',
  zip: '00000',
}

const customers: Customer[] = [
  { id: 1, name: 'Maria Garcia', email: 'maria@example.com', city: 'Springfield', state: 'IL', ...base },
  { id: 2, name: 'james chen', email: 'james@example.com', city: 'Washington', state: 'DC', ...base },
  { id: 3, name: 'Aisha Patel', email: 'aisha@example.com', city: 'Austin', state: 'TX', ...base },
]

describe('sortCustomers', () => {
  it('returns the list unchanged when sort is null', () => {
    expect(sortCustomers(customers, null)).toEqual(customers)
  })

  it('sorts ascending by name, case-insensitively', () => {
    const sorted = sortCustomers(customers, { key: 'name', direction: 'asc' })
    expect(sorted.map((c) => c.id)).toEqual([3, 2, 1])
  })

  it('sorts descending by state', () => {
    const sorted = sortCustomers(customers, { key: 'state', direction: 'desc' })
    expect(sorted.map((c) => c.state)).toEqual(['TX', 'IL', 'DC'])
  })

  it('does not mutate the input array', () => {
    const original = [...customers]
    sortCustomers(customers, { key: 'city', direction: 'asc' })
    expect(customers).toEqual(original)
  })
})

describe('toggleSort', () => {
  it('starts ascending on a new column', () => {
    expect(toggleSort(null, 'name')).toEqual({ key: 'name', direction: 'asc' })
    expect(toggleSort({ key: 'city', direction: 'desc' }, 'name')).toEqual({
      key: 'name',
      direction: 'asc',
    })
  })

  it('flips direction when the same column is toggled', () => {
    expect(toggleSort({ key: 'name', direction: 'asc' }, 'name')).toEqual({
      key: 'name',
      direction: 'desc',
    })
    expect(toggleSort({ key: 'name', direction: 'desc' }, 'name')).toEqual({
      key: 'name',
      direction: 'asc',
    })
  })
})

describe('sort persistence', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('round-trips a sort through sessionStorage', () => {
    saveSort({ key: 'email', direction: 'desc' })
    expect(loadSort()).toEqual({ key: 'email', direction: 'desc' })
  })

  it('returns null when nothing is stored', () => {
    expect(loadSort()).toBeNull()
  })

  it('returns null for malformed or invalid stored values', () => {
    sessionStorage.setItem('customer-list-sort', 'not json')
    expect(loadSort()).toBeNull()

    sessionStorage.setItem(
      'customer-list-sort',
      JSON.stringify({ key: 'phone', direction: 'asc' }),
    )
    expect(loadSort()).toBeNull()
  })
})
