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
}

type GetOperationsResult = {
  data: OperationDto[]
  pagination: OperationsPagination
}

export async function getOperations(params: GetOperationsParams): Promise<GetOperationsResult> {
  const query = new URLSearchParams({
    type: JSON.stringify(params.type),
    pagination: JSON.stringify({
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    }),
  })
  const response = await http.get<OperationsResponse>(`/operations?${query.toString()}`)

  return {
    data: response.data.data || [],
    pagination: response.data.pagination || {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      total: 0,
    },
  }
}
