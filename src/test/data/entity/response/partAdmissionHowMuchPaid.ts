import { individual } from '../party'
import { EvidenceType } from 'claims/models/response/evidence'

export const responseData = {
  defendant: individual,
  moreTimeNeeded: 'no',
  freeMediation: 'yes',
  responseType: 'PART_ADMISSION',
  partAdmissionType: 'PAID_WHAT_BELIEVED_WAS_OWED',
  howMuchPaid: {
    amount: 42,
    date: {
      year: 1999,
      month: 1,
      day: 1
    },
    text: 'reasons'
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
