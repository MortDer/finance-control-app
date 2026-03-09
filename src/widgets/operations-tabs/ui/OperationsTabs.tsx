import { Table, Tabs } from 'antd'
import type { ColumnsType, TabsProps } from 'antd/es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { OperationRow } from '../../../entities/operation/model/types'
import { expenseRows, incomeRows } from '../../../entities/operation/model/mock'

export function OperationsTabs() {
  const { t } = useTranslation()

  const columns: ColumnsType<OperationRow> = useMemo(
    () => [
      { title: t('name'), dataIndex: 'name', key: 'name' },
      { title: t('category'), dataIndex: 'category', key: 'category' },
      { title: t('amount'), dataIndex: 'amount', key: 'amount' },
      { title: t('date'), dataIndex: 'date', key: 'date' },
      { title: t('source'), dataIndex: 'source', key: 'source' },
    ],
    [t],
  )

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: 'income',
        label: t('incomesTab'),
        children: (
          <Table
            columns={columns}
            dataSource={incomeRows}
            pagination={false}
            title={() => t('tableTitleIncomes')}
          />
        ),
      },
      {
        key: 'expense',
        label: t('expensesTab'),
        children: (
          <Table
            columns={columns}
            dataSource={expenseRows}
            pagination={false}
            title={() => t('tableTitleExpenses')}
          />
        ),
      },
    ],
    [columns, t],
  )

  return <Tabs defaultActiveKey="income" items={items} />
}
