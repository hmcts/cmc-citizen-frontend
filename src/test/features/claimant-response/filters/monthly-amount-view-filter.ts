import { expect } from 'chai'
import { MonthlyAmountViewFilter } from 'claimant-response/filters/monthly-amount-view-filter'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'

const errorMessage = 'Must be a valid FrequencyBasedAmount'

describe('Monthly amount view filter', () => {
  context('should throw error when', () => {
    it('is null', () => {
      expect(() => MonthlyAmountViewFilter.render(null)).to.throw(errorMessage)
    })

    it('is undefined', () => {
      expect(() => MonthlyAmountViewFilter.render(undefined)).to.throw(errorMessage)
    })

    it('has no amount', () => {
      expect(() => MonthlyAmountViewFilter.render({
        frequency: PaymentFrequency.MONTH,
        amount: undefined
      })).to.throw(errorMessage)
    })

    it('has no frequency', () => {
      expect(() => MonthlyAmountViewFilter.render({
        frequency: undefined,
        amount: 100
      })).to.throw(errorMessage)
    })

    it('has negative amount', () => {
      expect(() => MonthlyAmountViewFilter.render({
        frequency: PaymentFrequency.FOUR_WEEKS,
        amount: -1
      })).to.throw(errorMessage)
    })
  })

  context('with valid data', () => {
    function test (frequency: PaymentFrequency, inputAmount: number, expectedAmount: number) {
      const actualAmount: number = MonthlyAmountViewFilter.render({
        frequency: frequency,
        amount: inputAmount
      })
      const roundedAmount: number = +actualAmount.toFixed(2)
      expect(roundedAmount).to.equal(expectedAmount)
    }

    it('should return same amount for monthly frequency', () => {
      test(PaymentFrequency.MONTH, 123.45, 123.45)
    })

    it('should convert four-weekly frequency', () => {
      test(PaymentFrequency.FOUR_WEEKS, 123.45, 133.74)
    })

    it('should convert two-weekly frequency', () => {
      test(PaymentFrequency.TWO_WEEKS, 123.45, 267.47)
    })

    it('should convert weekly frequency', () => {
      test(PaymentFrequency.WEEK, 123.45, 534.95)
    })

    it('should accept zero amount', () => {
      test(PaymentFrequency.MONTH, 0, 0)
    })
  })
})
