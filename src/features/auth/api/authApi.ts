import { COMMAND_ID } from '../../../shared/config/constants'
import { http } from '../../../shared/api/http'

type AuthResult = {
  token: string
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const response = await http.post<AuthResult>('/signin', { email, password })
  return response.data
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const response = await http.post<AuthResult>('/signup', {
    email,
    password,
    commandId: COMMAND_ID,
  })
  return response.data
}
