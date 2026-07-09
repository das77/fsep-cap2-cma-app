import { createContext } from 'react'
import type { Dispatch } from 'react'
import type { Customer } from '../types/customer'

export type CustomerState = {
  customers: Customer[]
}

export type CustomerAction =
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: number }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }

export type CustomerContextValue = {
  state: CustomerState
  dispatch: Dispatch<CustomerAction>
}

export const initialState: CustomerState = {
  customers: [],
}

export function customerReducer(
  state: CustomerState,
  action: CustomerAction,
): CustomerState {
  switch (action.type) {
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] }
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer,
        ),
      }
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer.id !== action.payload,
        ),
      }
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload }
    default:
      return state
  }
}

export const CustomerContext = createContext<CustomerContextValue | undefined>(
  undefined,
)
