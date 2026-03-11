import { act, renderHook } from '@testing-library/react'
import { useOperationRowEdit } from './useOperationRowEdit'
import type { OperationRow } from '../../../entities/operation/model/types'

const baseRow: OperationRow = {
  key: '1',
  id: '1',
  name: 'Salary',
  categoryId: 'category-1',
  categoryPhoto: undefined,
  category: 'Work',
  amount: 1000,
  date: '01.01.2026',
  dateIso: '2026-01-01T00:00:00.000Z',
  dateSortValue: 1735689600000,
  description: '-',
}

describe('useOperationRowEdit', () => {
  it('starts editing with normalized draft data', () => {
    const { result } = renderHook(() => useOperationRowEdit())

    act(() => {
      result.current.beginEdit(baseRow)
    })

    expect(result.current.editingRowId).toBe('1')
    expect(result.current.editDraft).toEqual({
      id: '1',
      name: 'Salary',
      categoryId: 'category-1',
      amount: 1000,
      dateIso: '2026-01-01T00:00:00.000Z',
      description: '',
    })
    expect(result.current.isEditing(baseRow)).toBe(true)
  })

  it('updates draft fields and resets edit mode', () => {
    const { result } = renderHook(() => useOperationRowEdit())

    act(() => {
      result.current.beginEdit(baseRow)
    })

    act(() => {
      result.current.setDraftField('name', 'Updated salary')
      result.current.setDraftField('amount', 1500)
    })

    expect(result.current.editDraft?.name).toBe('Updated salary')
    expect(result.current.editDraft?.amount).toBe(1500)

    act(() => {
      result.current.resetEdit()
    })

    expect(result.current.editingRowId).toBeNull()
    expect(result.current.editDraft).toBeNull()
  })
})
