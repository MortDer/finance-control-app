import { Alert, Button, Form, Input, Modal, Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { signIn, signUp } from '../api/authApi'
import { getApiErrorMessage } from '../../../shared/lib/getApiErrorMessage'

type AuthModalProps = {
  open: boolean
  onClose: () => void
  onSuccess: (token: string) => void
}

type AuthFormValues = {
  email: string
  password: string
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorText, setErrorText] = useState('')

  const handleSignIn = async (values: AuthFormValues) => {
    try {
      setIsSubmitting(true)
      setErrorText('')
      const result = await signIn(values.email, values.password)
      onSuccess(result.token)
    } catch (error) {
      setErrorText(getApiErrorMessage(error, t('authError')))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignUp = async (values: AuthFormValues) => {
    try {
      setIsSubmitting(true)
      setErrorText('')
      const result = await signUp(values.email, values.password)
      onSuccess(result.token)
    } catch (error) {
      setErrorText(getApiErrorMessage(error, t('authError')))
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderAuthFields = () => (
    <>
      <Form.Item
        name="email"
        label={t('email')}
        rules={[
          { required: true, message: t('requiredField') },
          { type: 'email', message: t('invalidEmail') },
        ]}
      >
        <Input placeholder="email@example.com" />
      </Form.Item>
      <Form.Item
        name="password"
        label={t('password')}
        rules={[
          { required: true, message: t('requiredField') },
          { min: 8, message: t('passwordMinLength') },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {errorText ? <Alert type="error" showIcon message={errorText} style={{ marginBottom: 12 }} /> : null}
      <Form.Item style={{ marginBottom: 0 }}>
        <Button htmlType="submit" type="primary" block loading={isSubmitting}>
          {t('continue')}
        </Button>
      </Form.Item>
    </>
  )

  return (
    <Modal open={open} onCancel={onClose} footer={null} destroyOnHidden title={t('authTitle')}>
      <Tabs
        defaultActiveKey="signin"
        items={[
          {
            key: 'signin',
            label: t('signIn'),
            children: (
              <Form layout="vertical" onFinish={handleSignIn}>
                {renderAuthFields()}
              </Form>
            ),
          },
          {
            key: 'signup',
            label: t('signUp'),
            children: (
              <Form layout="vertical" onFinish={handleSignUp}>
                {renderAuthFields()}
              </Form>
            ),
          },
        ]}
      />
    </Modal>
  )
}
