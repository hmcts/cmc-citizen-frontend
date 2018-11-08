import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

const baseRepaymentPlanData = {
  instalmentAmount: 100,
  firstPaymentDate: '2050-12-31T00:00:00.000',
  completionDate: '2052-12-31T00:00:00.000',
  paymentLength: '2 years'
}

export const weeklyRepaymentPlanData = {
  ...baseRepaymentPlanData,
  paymentSchedule: PaymentSchedule.EACH_WEEK
}

export const twoWeeklyRepaymentPlanData = {
  ...baseRepaymentPlanData,
  paymentSchedule: PaymentSchedule.EVERY_TWO_WEEKS
}

export const monthlyRepaymentPlanData = {
  ...baseRepaymentPlanData,
  paymentSchedule: PaymentSchedule.EVERY_MONTH
}
