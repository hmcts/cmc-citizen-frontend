import { individualDetails } from './partyDetails'
import { InterestType } from 'claim/form/models/interest'
import { InterestDateType } from 'app/common/interestDateType'
import { YesNoOption } from 'models/yesNoOption'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { DefendantAgeOption } from 'claim/form/models/eligibility/defendantAgeOption'

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
    type: InterestType.DIFFERENT,
    rate: 16,
    reason: 'High profile case'
  },
  interestDate: {
    type: InterestDateType.SUBMISSION
  },
  reason: {
    reason: 'Because he did...'
  }
}
