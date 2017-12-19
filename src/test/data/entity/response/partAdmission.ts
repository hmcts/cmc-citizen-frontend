import { individual } from '../party'

export const responseData = {
  defendant: individual,
  moreTimeNeeded: 'no',
  freeMediation: 'no',
  responseType: 'PART_ADMISSION',
  partAdmissionType: 'AMOUNT_TOO_HIGH',
  howMuchOwed: {
    amount: 42,
    reason: 'reasons'
  },
  timeline: [],
  evidence: [],
  statementOfTruth: {
    signerName: 'Signy McSignface',
    signerRole: 'signer'
  }
}
