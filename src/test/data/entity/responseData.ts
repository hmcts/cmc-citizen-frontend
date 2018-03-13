import { individual } from './party'

const baseResponseData = {
  defendant: individual,
  moreTimeNeeded: 'no',
  freeMediation: 'no'
}

const baseDefenceData = {
  responseType: 'FULL_DEFENCE',
  defence: 'My defence'
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
