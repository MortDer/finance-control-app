import { useCallback, useEffect, useState } from 'react'
import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  getCategories,
  updateCategory as updateCategoryApi,
} from '../api/categoriesApi'
import type { Category } from './types'

type Params = {
  enabled: boolean
}

export function useCategories({ enabled }: Params) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const refreshCategories = useCallback(async () => {
    if (!enabled) {
      setCategories([])
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const result = await getCategories()
      setCategories(result)
    } catch (nextError) {
      setError(nextError)
      throw nextError
    } finally {
      setIsLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    void refreshCategories().catch(() => {})
  }, [refreshCategories])

  const createCategory = useCallback(async (name: string) => {
    try {
      setIsActionLoading(true)
      setError(null)
      const category = await createCategoryApi(name)
      setCategories((prev) => [category, ...prev])
      return category
    } catch (nextError) {
      setError(nextError)
      throw nextError
    } finally {
      setIsActionLoading(false)
    }
  }, [])

  const updateCategory = useCallback(async (id: string, name: string) => {
    try {
      setIsActionLoading(true)
      setError(null)
      const category = await updateCategoryApi(id, name)
      setCategories((prev) => prev.map((item) => (item.id === category.id ? category : item)))
      return category
    } catch (nextError) {
      setError(nextError)
      throw nextError
    } finally {
      setIsActionLoading(false)
    }
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setIsActionLoading(true)
      setError(null)
      await deleteCategoryApi(id)
      setCategories((prev) => prev.filter((item) => item.id !== id))
    } catch (nextError) {
      setError(nextError)
      throw nextError
    } finally {
      setIsActionLoading(false)
    }
  }, [])

  const clearError = () => setError(null)

  return {
    categories,
    isLoading,
    isActionLoading,
    error,
    clearError,
    refreshCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
