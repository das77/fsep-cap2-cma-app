import { useReducer } from 'react'
import type { ReactNode } from 'react'
import { CustomerContext, customerReducer, initialState } from './CustomerContext'

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(customerReducer, initialState)

  return (
    <CustomerContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomerContext.Provider>
  )
}
