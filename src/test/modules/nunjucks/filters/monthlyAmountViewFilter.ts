import { expect } from 'chai'

import { MonthlyAmountViewFilter } from 'main/features/claimant-response/filters/monthly-amount-view-filter'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'

describe('MonthlyAmountViewFilter', () => {
  const amount: number = 10
  it('converts FOUR_WEEKS amount to monthly', () => {
    expect(MonthlyAmountViewFilter.render({ frequency: PaymentFrequency.FOUR_WEEKS, amount : amount })).to.eq(10.833333333333332)
  })

  it('converts WEEK amount to monthly', () => {
    expect(MonthlyAmountViewFilter.render({ frequency: PaymentFrequency.WEEK, amount : amount })).to.eq(43.33333333333333)
  })

  it('converts TWO_WEEKS amount to monthly', () => {
    expect(MonthlyAmountViewFilter.render({ frequency: PaymentFrequency.TWO_WEEKS, amount : amount })).to.eq(21.666666666666664)
  })

  it('returns MONTH amount when MONTH given', () => {
    expect(MonthlyAmountViewFilter.render({ frequency: PaymentFrequency.MONTH, amount : amount })).to.eq(10)
  })

  describe('throws exception when', () => {
    it('undefined given', () => {
      expectToThrowError(undefined)
    })

    it('no amount given', () => {
      expectToThrowError({ frequency: PaymentFrequency.MONTH })
    })

    it('no frequency given', () => {
      expectToThrowError({ amount : 10 })
    })
  })
})

function expectToThrowError (input: any): void {
  expect(() => {
    MonthlyAmountViewFilter.render(input)
  }).to.throw(Error, 'Must be a valid FrequencyBasedAmount')
}
