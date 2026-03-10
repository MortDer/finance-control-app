import { Alert, Button, Space, Table } from 'antd'
import axios from 'axios'
import type { TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getOperations } from '../../../entities/operation/api/operationsApi'
import type {
  OperationDto,
  OperationRow,
  OperationsPagination,
  OperationType,
} from '../../../entities/operation/model/types'
import { getApiErrorMessage } from '../../../shared/lib/getApiErrorMessage'

type OperationsTableProps = {
  authToken: string
  operationType: OperationType
  titleKey: 'tableTitleIncomes' | 'tableTitleExpenses'
}

const mapOperationToRow = (operation: OperationDto): OperationRow => ({
  key: operation.id,
  name: operation.name,
  category: operation.category?.name || '-',
  amount: operation.amount,
  date: new Date(operation.date).toLocaleDateString(),
  description: operation.desc || '-',
})

export function OperationsTable({ authToken, operationType, titleKey }: OperationsTableProps) {
  const { t } = useTranslation()
  const [rows, setRows] = useState<OperationRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [reloadTick, setReloadTick] = useState(0)
  const [pagination, setPagination] = useState<OperationsPagination>({
    pageNumber: 1,
    pageSize: 10,
    total: 0,
  })

  useEffect(() => {
    const controller = new AbortController()

    const loadOperations = async () => {
      try {
        setIsLoading(true)
        setErrorText('')
        const response = await getOperations({
          type: operationType,
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
          signal: controller.signal,
        })

        setRows(response.data.map(mapOperationToRow))
        setPagination((prev) => ({ ...prev, total: response.pagination.total }))
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
          return
        }

        setErrorText(getApiErrorMessage(error, t('operationsLoadError')))
        setRows([])
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadOperations()

    return () => {
      controller.abort()
    }
  }, [authToken, operationType, pagination.pageNumber, pagination.pageSize, reloadTick, t])

  const columns: TableProps<OperationRow>['columns'] = [
    { title: t('name'), dataIndex: 'name', key: 'name' },
    { title: t('category'), dataIndex: 'category', key: 'category' },
    { title: t('amount'), dataIndex: 'amount', key: 'amount' },
    { title: t('date'), dataIndex: 'date', key: 'date' },
    { title: t('description'), dataIndex: 'description', key: 'description' },
  ]

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      {errorText ? (
        <Alert
          type="error"
          showIcon
          title={errorText}
          action={<Button onClick={() => setReloadTick((prev) => prev + 1)}>{t('retry')}</Button>}
        />
      ) : null}
      <Table
        columns={columns}
        dataSource={rows}
        loading={isLoading}
        title={() => t(titleKey)}
        pagination={{
          current: pagination.pageNumber,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (pageNumber, pageSize) => setPagination((prev) => ({ ...prev, pageNumber, pageSize })),
        }}
      />
    </Space>
  )
}
