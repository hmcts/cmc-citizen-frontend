import { PaymentOption, PaymentSchedule } from 'claims/models/response/fullDefenceAdmission'
import { individual } from 'test/data/entity/party'

const baseResponseData = {
  defendant: individual,
  moreTimeNeeded: 'no'
}

const baseDefenceData = {
  responseType: 'FULL_DEFENCE',
  defence: 'My defence',
  freeMediation: 'no'
}

export const defenceWithDisputeData = {
  ...baseResponseData,
  ...baseDefenceData,
  defenceType: 'DISPUTE'
}

export const defenceWithAmountClaimedAlreadyPaidData = {
  ...baseResponseData,
  ...baseDefenceData,
  defenceType: 'ALREADY_PAID',
  paymentDeclaration: {
    paidDate: '2017-12-31',
    explanation: 'I paid in cash'
  }
}

const baseFullAdmissionData = {
  responseType: 'FULL_ADMISSION',
  freeMediation: undefined
}

export const fullAdmissionWithImmediatePaymentData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentOption: PaymentOption.IMMEDIATELY
}

export const fullAdmissionWithPaymentBySetDateData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentOption: PaymentOption.FULL_BY_SPECIFIED_DATE,
  paymentDate: '2050-12-31'
}

export const fullAdmissionWithPaymentByInstalmentsData = {
  ...baseResponseData,
  ...baseFullAdmissionData,
  paymentOption: PaymentOption.INSTALMENTS,
  repaymentPlan: {
    instalmentAmount: 100,
    firstPaymentDate: '2050-12-31',
    paymentSchedule: PaymentSchedule.EACH_WEEK
  }
}
