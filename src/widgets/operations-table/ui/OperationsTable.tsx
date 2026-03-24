import { Alert, Button, Table } from 'antd'
import type { TableProps } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCategories } from '../../../entities/category/model/useCategories'
import type { OperationRow } from '../../../entities/operation/model/types'
import { getApiErrorMessage } from '../../../shared/api/getApiErrorMessage'
import { CreateOperationModal } from '../../../features/operation-create/ui/CreateOperationModal'
import type { OperationType } from '../../../entities/operation/model/types'
import { getOperationsColumns } from '../lib/getOperationsColumns'
import { useOperationRowEdit } from '../model/useOperationRowEdit'
import { useOperationsTableData } from '../model/useOperationsTableData'

type OperationsTableProps = {
  authToken: string
  operationType: OperationType
  titleKey: 'tableTitleIncomes' | 'tableTitleExpenses'
}

export function OperationsTable({ authToken, operationType, titleKey }: OperationsTableProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollY, setScrollY] = useState(260)
  const {
    rows,
    isLoading,
    errorText,
    setErrorText,
    pagination,
    setPagination,
    sorting,
    setSorting,
    isCreateModalOpen,
    setIsCreateModalOpen,
    actionLoading,
    refetchOperations,
    saveOperation,
    removeOperationById,
  } = useOperationsTableData({ authToken, operationType, t })
  const {
    categories,
    isLoading: isLoadingCategories,
    isActionLoading: isCategoryActionLoading,
    error: categoriesError,
    clearError: clearCategoriesError,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories({ enabled: Boolean(authToken) })
  const { editingRowId, editDraft, isEditing, beginEdit, setDraftField, resetEdit } = useOperationRowEdit()

  useEffect(() => {
    if (!categoriesError) {
      return
    }
    setErrorText(getApiErrorMessage(categoriesError, t('categoriesLoadError')))
    clearCategoriesError()
  }, [categoriesError, clearCategoriesError, setErrorText, t])

  useEffect(() => {
    const updateScrollY = () => {
      const containerHeight = containerRef.current?.clientHeight ?? 0
      const errorReserved = errorText ? 72 : 0
      const reservedHeight = 150 + errorReserved
      setScrollY(Math.max(180, containerHeight - reservedHeight))
    }

    updateScrollY()
    const resizeObserver = new ResizeObserver(updateScrollY)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [errorText, pagination.pageSize])

  const saveEdit = async () => {
    if (!editDraft) {
      return
    }
    if (!editDraft.name.trim() || !editDraft.categoryId || !editDraft.dateIso || !editDraft.amount) {
      setErrorText(t('requiredField'))
      return
    }

    const isSaved = await saveOperation(editDraft)
    if (isSaved) {
      resetEdit()
    }
  }

  const removeOperation = async (id: string) => {
    const isDeleted = await removeOperationById(id)
    if (isDeleted && editingRowId === id) {
      resetEdit()
    }
  }

  const columns = getOperationsColumns({
    t,
    authToken,
    categories,
    editDraft,
    actionLoading,
    sorting,
    isEditing,
    beginEdit,
    setDraftField,
    saveEdit: () => void saveEdit(),
    removeOperation: (id) => void removeOperation(id),
  })

  const handleTableChange: TableProps<OperationRow>['onChange'] = (
    _nextPagination,
    _filters,
    sorter,
    extra,
  ) => {
    if (extra.action !== 'sort') {
      return
    }

    if (Array.isArray(sorter)) {
      return
    }

    const field = sorter.field
    const order = sorter.order

    if ((field !== 'name' && field !== 'date') || !order) {
      setSorting(undefined)
      setPagination((prev) => ({ ...prev, pageNumber: 1 }))
      return
    }

    setSorting({
      field,
      type: order === 'ascend' ? 'ASC' : 'DESC',
    })
    setPagination((prev) => ({ ...prev, pageNumber: 1 }))
  }

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {errorText ? (
        <Alert
          type="error"
          showIcon
          title={errorText}
          action={<Button onClick={refetchOperations}>{t('retry')}</Button>}
        />
      ) : null}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Table
          columns={columns}
          dataSource={rows}
          loading={isLoading}
          scroll={{ y: scrollY }}
          sticky
          title={() => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{t(titleKey)}</span>
              {authToken ? (
                <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
                  {t('addOperation')}
                </Button>
              ) : null}
            </div>
          )}
          pagination={{
            current: pagination.pageNumber,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (pageNumber, pageSize) => setPagination((prev) => ({ ...prev, pageNumber, pageSize })),
          }}
          onChange={handleTableChange}
        />
      </div>
      <CreateOperationModal
        open={isCreateModalOpen}
        operationType={operationType}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        isCategoryActionLoading={isCategoryActionLoading}
        onCreateCategory={createCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetchOperations}
      />
    </div>
  )
}
