import { PaymentOption } from 'claims/models/paymentOption'

import {
  weeklyRepaymentPlanData,
  twoWeeklyRepaymentPlanData,
  monthlyRepaymentPlanData } from 'test/data/entity/repaymentPlanData'

export const immediatelyPaymentIntentionData = {
  paymentOption: PaymentOption.IMMEDIATELY
}

export const bySetDatePaymentIntentionData = {
  paymentOption: PaymentOption.BY_SPECIFIED_DATE,
  paymentDate: '2050-12-31T00:00:00.000'
}

const baseInstalmentPaymentIntentionData = {
  paymentOption: PaymentOption.INSTALMENTS
}

export const weeklyInstalmentPaymentIntentionData = {
  ...baseInstalmentPaymentIntentionData,
  repaymentPlan: weeklyRepaymentPlanData
}

export const twoWeeklyInstalmentPaymentIntentionData = {
  ...baseInstalmentPaymentIntentionData,
  repaymentPlan: twoWeeklyRepaymentPlanData
}

export const monthlyInstalmentPaymentIntentionData = {
  ...baseInstalmentPaymentIntentionData,
  repaymentPlan: monthlyRepaymentPlanData
}
