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
  dateSortValue: number
  description: string
}

export type OperationType = 'Cost' | 'Profit'

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
