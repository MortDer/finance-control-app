import { ConfigProvider, Layout, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppHeader } from '../widgets/app-header/ui/AppHeader'
import { OperationsTabs } from '../widgets/operations-tabs/ui/OperationsTabs'
import { LANGUAGE_STORAGE_KEY, THEME_STORAGE_KEY, type AppLanguage } from '../shared/config/constants'

const { Content } = Layout

const getInitialLanguage = (): AppLanguage => {
  const value = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return value === 'en' ? 'en' : 'ru'
}

const getInitialTheme = (): boolean => localStorage.getItem(THEME_STORAGE_KEY) === 'dark'

export default function App() {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage)
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(getInitialTheme)

  useEffect(() => {
    void i18n.changeLanguage(language)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [i18n, language])

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkTheme ? 'dark' : 'light')
  }, [isDarkTheme])

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
          onLanguageChange={setLanguage}
          onThemeChange={setIsDarkTheme}
        />
        <Content style={{ padding: 24 }}>
          <OperationsTabs />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}
