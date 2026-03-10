export type OperationRow = {
  key: string
  name: string
  categoryPhoto?: string
  category: string
  amount: number
  date: string
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
