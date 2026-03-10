import axios from 'axios'
import { useEffect, useState } from 'react'
import type { TFunction } from 'i18next'
import { getCategories } from '../../../entities/category/api/categoriesApi'
import type { Category } from '../../../entities/category/model/types'
import {
  deleteOperation,
  getOperations,
  updateOperation,
} from '../../../entities/operation/api/operationsApi'
import type {
  OperationDto,
  OperationRow,
  OperationsPagination,
  OperationType,
} from '../../../entities/operation/model/types'
import { getApiErrorMessage } from '../../../shared/lib/getApiErrorMessage'
import type { EditDraft } from './useOperationRowEdit'

const mapOperationToRow = (operation: OperationDto): OperationRow => ({
  key: operation.id,
  id: operation.id,
  name: operation.name,
  categoryId: operation.category?.id,
  categoryPhoto: operation.category?.photo,
  category: operation.category?.name || '-',
  amount: operation.amount,
  date: new Date(operation.date).toLocaleDateString(),
  dateIso: operation.date,
  dateSortValue: new Date(operation.date).getTime(),
  description: operation.desc || '-',
})

type Params = {
  authToken: string
  operationType: OperationType
  t: TFunction
}

export function useOperationsTableData({ authToken, operationType, t }: Params) {
  const [rows, setRows] = useState<OperationRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [refetchVersion, setRefetchVersion] = useState(0)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<OperationsPagination>({
    pageNumber: 1,
    pageSize: 10,
    total: 0,
  })

  useEffect(() => {
    const controller = new AbortController()

    const loadOperations = async () => {
      try {
        setIsLoading(true)
        setErrorText('')
        const response = await getOperations({
          type: operationType,
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
          signal: controller.signal,
        })

        setRows(response.data.map(mapOperationToRow))
        setPagination((prev) => ({ ...prev, total: response.pagination.total }))
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
          return
        }

        setErrorText(getApiErrorMessage(error, t('operationsLoadError')))
        setRows([])
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadOperations()

    return () => controller.abort()
  }, [operationType, pagination.pageNumber, pagination.pageSize, refetchVersion, t])

  useEffect(() => {
    if (!authToken) {
      setCategories([])
      return
    }

    const loadCategories = async () => {
      try {
        const result = await getCategories()
        setCategories(result)
      } catch (error) {
        setErrorText(getApiErrorMessage(error, t('categoriesLoadError')))
      }
    }

    void loadCategories()
  }, [authToken, t])

  const refetchOperations = () => setRefetchVersion((prev) => prev + 1)

  const saveOperation = async (draft: EditDraft): Promise<boolean> => {
    try {
      setActionLoading(true)
      setErrorText('')
      await updateOperation({
        id: draft.id,
        name: draft.name.trim(),
        categoryId: draft.categoryId,
        amount: draft.amount,
        date: draft.dateIso,
        desc: draft.description.trim() || undefined,
      })
      refetchOperations()
      return true
    } catch (error) {
      setErrorText(getApiErrorMessage(error, t('operationUpdateError')))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const removeOperationById = async (id: string): Promise<boolean> => {
    try {
      setActionLoading(true)
      setErrorText('')
      await deleteOperation(id)
      refetchOperations()
      return true
    } catch (error) {
      setErrorText(getApiErrorMessage(error, t('operationDeleteError')))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  return {
    rows,
    isLoading,
    errorText,
    setErrorText,
    pagination,
    setPagination,
    isCreateModalOpen,
    setIsCreateModalOpen,
    actionLoading,
    categories,
    refetchOperations,
    saveOperation,
    removeOperationById,
  }
}
