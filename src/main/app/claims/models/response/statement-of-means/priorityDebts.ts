import { FrequencyBasedAmount } from 'claims/models/response/statement-of-means/frequencyBasedAmount'

export enum PriorityDebtType {
  MORTGAGE = 'MORTGAGE',
  RENT = 'RENT',
  COUNCIL_TAX = 'COUNCIL_TAX_COMMUNITY_CHARGE',
  GAS = 'GAS',
  ELECTRICITY = 'ELECTRICITY',
  WATER = 'WATER',
  MAINTENANCE_PAYMENTS = 'MAINTENANCE_PAYMENTS'
}

export interface PriorityDebts extends FrequencyBasedAmount {
  type: PriorityDebtType
  otherName?: string
}
