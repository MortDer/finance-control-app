import { fireEvent, render, screen } from '@testing-library/react'
import { AppHeader } from './AppHeader'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        appTitle: 'App title',
        language: 'Language',
        theme: 'Theme',
        signIn: 'Sign in',
        profile: 'Profile',
      })[key] || key,
  }),
}))

describe('AppHeader', () => {
  it('calls language, theme and auth callbacks', () => {
    const onLanguageChange = jest.fn()
    const onThemeChange = jest.fn()
    const onAuthClick = jest.fn()

    render(
      <AppHeader
        language="ru"
        isDarkTheme={false}
        isAuthorized={false}
        onLanguageChange={onLanguageChange}
        onThemeChange={onThemeChange}
        onAuthClick={onAuthClick}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Language' }))
    fireEvent.click(screen.getByRole('button', { name: 'Theme' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(onLanguageChange).toHaveBeenCalledWith('en')
    expect(onThemeChange).toHaveBeenCalledWith(true)
    expect(onAuthClick).toHaveBeenCalledTimes(1)
  })

  it('shows profile button for authorized users', () => {
    render(
      <AppHeader
        language="en"
        isDarkTheme={true}
        isAuthorized={true}
        onLanguageChange={jest.fn()}
        onThemeChange={jest.fn()}
        onAuthClick={jest.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument()
  })
})
