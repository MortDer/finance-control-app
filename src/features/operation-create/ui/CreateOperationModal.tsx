import { Alert, Button, DatePicker, Form, Input, InputNumber, Modal, Select, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createCategory, getCategories } from '../../../entities/category/api/categoriesApi'
import type { Category } from '../../../entities/category/model/types'
import { createOperation } from '../../../entities/operation/api/operationsApi'
import type { OperationType } from '../../../entities/operation/model/types'
import { getApiErrorMessage } from '../../../shared/lib/getApiErrorMessage'

type CreateOperationModalProps = {
  open: boolean
  operationType: OperationType
  onClose: () => void
  onSuccess: () => void
}

type OperationFormValues = {
  name: string
  desc?: string
  amount: number
  date: Dayjs
  categoryId: string
}

export function CreateOperationModal({ open, operationType, onClose, onSuccess }: CreateOperationModalProps) {
  const { t } = useTranslation()
  const [form] = Form.useForm<OperationFormValues>()
  const [categoryForm] = Form.useForm<{ name: string }>()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false)
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const result = await getCategories()
        setCategories(result)
      } catch (error) {
        setErrorText(getApiErrorMessage(error, t('categoriesLoadError')))
      } finally {
        setIsLoadingCategories(false)
      }
    }

    void loadCategories()
  }, [open, t])

  const handleCreateOperation = async (values: OperationFormValues) => {
    try {
      setIsSubmitting(true)
      setErrorText('')
      await createOperation({
        name: values.name,
        desc: values.desc,
        amount: values.amount,
        date: values.date.toISOString(),
        type: operationType,
        categoryId: values.categoryId,
      })

      form.resetFields()
      onSuccess()
      onClose()
    } catch (error) {
      setErrorText(getApiErrorMessage(error, t('operationCreateError')))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateCategory = async (values: { name: string }) => {
    try {
      setIsCategorySubmitting(true)
      setErrorText('')
      const category = await createCategory(values.name)
      setCategories((prev) => [category, ...prev])
      form.setFieldValue('categoryId', category.id)
      categoryForm.resetFields()
      setIsCategoryModalOpen(false)
    } catch (error) {
      setErrorText(getApiErrorMessage(error, t('categoryCreateError')))
    } finally {
      setIsCategorySubmitting(false)
    }
  }

  return (
    <>
      <Modal open={open} onCancel={onClose} destroyOnHidden footer={null} title={t('addOperation')}>
        <Form form={form} layout="vertical" onFinish={handleCreateOperation}>
          <Form.Item
            name="name"
            label={t('name')}
            rules={[{ required: true, message: t('requiredField') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="desc" label={t('description')}>
            <Input />
          </Form.Item>
          <Form.Item
            name="amount"
            label={t('amount')}
            rules={[{ required: true, message: t('requiredField') }]}
          >
            <InputNumber style={{ width: '100%' }} min={0.01} />
          </Form.Item>
          <Form.Item
            name="date"
            label={t('date')}
            rules={[{ required: true, message: t('requiredField') }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label={t('category')}
            rules={[{ required: true, message: t('requiredField') }]}
          >
            <Select
              loading={isLoadingCategories}
              placeholder={t('selectCategory')}
              options={categories.map((item) => ({ value: item.id, label: item.name }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: 8 }}>
                    <Button type="link" onClick={() => setIsCategoryModalOpen(true)}>
                      {t('addCategory')}
                    </Button>
                  </div>
                </>
              )}
            />
          </Form.Item>
          {errorText ? <Alert type="error" showIcon title={errorText} style={{ marginBottom: 12 }} /> : null}
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>{t('close')}</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {t('save')}
            </Button>
          </Space>
        </Form>
      </Modal>

      <Modal
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        destroyOnHidden
        footer={null}
        title={t('addCategory')}
      >
        <Form form={categoryForm} layout="vertical" onFinish={handleCreateCategory}>
          <Form.Item
            name="name"
            label={t('name')}
            rules={[{ required: true, message: t('requiredField') }]}
          >
            <Input />
          </Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsCategoryModalOpen(false)}>{t('close')}</Button>
            <Button type="primary" htmlType="submit" loading={isCategorySubmitting}>
              {t('save')}
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  )
}
