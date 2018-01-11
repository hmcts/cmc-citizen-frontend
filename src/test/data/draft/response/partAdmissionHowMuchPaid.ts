import { individualDetails } from '../partyDetails'
import { EvidenceType } from 'response/form/models/evidenceType'

export const responseDraft = {
  defendantDetails: {
    partyDetails: individualDetails,
    mobilePhone: {
      number: '0700000001'
    },
    email: {
      address: 'individual@example.com'
    }
  },
  moreTimeNeeded: {
    option: 'no'
  },
  freeMediation: {
    option: 'yes'
  },
  response: {
    type: {
      value: 'PART_ADMISSION'
    }
  },
  rejectPartOfClaim: {
    option: 'paidWhatBelievedWasOwed'
  },
  howMuchPaid: {
    amount: 42,
    date: {
      year: 1999,
      month: 1,
      day: 1
    },
    text: 'reasons'
  },
  impactOfDispute: {
    text: 'very much'
  },
  timeline: {
    rows: [
      {
        date: 'Jan',
        description: 'OK'
      }
    ]
  },
  evidence: {
    rows: [
      {
        type: EvidenceType.OTHER,
        description: 'OK'
      }
    ]
  },
  qualifiedStatementOfTruth: {
    signerName: 'Signy McSignface',
    signerRole: 'signer'
  }
}
