import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

export function OperationsTabs() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey = location.pathname.includes('/operations/expense') ? 'expense' : 'income'
  const items: TabsProps['items'] = [
    { key: 'income', label: t('incomesTab') },
    { key: 'expense', label: t('expensesTab') },
  ]

  return (
    <Tabs
      activeKey={activeKey}
      items={items}
      onChange={(key) => navigate(key === 'expense' ? '/operations/expense' : '/operations/income')}
    />
  )
}
