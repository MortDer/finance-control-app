import { ConfigProvider, Layout, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthModal } from '../features/auth/ui/AuthModal'
import { ProfileModal } from '../features/profile/ui/ProfileModal'
import { AppHeader } from '../widgets/app-header/ui/AppHeader'
import { OperationsTable } from '../widgets/operations-table/ui/OperationsTable'
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
    if (i18n.language !== language) {
      void i18n.changeLanguage(language)
    }
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
        <Content
          style={{
            padding: 24,
            height: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <OperationsTabs />
          <div style={{ flex: 1, minHeight: 0 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/operations/income" replace />} />
              <Route
                path="/operations/income"
                element={
                  <OperationsTable
                    authToken={authToken}
                    operationType="Profit"
                    titleKey="tableTitleIncomes"
                  />
                }
              />
              <Route
                path="/operations/expense"
                element={
                  <OperationsTable
                    authToken={authToken}
                    operationType="Cost"
                    titleKey="tableTitleExpenses"
                  />
                }
              />
              <Route path="*" element={<Navigate to="/operations/income" replace />} />
            </Routes>
          </div>
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
