import { individual } from '../party'

export const responseData = {
  defendant: individual,
  moreTimeNeeded: 'no',
  freeMediation: 'no',
  responseType: 'PART_ADMISSION',
  partAdmissionType: 'AMOUNT_TOO_HIGH',
  howMuchOwed: {
    amount: 42,
    explanation: 'reasons'
  },
  impactOfDispute: 'very much',
  timeline: [],
  evidence: [],
  statementOfTruth: {
    signerName: 'Signy McSignface',
    signerRole: 'signer'
  }
}
