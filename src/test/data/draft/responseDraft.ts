import { individualDetails } from './partyDetails'

export const responseDraft = {
  defendantDetails: {
    partyDetails: individualDetails,
    mobilePhone: {
      number: '0700000000'
    },
    email: {
      address: 'user@example.com'
    }
  },
  moreTimeNeeded: {
    option: 'no'
  },
  response: {
    type: {
      value: 'OWE_NONE'
    }
  },
  defence: {
    text: 'My defence'
  },
  freeMediation: {
    option: 'no'
  }
}
