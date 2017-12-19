import { individualDetails } from '../partyDetails'

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
  timeline: [],
  evidence: [],
  qualifiedStatementOfTruth: {
    signerName: 'Signy McSignface',
    signerRole: 'signer'
  }
}
