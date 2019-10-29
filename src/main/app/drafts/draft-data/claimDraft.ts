import { YesNoOption } from 'models/yesNoOption'
import * as uuid from 'uuid'
import { PartyType } from 'common/partyType'

export function prepareClaimDraft (userEmailAddress: string) {
  return {
    externalId: uuid(),
    eligibility: true,
    readResolveDispute: true,
    readCompletingClaim: true,
    claimant: {
      partyDetails: {
        type: PartyType.INDIVIDUAL.value,
        name: 'Jan Clark',
        address: {
          line1: 'Street 1',
          line2: 'Street 2',
          line3: 'Street 3',
          city: 'London',
          postcode: 'SW1H 9AJ'
        },
        dateOfBirth: {
          known: true,
          date: {
            year: 2000,
            month: 1,
            day: 1
          }
        }
      },
      phone: {
        number: '(0)207 127 0000'
      }
    },
    defendant: {
      partyDetails: {
        type: PartyType.INDIVIDUAL.value,
        title: 'Mrs.',
        firstName: 'Mary',
        lastName: 'Richards',
        address: {
          line1: 'Flat 3A',
          line2: 'Street 1',
          line3: 'Middle Road',
          city: 'London',
          postcode: 'SW1H 9AJ'
        }
      },
      email: {
        address: userEmailAddress
      },
      phone: {
        number: ''
      }
    },
    amount: {
      rows: [
        {
          reason: 'Roof Fix & repairs to leak',
          amount: 75
        }
      ]
    },
    interest: {
      option: YesNoOption.NO
    },
    reason: {
      reason: 'A strong sense of entitlement that would explain my reasons of the claim, that the Roof work and leaks that followed were done below standards set by the council inspector'
    },
    timeline: {
      rows: [
        { date: '01 October 2017', description: 'The day the first bill was issued' },
        { date: '26 March 2018', description: 'A historic day with enormous importance' },
        { date: '14 June 2018', description: 'line to explain what happened and when' }
      ]
    }
  }
}
