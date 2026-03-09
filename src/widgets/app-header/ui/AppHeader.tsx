import { BulbFilled, BulbOutlined } from '@ant-design/icons'
import { Button, Layout, Space, Typography } from 'antd'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import type { AppLanguage } from '../../../shared/config/constants'

type AppHeaderProps = {
  language: AppLanguage
  isDarkTheme: boolean
  onLanguageChange: (value: AppLanguage) => void
  onThemeChange: (value: boolean) => void
}

const { Header } = Layout

export function AppHeader({
  language,
  isDarkTheme,
  onLanguageChange,
  onThemeChange,
}: AppHeaderProps) {
  const { t } = useTranslation()
  const nextLanguage: AppLanguage = language === 'ru' ? 'en' : 'ru'
  const controlButtonStyle: CSSProperties = {
    minWidth: 92,
    fontWeight: 600,
    color: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  }

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 24,
      }}
    >
      <Typography.Title level={4} style={{ margin: 0, color: '#fff' }}>
        {t('appTitle')}
      </Typography.Title>
      <Space size="large" align="center">
        <Button
          aria-label={t('language')}
          title={t('language')}
          onClick={() => onLanguageChange(nextLanguage)}
          style={controlButtonStyle}
        >
          {language.toUpperCase()}
        </Button>
        <Button
          aria-label={t('theme')}
          title={t('theme')}
          onClick={() => onThemeChange(!isDarkTheme)}
          icon={isDarkTheme ? <BulbFilled /> : <BulbOutlined />}
          style={controlButtonStyle}
        >
          {t('theme')}
        </Button>
      </Space>
    </Header>
  )
}
