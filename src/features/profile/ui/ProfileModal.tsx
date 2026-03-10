import { Alert, Button, Descriptions, Modal, Space, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getProfile, type Profile } from '../api/profileApi'
import { getApiErrorMessage } from '../../../shared/api/getApiErrorMessage'

type ProfileModalProps = {
  open: boolean
  onClose: () => void
  onLogout: () => void
}

export function ProfileModal({ open, onClose, onLogout }: ProfileModalProps) {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true)
        setErrorText('')
        const data = await getProfile()
        setProfile(data)
      } catch (error) {
        setErrorText(getApiErrorMessage(error, t('profileLoadError')))
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfile()
  }, [open, t])

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('profile')}
      footer={
        <Space>
          <Button onClick={onClose}>{t('close')}</Button>
          <Button danger onClick={onLogout}>
            {t('logout')}
          </Button>
        </Space>
      }
    >
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : null}

      {!isLoading && errorText ? <Alert type="error" showIcon message={errorText} /> : null}

      {!isLoading && !errorText && profile ? (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={t('email')}>{profile.email}</Descriptions.Item>
          <Descriptions.Item label={t('name')}>{profile.name || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('commandId')}>{profile.commandId}</Descriptions.Item>
          <Descriptions.Item label={t('signUpDate')}>
            {new Date(profile.signUpDate).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      ) : null}

      {!isLoading && !errorText && !profile ? (
        <Typography.Text type="secondary">{t('emptyProfile')}</Typography.Text>
      ) : null}
    </Modal>
  )
}
