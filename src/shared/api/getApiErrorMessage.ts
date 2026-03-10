import axios from 'axios'

type ServerErrorPayload = {
  errors?: Array<{
    message?: string
  }>
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  const payload = error.response?.data as ServerErrorPayload | undefined
  const firstMessage = payload?.errors?.[0]?.message

  return firstMessage || fallback
}
