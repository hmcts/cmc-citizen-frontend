import { expect } from 'chai'
import { MomentFactory } from 'shared/momentFactory'

import { calculateInterest } from 'common/calculate-interest/calculateInterest'
import { mockCalculateInterestRate } from 'test/http-mocks/claim-store'

import { attachDefaultHooks } from 'test/hooks'

describe('calculateInterest', () => {
  attachDefaultHooks()

  it(`should return 0 without calling an API when interest period is 0 days`, async () => {
    const interestFromDate = MomentFactory.currentDateTime()
    const interestToDate = MomentFactory.currentDateTime()
    const amount = await calculateInterest(100, 8, interestFromDate, interestToDate)

    expect(amount).to.equal(0)
  })

  it(`should return interest value calculated by API when interest period is greater then 0 days`, async () => {
    mockCalculateInterestRate(0.08)

    const interestFromDate = MomentFactory.currentDateTime().subtract(1, 'year')
    const interestToDate = MomentFactory.currentDateTime()
    const amount = await calculateInterest(100, 8, interestFromDate, interestToDate)

    expect(amount).to.equal(0.08)
  })
})
