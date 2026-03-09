import { http } from '../../../shared/api/http'

export type Profile = {
  id: string
  name: string
  email: string
  signUpDate: string
  commandId: string
}

export async function getProfile(): Promise<Profile> {
  const response = await http.get<Profile>('/profile')
  return response.data
}
