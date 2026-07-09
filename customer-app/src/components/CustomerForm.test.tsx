import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CustomerForm from './CustomerForm'
import type { CustomerFormData } from '../types/customer'

const validData: CustomerFormData = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '555-0199',
  address: '12 Main St',
  city: 'Springfield',
  state: 'IL',
  zip: '62704',
}

function renderForm(initialData?: CustomerFormData) {
  const onSubmit = vi.fn()
  const onCancel = vi.fn()
  render(
    <CustomerForm
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />,
  )
  return { onSubmit, onCancel }
}

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), validData.name)
  await user.type(screen.getByLabelText('Email'), validData.email)
  await user.type(screen.getByLabelText('Phone'), validData.phone)
  await user.type(screen.getByLabelText('Address'), validData.address)
  await user.type(screen.getByLabelText('City'), validData.city)
  await user.type(screen.getByLabelText('State'), validData.state)
  await user.type(screen.getByLabelText('ZIP'), validData.zip)
}

describe('CustomerForm', () => {
  it('shows errors for required fields when submitting an empty form', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Phone is required.')).toBeInTheDocument()
    expect(screen.getByText('Address is required.')).toBeInTheDocument()
    expect(screen.getByText('City is required.')).toBeInTheDocument()
    expect(screen.getByText('State is required.')).toBeInTheDocument()
    expect(screen.getByText('ZIP is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with the form data when valid data is submitted', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(validData)
  })

  it('calls onCancel when the Cancel button is clicked', async () => {
    const user = userEvent.setup()
    const { onSubmit, onCancel } = renderForm()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('pre-fills the fields in edit mode when initialData is passed', () => {
    renderForm(validData)

    expect(screen.getByLabelText('Name')).toHaveValue(validData.name)
    expect(screen.getByLabelText('Email')).toHaveValue(validData.email)
    expect(screen.getByLabelText('Phone')).toHaveValue(validData.phone)
    expect(screen.getByLabelText('Address')).toHaveValue(validData.address)
    expect(screen.getByLabelText('City')).toHaveValue(validData.city)
    expect(screen.getByLabelText('State')).toHaveValue(validData.state)
    expect(screen.getByLabelText('ZIP')).toHaveValue(validData.zip)
    expect(
      screen.getByRole('button', { name: 'Update Customer' }),
    ).toBeInTheDocument()
  })
})
