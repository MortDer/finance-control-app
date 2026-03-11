import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { OperationsTabs } from './OperationsTabs'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        incomesTab: 'Incomes',
        expensesTab: 'Expenses',
      })[key] || key,
  }),
}))

function PathnameProbe() {
  const location = useLocation()
  return <div data-testid="pathname">{location.pathname}</div>
}

describe('OperationsTabs', () => {
  it('switches route when changing tab', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/operations/income']}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <OperationsTabs />
                <PathnameProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('pathname')).toHaveTextContent('/operations/income')

    await user.click(screen.getByRole('tab', { name: 'Expenses' }))

    expect(screen.getByTestId('pathname')).toHaveTextContent('/operations/expense')
  })
})
