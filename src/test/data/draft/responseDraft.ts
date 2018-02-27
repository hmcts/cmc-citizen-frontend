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
      value: 'DEFENCE'
    }
  },
  defence: {
    text: 'My defence'
  },
  freeMediation: {
    option: 'no'
  },
  whenDidYouPay: {
    date: {
      year: 2017,
      month: 1,
      day: 1
    },
    text: 'I paid cash'
  }
}
