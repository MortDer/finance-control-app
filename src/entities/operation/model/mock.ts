import type { OperationRow } from './types'

export const incomeRows: OperationRow[] = [
  {
    key: '1',
    name: 'Зарплата',
    category: 'Работа',
    amount: 120000,
    date: '2026-03-01',
    source: 'Банк',
  },
  {
    key: '2',
    name: 'Фриланс',
    category: 'Подработка',
    amount: 35000,
    date: '2026-03-03',
    source: 'Перевод',
  },
]

export const expenseRows: OperationRow[] = [
  {
    key: '1',
    name: 'Продукты',
    category: 'Дом',
    amount: 8500,
    date: '2026-03-02',
    source: 'Карта',
  },
  {
    key: '2',
    name: 'Транспорт',
    category: 'Поездки',
    amount: 3200,
    date: '2026-03-04',
    source: 'Карта',
  },
]
