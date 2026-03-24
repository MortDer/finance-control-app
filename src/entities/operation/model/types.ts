export type OperationRow = {
  key: string
  id: string
  name: string
  categoryId?: string
  categoryPhoto?: string
  category: string
  amount: number
  date: string
  dateIso: string
  description: string
}

export type OperationType = 'Cost' | 'Profit'
export type OperationSortType = 'ASC' | 'DESC'
export type OperationSortField = 'id' | 'createdAt' | 'updatedAt' | 'name' | 'date'

export type OperationsSorting = {
  type: OperationSortType
  field: OperationSortField
}

export type OperationDto = {
  id: string
  name: string
  desc?: string
  amount: number
  date: string
  type: OperationType
  category?: {
    id?: string
    name?: string
    photo?: string
  }
}

export type OperationsPagination = {
  pageSize: number
  pageNumber: number
  total: number
}
