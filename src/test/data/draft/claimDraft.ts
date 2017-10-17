import { individualDetails } from './partyDetails'
import { InterestType } from 'claim/form/models/interest'
import { InterestDateType } from 'app/common/interestDateType'

export const claimDraft = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  readResolveDispute: true,
  readCompletingClaim: true,
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
