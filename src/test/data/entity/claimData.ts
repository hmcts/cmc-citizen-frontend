import { individual } from './party'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'
import { InterestRate, InterestRateOption } from 'claim/form/models/interestRate'
import { InterestEndDate, InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDateType } from 'app/common/interestDateType'
import { InterestDate } from 'claim/form/models/interestDate'
import { InterestStartDate } from 'claim/form/models/interestStartDate'
import { Interest, InterestOption } from 'claim/form/models/interest'

export const claimData = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  claimant: { ...individual, email: undefined },
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
  reason: 'Because he did...',
  feeAmountInPennies: 10000,
  payment: {
    amount: 10000,
    id: 12,
    state: {
      status: 'success'
    }
  },
  timeline: {
    rows: []
  }
}
