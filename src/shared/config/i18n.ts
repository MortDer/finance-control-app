import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ru: {
    translation: {
      appTitle: 'Учет доходов и расходов',
      language: 'Язык',
      theme: 'Тема',
      darkMode: 'Темная',
      incomesTab: 'Доходы',
      expensesTab: 'Расходы',
      tableTitleIncomes: 'Список доходов',
      tableTitleExpenses: 'Список расходов',
      name: 'Название',
      category: 'Категория',
      amount: 'Сумма',
      date: 'Дата',
      source: 'Источник',
    },
  },
  en: {
    translation: {
      appTitle: 'Income & Expense Tracker',
      language: 'Language',
      theme: 'Theme',
      darkMode: 'Dark',
      incomesTab: 'Incomes',
      expensesTab: 'Expenses',
      tableTitleIncomes: 'Income list',
      tableTitleExpenses: 'Expense list',
      name: 'Name',
      category: 'Category',
      amount: 'Amount',
      date: 'Date',
      source: 'Source',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
