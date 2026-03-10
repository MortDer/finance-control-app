import { OperationsTable } from '../../../widgets/operations-table/ui/OperationsTable'

type OperationsExpensePageProps = {
  authToken: string
}

export function OperationsExpensePage({ authToken }: OperationsExpensePageProps) {
  return <OperationsTable authToken={authToken} operationType="Cost" titleKey="tableTitleExpenses" />
}
