import { http } from '../../../shared/api/http'
import type { Category } from '../model/types'

type CategoriesResponse = {
  data: Category[]
}

export async function getCategories(): Promise<Category[]> {
  const response = await http.get<CategoriesResponse>('/categories')
  return response.data.data || []
}

export async function createCategory(name: string): Promise<Category> {
  const response = await http.post<Category>('/categories', { name })
  return response.data
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  const response = await http.patch<Category>(`/categories/${id}`, { name })
  return response.data
}

export async function deleteCategory(id: string): Promise<void> {
  await http.delete(`/categories/${id}`)
}
