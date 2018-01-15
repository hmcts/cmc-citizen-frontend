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
    option: 'no'
  },
  response: {
    type: {
      value: 'PART_ADMISSION'
    }
  },
  rejectPartOfClaim: {
    option: 'amountTooHigh'
  },
  howMuchOwed: {
    amount: 42,
    text: 'reasons'
  },
  payBySetDate: {
    paymentDate: {
      date: {
        year: 1988,
        month: 2,
        day: 10
      }
    },
    explanation: {
      text: 'I can not pay now'
    }
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
