import { YesNoOption } from 'models/yesNoOption'
import * as uuid from 'uuid'
import { PartyType } from 'app/common/partyType'

export const claimDraft = {
  externalId: uuid(),
  readResolveDispute: true,
  readCompletingClaim: true,
  eligibility: true,
  claimant: {
    payment: {
      reference: '123',
      date_created: 12345,
      amount: 8500,
      status: 'Success',
      _links: {
        next_url: {
          href: 'any href',
          method: 'POST'
        }
      }
    },
    partyDetails: {
      type: PartyType.INDIVIDUAL.value,
      name: 'Jack Davids',
      address: {
        line1: 'Flat 1',
        line2: 'Street 1',
        line3: 'Cool house name',
        city: 'London',
        postcode: 'SW1A 2AA'
      },
      dateOfBirth: {
        known: true,
        date: {
          year: 1997,
          month: 5,
          day: 27
        }
      }
    },
    mobilePhone: {
      number: '07112358132'
    }
  },
  defendant: {
    partyDetails: {
      type: PartyType.INDIVIDUAL.value,
      name: 'Daniel Murphy',
      address: {
        line1: 'Flat 3',
        line2: 'Street 1',
        line3: 'Cooler house name',
        city: 'London',
        postcode: 'SW1A 2AA'
      },
      hasCorrespondenceAddress: false,
      dateOfBirth: {
        known: true,
        date: {
          year: 1997,
          month: 5,
          day: 27
        }
      }
    },
    email: {
      address: ''
    }
  },
  amount: {
    rows: [
      {
        reason: 'Bakery Cost',
        amount: 3141.59
      }
    ]
  },
  interest: {
    option: YesNoOption.NO
  },
  reason: {
    reason: 'A strong sense of entitlement.'
  },
  timeline: {
    rows: [
      { date: '27 May 1997', description: 'The day the first bill was issued' },
      { date: '23 March 2018', description: 'A historic day with enormous importance' }
    ]
  },
  evidence: {
    rows: []
  }
}
