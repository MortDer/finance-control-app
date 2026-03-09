import { Alert, Button, Space, Table, Tabs } from 'antd'
import type { TableProps, TabsProps } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getOperations } from '../../../entities/operation/api/operationsApi'
import type { OperationDto, OperationRow, OperationsPagination } from '../../../entities/operation/model/types'
import { getApiErrorMessage } from '../../../shared/lib/getApiErrorMessage'

type OperationsTabsProps = {
  authToken: string
}

const mapOperationToRow = (operation: OperationDto): OperationRow => ({
  key: operation.id,
  name: operation.name,
  category: operation.category?.name || '-',
  amount: operation.amount,
  date: new Date(operation.date).toLocaleDateString(),
  description: operation.desc || '-',
})

export function OperationsTabs({ authToken }: OperationsTabsProps) {
  const { t } = useTranslation()
  const [incomeRows, setIncomeRows] = useState<OperationRow[]>([])
  const [expenseRows, setExpenseRows] = useState<OperationRow[]>([])
  const [incomeLoading, setIncomeLoading] = useState(false)
  const [expenseLoading, setExpenseLoading] = useState(false)
  const [incomeErrorText, setIncomeErrorText] = useState('')
  const [expenseErrorText, setExpenseErrorText] = useState('')

  const [incomePagination, setIncomePagination] = useState<OperationsPagination>({
    pageNumber: 1,
    pageSize: 10,
    total: 0,
  })
  const [expensePagination, setExpensePagination] = useState<OperationsPagination>({
    pageNumber: 1,
    pageSize: 10,
    total: 0,
  })

  const loadIncomeOperations = useCallback(async () => {
    try {
      setIncomeLoading(true)
      setIncomeErrorText('')
      const response = await getOperations({
        type: 'Profit',
        pageNumber: incomePagination.pageNumber,
        pageSize: incomePagination.pageSize,
      })
      setIncomeRows(response.data.map(mapOperationToRow))
      setIncomePagination((prev) => ({ ...prev, total: response.pagination.total }))
    } catch (error) {
      setIncomeErrorText(getApiErrorMessage(error, t('operationsLoadError')))
      setIncomeRows([])
    } finally {
      setIncomeLoading(false)
    }
  }, [incomePagination.pageNumber, incomePagination.pageSize, t])

  useEffect(() => {
    void loadIncomeOperations()
  }, [authToken, loadIncomeOperations])

  const loadExpenseOperations = useCallback(async () => {
    try {
      setExpenseLoading(true)
      setExpenseErrorText('')
      const response = await getOperations({
        type: 'Cost',
        pageNumber: expensePagination.pageNumber,
        pageSize: expensePagination.pageSize,
      })
      setExpenseRows(response.data.map(mapOperationToRow))
      setExpensePagination((prev) => ({ ...prev, total: response.pagination.total }))
    } catch (error) {
      setExpenseErrorText(getApiErrorMessage(error, t('operationsLoadError')))
      setExpenseRows([])
    } finally {
      setExpenseLoading(false)
    }
  }, [expensePagination.pageNumber, expensePagination.pageSize, t])

  useEffect(() => {
    void loadExpenseOperations()
  }, [authToken, loadExpenseOperations])

  const columns: TableProps<OperationRow>['columns'] = useMemo(
    () => [
      { title: t('name'), dataIndex: 'name', key: 'name' },
      { title: t('category'), dataIndex: 'category', key: 'category' },
      { title: t('amount'), dataIndex: 'amount', key: 'amount' },
      { title: t('date'), dataIndex: 'date', key: 'date' },
      { title: t('description'), dataIndex: 'description', key: 'description' },
    ],
    [t],
  )

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: 'income',
        label: t('incomesTab'),
        children: (
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            {incomeErrorText ? (
              <Alert
                type="error"
                showIcon
                title={incomeErrorText}
                action={<Button onClick={() => void loadIncomeOperations()}>{t('retry')}</Button>}
              />
            ) : null}
            <Table
              columns={columns}
              dataSource={incomeRows}
              pagination={{
                current: incomePagination.pageNumber,
                pageSize: incomePagination.pageSize,
                total: incomePagination.total,
                showSizeChanger: true,
                onChange: (pageNumber, pageSize) =>
                  setIncomePagination((prev) => ({ ...prev, pageNumber, pageSize })),
              }}
              loading={incomeLoading}
              title={() => t('tableTitleIncomes')}
            />
          </Space>
        ),
      },
      {
        key: 'expense',
        label: t('expensesTab'),
        children: (
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            {expenseErrorText ? (
              <Alert
                type="error"
                showIcon
                title={expenseErrorText}
                action={<Button onClick={() => void loadExpenseOperations()}>{t('retry')}</Button>}
              />
            ) : null}
            <Table
              columns={columns}
              dataSource={expenseRows}
              pagination={{
                current: expensePagination.pageNumber,
                pageSize: expensePagination.pageSize,
                total: expensePagination.total,
                showSizeChanger: true,
                onChange: (pageNumber, pageSize) =>
                  setExpensePagination((prev) => ({ ...prev, pageNumber, pageSize })),
              }}
              loading={expenseLoading}
              title={() => t('tableTitleExpenses')}
            />
          </Space>
        ),
      },
    ],
    [
      columns,
      expenseErrorText,
      expenseLoading,
      expensePagination.pageNumber,
      expensePagination.pageSize,
      expensePagination.total,
      expenseRows,
      incomeErrorText,
      incomeLoading,
      incomePagination.pageNumber,
      incomePagination.pageSize,
      incomePagination.total,
      incomeRows,
      loadExpenseOperations,
      loadIncomeOperations,
      t,
    ],
  )

  return <Tabs defaultActiveKey="income" items={items} />
}
