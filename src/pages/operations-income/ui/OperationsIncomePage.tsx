import { OperationsTable } from '../../../widgets/operations-table/ui/OperationsTable'

type OperationsIncomePageProps = {
  authToken: string
}

export function OperationsIncomePage({ authToken }: OperationsIncomePageProps) {
  return <OperationsTable authToken={authToken} operationType="Profit" titleKey="tableTitleIncomes" />
}
