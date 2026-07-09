import { describe, expect, it } from 'vitest'
import { filterCustomers } from './filterCustomers'
import type { Customer } from '../types/customer'

const customers: Customer[] = [
  {
    id: 1,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '555-0101',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
  },
  {
    id: 2,
    name: 'James Chen',
    email: 'james.chen@example.com',
    phone: '555-0102',
    address: '1600 Pennsylvania Ave',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    email: 'aisha.patel@example.com',
    phone: '555-0103',
    address: '1 Congress Ave',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
  },
]

describe('filterCustomers', () => {
  it('returns all customers for an empty or whitespace-only query', () => {
    expect(filterCustomers(customers, '')).toEqual(customers)
    expect(filterCustomers(customers, '   ')).toEqual(customers)
  })

  it('matches by name, case-insensitively', () => {
    expect(filterCustomers(customers, 'maria')).toEqual([customers[0]])
    expect(filterCustomers(customers, 'CHEN')).toEqual([customers[1]])
  })

  it('matches by email', () => {
    expect(filterCustomers(customers, 'aisha.patel@')).toEqual([customers[2]])
  })

  it('matches by city', () => {
    expect(filterCustomers(customers, 'spring')).toEqual([customers[0]])
  })

  it('can match multiple customers with one query', () => {
    // "in" appears in Springfield, Washington, and Austin
    expect(filterCustomers(customers, 'in')).toEqual(customers)
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterCustomers(customers, 'zzz')).toEqual([])
  })

  it('does not match on fields outside name, email, and city', () => {
    // phone and zip are not searched
    expect(filterCustomers(customers, '555-0101')).toEqual([])
    expect(filterCustomers(customers, '62704')).toEqual([])
  })
})
