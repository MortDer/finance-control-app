import { useState } from 'react'
import type { OperationRow } from '../../../entities/operation/model/types'

export type EditDraft = {
  id: string
  name: string
  categoryId?: string
  amount: number
  dateIso: string
  description: string
}

export function useOperationRowEdit() {
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null)

  const isEditing = (row: OperationRow) => row.id === editingRowId

  const beginEdit = (row: OperationRow) => {
    setEditingRowId(row.id)
    setEditDraft({
      id: row.id,
      name: row.name,
      categoryId: row.categoryId,
      amount: row.amount,
      dateIso: row.dateIso,
      description: row.description === '-' ? '' : row.description,
    })
  }

  const setDraftField = <K extends keyof EditDraft>(field: K, value: EditDraft[K]) => {
    setEditDraft((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const resetEdit = () => {
    setEditingRowId(null)
    setEditDraft(null)
  }

  return {
    editingRowId,
    editDraft,
    isEditing,
    beginEdit,
    setDraftField,
    resetEdit,
  }
}
