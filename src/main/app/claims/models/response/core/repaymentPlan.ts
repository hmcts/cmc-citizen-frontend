import { Moment } from 'moment'

import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

export interface RepaymentPlan {
  instalmentAmount: number
  firstPaymentDate: Moment
  paymentSchedule: PaymentSchedule
  completionDate?: Moment
  paymentLength?: string
}
