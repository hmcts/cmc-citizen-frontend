import { FrequencyBasedAmount } from 'claims/models/response/statement-of-means/frequencyBasedAmount'

export enum ArrearType {
  MORTGAGE = 'MORTGAGE',
  RENT = 'RENT',
  COUNCIL_TAX = 'COUNCIL_TAX',
  OTHER = 'OTHER'
}

export interface Arrear extends FrequencyBasedAmount {
  type: ArrearType
  otherName?: string
}
