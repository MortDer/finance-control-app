import { BulbOutlined, GlobalOutlined } from '@ant-design/icons'
import { Layout, Select, Space, Switch, Typography } from 'antd'
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
        <Space size="small" align="center">
          <GlobalOutlined style={{ color: '#fff' }} />
          <Select<AppLanguage>
            value={language}
            style={{ width: 110 }}
            onChange={onLanguageChange}
            options={[
              { value: 'ru', label: 'Русский' },
              { value: 'en', label: 'English' },
            ]}
          />
        </Space>
        <Space size="small" align="center">
          <BulbOutlined style={{ color: '#fff' }} />
          <Switch
            checked={isDarkTheme}
            onChange={onThemeChange}
            checkedChildren={t('darkMode')}
            unCheckedChildren={t('theme')}
          />
        </Space>
      </Space>
    </Header>
  )
}
