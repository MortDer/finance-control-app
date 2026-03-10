import { http } from '../../../shared/api/http'
import type { OperationDto, OperationsPagination, OperationType } from '../model/types'

type OperationsResponse = {
  data: OperationDto[]
  pagination: OperationsPagination
}

type GetOperationsParams = {
  type: OperationType
  pageNumber: number
  pageSize: number
  signal?: AbortSignal
}

type GetOperationsResult = {
  data: OperationDto[]
  pagination: OperationsPagination
}

type CreateOperationParams = {
  name: string
  desc?: string
  amount: number
  date: string
  type: OperationType
  categoryId: string
}

export async function getOperations(params: GetOperationsParams): Promise<GetOperationsResult> {
  const query = new URLSearchParams({
    type: JSON.stringify(params.type),
    pagination: JSON.stringify({
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    }),
  })
  const response = await http.get<OperationsResponse>(`/operations?${query.toString()}`, {
    signal: params.signal,
  })

  return {
    data: response.data.data || [],
    pagination: response.data.pagination || {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      total: 0,
    },
  }
}

export async function createOperation(params: CreateOperationParams): Promise<OperationDto> {
  const response = await http.post<OperationDto>('/operations', params)
  return response.data
}
