import { InterestRate } from 'claim/form/models/interestRate'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestDateType } from 'app/common/interestDateType'
import { YesNoOption } from 'models/yesNoOption'
import { Interest } from 'claim/form/models/interest'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'
import { InterestEndDate, InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDate } from 'claim/form/models/interestDate'
import { InterestStartDate } from 'claim/form/models/interestStartDate'
import { LocalDate } from 'forms/models/localDate'
import { EvidenceType } from 'forms/models/evidenceType'
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
      amount: 10000,
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
      hasCorrespondenceAddress: true,
      correspondenceAddress: {
        line1: 'Flat 10',
        line2: 'Street 10',
        line3: 'Cooler house name',
        city: 'London',
        postcode: 'SW1A 1AA'
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
      hasCorrespondenceAddress: true,
      correspondenceAddress: {
        line1: 'Flat 13',
        line2: 'Street 10',
        line3: 'Coolest house name',
        city: 'London',
        postcode: 'SW1A 1AA'
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
    email: {
      address: 'civilmoneyclaims+Generic-Claim@gmail.com'
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
    option: YesNoOption.YES
  } as Interest,
  interestType: {
    option: InterestTypeOption.SAME_RATE
  } as InterestType,
  interestRate: {
    type: InterestRateOption.DIFFERENT,
    rate: 10,
    reason: 'Special case'
  } as InterestRate,
  interestDate: {
    type: InterestDateType.CUSTOM
  } as InterestDate,
  interestStartDate: {
    date: {
      day: 1,
      month: 1,
      year: 2018
    } as LocalDate,
    reason: 'Im interest-ed in getting more money'
  } as InterestStartDate,
  interestEndDate: {
    option: InterestEndDateOption.SETTLED_OR_JUDGMENT
  } as InterestEndDate,
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
    rows: [
      {
        type: EvidenceType.STATEMENT_OF_ACCOUNT,
        description: 'Statement of account'
      },
      {
        type: EvidenceType.RECEIPTS,
        description: 'Description of receipt'
      },
      {
        type: EvidenceType.OTHER,
        description: 'Description of Other'
      }
    ]
  }
}
