import type { Customer } from '../types/customer'

export type SortKey = 'name' | 'email' | 'city' | 'state'
export type SortDirection = 'asc' | 'desc'
export type CustomerSort = { key: SortKey; direction: SortDirection }

const SORT_KEYS: SortKey[] = ['name', 'email', 'city', 'state']
const STORAGE_KEY = 'customer-list-sort'

export function sortCustomers(
  customers: Customer[],
  sort: CustomerSort | null,
): Customer[] {
  if (!sort) return customers
  const sorted = [...customers].sort((a, b) =>
    a[sort.key].localeCompare(b[sort.key], undefined, { sensitivity: 'base' }),
  )
  if (sort.direction === 'desc') sorted.reverse()
  return sorted
}

export function toggleSort(
  current: CustomerSort | null,
  key: SortKey,
): CustomerSort {
  if (current?.key === key) {
    return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
  }
  return { key, direction: 'asc' }
}

export function loadSort(): CustomerSort | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'key' in parsed &&
      'direction' in parsed &&
      SORT_KEYS.includes(parsed.key as SortKey) &&
      (parsed.direction === 'asc' || parsed.direction === 'desc')
    ) {
      return parsed as CustomerSort
    }
  } catch {
    // fall through to null on malformed storage
  }
  return null
}

export function saveSort(sort: CustomerSort) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sort))
}
