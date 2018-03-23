import { individual } from './party'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDateType } from 'app/common/interestDateType'
import { InterestDate } from 'claims/models/interestDate'
import { Interest } from 'claims/models/interest'
import { LocalDate } from 'forms/models/localDate'
import { InterestBreakdown } from 'claims/models/InterestBreakdown'

export const claimData = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  claimants: [{ ...individual, email: undefined }],
  defendants: [{ ...individual, mobilePhone: undefined }],
  amount: {
    rows: [
      {
        amount: 1,
        reason: 'Valid reason'
      },
      {
        amount: undefined,
        reason: undefined
      },
      {
        amount: undefined,
        reason: undefined
      },
      {
        amount: undefined,
        reason: undefined
      }
    ],
    type: 'breakdown'
  },
  interest: {
    interestBreakdown: {
      explanation: undefined,
      totalAmount: undefined
    } as InterestBreakdown,
    type: InterestRateOption.DIFFERENT,
    rate: 10,
    reason: 'Special case'
  } as Interest,
  interestDate: {
    type: InterestDateType.CUSTOM,
    date: new LocalDate(2018, 1, 1).asString(),
    reason: 'reason',
    endDate: InterestEndDateOption.SETTLED_OR_JUDGMENT
  } as InterestDate,
  reason: 'Because he did...',
  feeAmountInPennies: 1000000,
  payment: {
    reference: '123',
    date_created: 12345,
    amount: 10000,
    status: 'Success'
  },
  timeline: {
    rows: []
  },
  evidence: {
    rows: []
  }
}
