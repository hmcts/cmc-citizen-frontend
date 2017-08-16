import * as mock from 'mock-require'

mock('fees/feesClient', {
  'default': {
    calculateIssueFee: (amount) => Promise.resolve(100),
    calculateHearingFee: (amount) => Promise.resolve(50)
  }
})
