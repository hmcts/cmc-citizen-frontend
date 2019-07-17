import { individual } from 'test/data/entity/party'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDateType } from 'common/interestDateType'
import { Interest } from 'claims/models/interest'
import * as moment from 'moment'

export const interestDateData = {
  type: InterestDateType.CUSTOM,
  date: moment({ year: 2018, month: 0, day: 1 }),
  reason: 'reason',
  endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
}

export const interestData = {
  interestBreakdown: undefined,
  type: InterestRateOption.DIFFERENT,
  rate: 10,
  reason: 'Special case',
  interestDate: interestDateData
}

export const claimData = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  claimants: [{ ...individual, email: undefined }],
  defendants: [{ ...individual, phone: undefined }],
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
  interest: interestData as Interest,
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
