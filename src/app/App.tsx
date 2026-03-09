import { ConfigProvider, Layout, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthModal } from '../features/auth/ui/AuthModal'
import { ProfileModal } from '../features/profile/ui/ProfileModal'
import { AppHeader } from '../widgets/app-header/ui/AppHeader'
import { OperationsTabs } from '../widgets/operations-tabs/ui/OperationsTabs'
import {
  AUTH_TOKEN_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  type AppLanguage,
} from '../shared/config/constants'

const { Content } = Layout

const getInitialLanguage = (): AppLanguage => {
  const value = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return value === 'en' ? 'en' : 'ru'
}

const getInitialTheme = (): boolean => localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
const getInitialToken = (): string => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || ''

export default function App() {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage)
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(getInitialTheme)
  const [authToken, setAuthToken] = useState<string>(getInitialToken)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  useEffect(() => {
    void i18n.changeLanguage(language)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [i18n, language])

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkTheme ? 'dark' : 'light')
  }, [isDarkTheme])

  const handleAuthSuccess = (token: string) => {
    setAuthToken(token)
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
    setIsAuthModalOpen(false)
  }

  const handleHeaderAuthClick = () => {
    if (authToken) {
      setIsProfileModalOpen(true)
      return
    }

    setIsAuthModalOpen(true)
  }

  const handleLogout = () => {
    setAuthToken('')
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    setIsProfileModalOpen(false)
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader
          language={language}
          isDarkTheme={isDarkTheme}
          isAuthorized={Boolean(authToken)}
          onLanguageChange={setLanguage}
          onThemeChange={setIsDarkTheme}
          onAuthClick={handleHeaderAuthClick}
        />
        <Content style={{ padding: 24 }}>
          <OperationsTabs />
        </Content>
        <AuthModal
          open={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
        <ProfileModal
          open={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={handleLogout}
        />
      </Layout>
    </ConfigProvider>
  )
}
