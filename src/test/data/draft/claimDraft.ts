import { individualDetails, defendantIndividualDetails } from 'test/data/draft/partyDetails'
import { InterestRate } from 'claim/form/models/interestRate'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestDateType } from 'common/interestDateType'
import { YesNoOption } from 'models/yesNoOption'
import { Interest } from 'claim/form/models/interest'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'
import { InterestEndDate, InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDate } from 'claim/form/models/interestDate'
import { InterestStartDate } from 'claim/form/models/interestStartDate'
import { LocalDate } from 'forms/models/localDate'
import { ClaimValue } from 'eligibility/model/claimValue'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'

export const claimDraft = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  readResolveDispute: true,
  readCompletingClaim: true,
  eligibility: {
    claimantAddress: YesNoOption.YES,
    defendantAddress: YesNoOption.YES,
    claimValue: ClaimValue.UNDER_10000,
    eighteenOrOver: YesNoOption.YES,
    defendantAge: DefendantAgeOption.YES,
    governmentDepartment: YesNoOption.NO,
    helpWithFees: YesNoOption.NO,
    claimIsForTenancyDeposit: YesNoOption.NO
  },
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
    phone: {
      number: '07000000000'
    }
  },
  defendant: {
    partyDetails: defendantIndividualDetails,
    email: {
      address: 'defendant@example.com'
    },
    mobilePhone: {
      number: '07284798778'
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
    rows: []
  },
  evidence: {
    rows: []
  }
}
