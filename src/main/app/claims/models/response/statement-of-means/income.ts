import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'

export enum IncomeType {
  JOB = 'JOB',
  UNIVERSAL_CREDIT = 'UNIVERSAL_CREDIT',
  JOB_SEEKERS_ALLOWANCE_INCOME_BASES = 'JOB_SEEKERS_ALLOWANCE_INCOME_BASES',
  JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED = 'JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED',
  INCOME_SUPPORT = 'INCOME_SUPPORT',
  WORKING_TAX_CREDIT = 'WORKING_TAX_CREDIT',
  CHILD_TAX_CREDIT = 'CHILD_TAX_CREDIT',
  CHILD_BENEFIT = 'CHILD_BENEFIT',
  COUNCIL_TAX_SUPPORT = 'COUNCIL_TAX_SUPPORT',
  PENSION = 'PENSION',
  OTHER = 'OTHER'
}

export interface Income {
  type: IncomeType
  otherSource: string
  frequency: PaymentFrequency
  amountReceived: number
}
