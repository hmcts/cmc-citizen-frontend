import { individual } from './party'

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
    type: 'different',
    rate: 16,
    reason: 'High profile case'
  },
  interestDate: {
    type: 'submission'
  },
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
