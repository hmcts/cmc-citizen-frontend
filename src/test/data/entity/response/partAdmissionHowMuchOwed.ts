import { individual } from '../party'
import { EvidenceType } from 'claims/models/response/evidence'

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
  timeline: [
    {
      date: 'Jan',
      description: 'OK'
    }
  ],
  evidence: [
    {
      type: EvidenceType.OTHER,
      description: 'OK'
    }
  ],
  statementOfTruth: {
    signerName: 'Signy McSignface',
    signerRole: 'signer'
  }
}
