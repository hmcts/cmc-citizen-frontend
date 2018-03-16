import { individual } from './party'
import { InterestTypeOption } from 'claim/form/models/interestType'
import { InterestRateOption } from 'claim/form/models/interestRate'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDateType } from 'app/common/interestDateType'
import { InterestDate } from 'claims/models/interestDate'
import { Interest } from 'claims/models/interest'
import { LocalDate } from 'forms/models/localDate'

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
    option: InterestTypeOption.SAME_RATE,
    type: InterestRateOption.DIFFERENT,
    rate: 10,
    reason: 'Special case'
  } as Interest,
  interestDate: {
    type: InterestDateType.CUSTOM,
    date: {
      day: 10,
      month: 12,
      year: 2016
    } as LocalDate,
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
  }
}
