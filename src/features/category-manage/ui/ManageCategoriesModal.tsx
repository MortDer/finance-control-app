import { Button, Divider, Form, Input, List, Modal, Popconfirm, Space, Typography } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Category } from '../../../entities/category/model/types'

type ManageCategoriesModalProps = {
  open: boolean
  categories: Category[]
  isSubmitting: boolean
  isActionLoading: boolean
  onClose: () => void
  onCreate: (name: string) => Promise<void>
  onUpdate: (id: string, name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function ManageCategoriesModal({
  open,
  categories,
  isSubmitting,
  isActionLoading,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: ManageCategoriesModalProps) {
  const { t } = useTranslation()
  const [form] = Form.useForm<{ name: string }>()
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')

  const beginEdit = (category: Category) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  const saveEdit = async () => {
    if (!editingCategoryId || !editingCategoryName.trim()) {
      return
    }
    await onUpdate(editingCategoryId, editingCategoryName.trim())
    setEditingCategoryId(null)
    setEditingCategoryName('')
  }

  return (
    <Modal open={open} onCancel={onClose} destroyOnHidden footer={null} title={t('manageCategories')}>
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          await onCreate(values.name)
          form.resetFields()
        }}
      >
        <Form.Item name="name" label={t('name')} rules={[{ required: true, message: t('requiredField') }]}>
          <Input />
        </Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>{t('close')}</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {t('addCategory')}
          </Button>
        </Space>
      </Form>
      <Divider />
      <List
        dataSource={categories}
        locale={{ emptyText: t('emptyCategories') }}
        renderItem={(item) => (
          <List.Item
            actions={[
              editingCategoryId === item.id ? (
                <Button
                  key="save"
                  type="link"
                  loading={isActionLoading}
                  onClick={() => void saveEdit()}
                >
                  {t('save')}
                </Button>
              ) : (
                <Button key="edit" type="link" onClick={() => beginEdit(item)}>
                  {t('edit')}
                </Button>
              ),
              <Popconfirm
                key="delete"
                title={t('deleteCategoryConfirm')}
                okText={t('delete')}
                cancelText={t('close')}
                onConfirm={() => void onDelete(item.id)}
              >
                <Button type="link" danger loading={isActionLoading}>
                  {t('delete')}
                </Button>
              </Popconfirm>,
            ]}
          >
            {editingCategoryId === item.id ? (
              <Input
                value={editingCategoryName}
                onChange={(event) => setEditingCategoryName(event.target.value)}
                style={{ maxWidth: 280 }}
              />
            ) : (
              <Typography.Text>{item.name}</Typography.Text>
            )}
          </List.Item>
        )}
      />
    </Modal>
  )
}
