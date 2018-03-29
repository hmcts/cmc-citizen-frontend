import { individualDetails } from './partyDetails'
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

export const claimDraft = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
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
    partyDetails: individualDetails,
    mobilePhone: {
      number: '07000000000'
    }
  },
  defendant: {
    partyDetails: individualDetails,
    email: {
      address: 'defendant@example.com'
    }
  },
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: 1
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
    reason: 'reason'
  } as InterestStartDate,
  interestEndDate: {
    option: InterestEndDateOption.SETTLED_OR_JUDGMENT
  } as InterestEndDate,
  reason: {
    reason: 'Because he did...'
  },
  timeline: {
    rows: [
      { date: 'Jan', description: 'OK' },
      { date: 'Feb', description: 'OK' },
      { date: 'Mar', description: 'OK' },
      { date: 'Apr', description: 'OK' },
      { date: 'May', description: 'OK' },
      { date: 'Jun', description: 'OK' }
    ]
  },
  evidence: {
    rows: [
      { type: EvidenceType.PHOTO.value, description: 'OK' },
      { type: EvidenceType.PHOTO.value, description: 'OK' },
      { type: EvidenceType.PHOTO.value, description: 'OK' },
      { type: EvidenceType.PHOTO.value, description: 'OK' },
      { type: EvidenceType.PHOTO.value, description: 'OK' },
      { type: EvidenceType.PHOTO.value, description: 'OK' }
    ], comment: 'I do not agree'
  }
}

/*
"timeline":{"rows":[{"date":"27 May 1997","description":"I signed a contract with GDM to say i would maintain the system for 18 years"},{"date":"27 May 2015","description":"The contact should have ended but i still pay for its maintainance"},{"date":"23 March 2018","description":"A milestone achievement, we should all be proud"},{}]},"evidence":{"rows":[{"type":{"value":"CONTRACTS_AND_AGREEMENTS","displayValue":"Contracts and agreements"},"description":"Contract stated that i must not damage the product for the 18 year period. However i have spent a considerable amount of money ensuring its maintenance. "},{"type":{"value":"PHOTO","displayValue":"Photo evidence"},"description":"At least 1 photo was taken ever year, on the anniversary of the contract."},{"type":{"value":"EXPERT_WITNESS","displayValue":"Expert witness"},"description":"The Co-Founder of the business was present in all the photos that i have submitted to evidence"},{"type":{"value":"STATEMENT_OF_ACCOUNT","displayValue":"Statements of account"},"description":"18 Years of Bank statements can support my claims"}]}
 */
