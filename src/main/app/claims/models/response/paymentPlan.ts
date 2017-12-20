import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'

export enum PaymentSchedule {
  EACH_WEEK = 'EACH_WEEK',
  EVERY_TWO_WEEKS = 'EVERY_TWO_WEEKS',
  EVERY_MONTH = 'EVERY_MONTH'
}

export interface PaymentPlan {
  firstPayment: number
  firstPaymentDate: Moment
  instalmentAmount: number
  paymentSchedule: PaymentSchedule
  explanation: string
}

export namespace PaymentPlan {
  export function deserialize (input: any): PaymentPlan {
    if (input) {
      return {
        firstPayment: input.firstPayment,
        firstPaymentDate: MomentFactory.parse(input.firstPaymentDate),
        instalmentAmount: input.instalmentAmount,
        paymentSchedule: input.paymentSchedule,
        explanation: input.explanation
      }
    }
  }
}
