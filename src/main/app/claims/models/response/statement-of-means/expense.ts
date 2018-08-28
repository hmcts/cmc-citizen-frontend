import { FrequencyBasedAmount } from 'claims/models/response/statement-of-means/frequencyBasedAmount'

export enum ExpenseType {
  MORTGAGE = 'MORTGAGE',
  RENT = 'RENT',
  COUNCIL_TAX = 'COUNCIL_TAX',
  GAS = 'GAS',
  ELECTRICITY = 'ELECTRICITY',
  WATER = 'WATER',
  TRAVEL = 'TRAVEL',
  SCHOOL_COSTS = 'SCHOOL_COSTS',
  FOOD_HOUSEKEEPING = 'FOOD_HOUSEKEEPING',
  TV_AND_BROADBAND = 'TV_AND_BROADBAND',
  HIRE_PURCHASES = 'HIRE_PURCHASES',
  MOBILE_PHONE = 'MOBILE_PHONE',
  MAINTENANCE_PAYMENTS = 'MAINTENANCE_PAYMENTS',
  OTHER = 'OTHER'
}

export interface Expense extends FrequencyBasedAmount {
  type: ExpenseType
  otherName?: string
}
