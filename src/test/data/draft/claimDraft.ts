import { individualDetails } from './partyDetails'
import { InterestRate, InterestRateOption } from 'claim/form/models/interestRate'
import { InterestDateType } from 'app/common/interestDateType'
import { YesNoOption } from 'models/yesNoOption'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { DefendantAgeOption } from 'claim/form/models/eligibility/defendantAgeOption'
import { Interest, InterestOption } from 'claim/form/models/interest'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'
import { InterestEndDate, InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDate } from 'claim/form/models/interestDate'
import { InterestStartDate } from 'claim/form/models/interestStartDate'

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
      id: 12,
      amount: 10000,
      state: { status: 'success' }
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
    option: InterestOption.YES
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
    type: InterestDateType.SUBMISSION
  } as InterestDate,
  interestStartDate: {
    date: {
      day: 10,
      month: 12,
      year: 2016
    },
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
  }
}
