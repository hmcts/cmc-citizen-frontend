import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'

export interface FrequencyBasedAmount {
  frequency: PaymentFrequency
  amount: number
}
