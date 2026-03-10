import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, DatePicker, Image, Input, InputNumber, Popconfirm, Select, Space } from 'antd'
import type { TableProps } from 'antd'
import dayjs from 'dayjs'
import type { TFunction } from 'i18next'
import type { Category } from '../../../entities/category/model/types'
import type { OperationRow } from '../../../entities/operation/model/types'
import type { EditDraft } from '../model/useOperationRowEdit'

type Params = {
  t: TFunction
  authToken: string
  categories: Category[]
  editDraft: EditDraft | null
  actionLoading: boolean
  isEditing: (row: OperationRow) => boolean
  beginEdit: (row: OperationRow) => void
  setDraftField: <K extends keyof EditDraft>(field: K, value: EditDraft[K]) => void
  saveEdit: () => void
  removeOperation: (id: string) => void
}

export function getOperationsColumns({
  t,
  authToken,
  categories,
  editDraft,
  actionLoading,
  isEditing,
  beginEdit,
  setDraftField,
  saveEdit,
  removeOperation,
}: Params): TableProps<OperationRow>['columns'] {
  const columns: TableProps<OperationRow>['columns'] = [
    {
      title: t('photo'),
      dataIndex: 'categoryPhoto',
      key: 'categoryPhoto',
      width: 72,
      render: (value: string | undefined) =>
        value ? (
          <Image
            src={value}
            alt={t('category')}
            width={36}
            height={36}
            style={{ borderRadius: 6, objectFit: 'cover' }}
          />
        ) : (
          '-'
        ),
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_value, row) =>
        isEditing(row) ? (
          <Input value={editDraft?.name} onChange={(event) => setDraftField('name', event.target.value)} />
        ) : (
          row.name
        ),
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
      render: (_value, row) =>
        isEditing(row) ? (
          <Select
            value={editDraft?.categoryId}
            placeholder={t('selectCategory')}
            options={categories.map((item) => ({ value: item.id, label: item.name }))}
            onChange={(value) => setDraftField('categoryId', value)}
            style={{ width: 180 }}
          />
        ) : (
          row.category
        ),
    },
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (_value, row) =>
        isEditing(row) ? (
          <InputNumber
            min={0.01}
            value={editDraft?.amount}
            onChange={(value) => {
              if (typeof value === 'number') {
                setDraftField('amount', value)
              }
            }}
          />
        ) : (
          row.amount
        ),
    },
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.dateSortValue - b.dateSortValue,
      render: (_value, row) =>
        isEditing(row) ? (
          <DatePicker
            value={editDraft?.dateIso ? dayjs(editDraft.dateIso) : null}
            onChange={(value) => {
              if (value) {
                setDraftField('dateIso', value.toISOString())
              }
            }}
          />
        ) : (
          row.date
        ),
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
      render: (_value, row) =>
        isEditing(row) ? (
          <Input
            value={editDraft?.description}
            onChange={(event) => setDraftField('description', event.target.value)}
          />
        ) : (
          row.description
        ),
    },
  ]

  if (authToken) {
    columns.push({
      title: t('actions'),
      key: 'actions',
      width: 110,
      render: (_value: unknown, row: OperationRow) =>
        isEditing(row) ? (
          <Space size="small">
            <Button
              type="text"
              icon={<SaveOutlined />}
              loading={actionLoading}
              onClick={() => saveEdit()}
            />
            <Popconfirm
              title={t('deleteOperationConfirm')}
              okText={t('delete')}
              cancelText={t('close')}
              onConfirm={() => removeOperation(row.id)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} loading={actionLoading} />
            </Popconfirm>
          </Space>
        ) : (
          <Button type="text" icon={<EditOutlined />} onClick={() => beginEdit(row)} />
        ),
    })
  }

  return columns
}
