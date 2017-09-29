import { expect } from 'chai'

import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'

describe('PaymentSchedule', () => {

  describe('of', () => {
    it('should return valid object for valid input', () => {
      const paymentSchedule: PaymentSchedule = PaymentSchedule.of(PaymentSchedule.EACH_WEEK.value)

      expect(paymentSchedule instanceof PaymentSchedule).to.equal(true)
      expect(paymentSchedule.value).to.equal(PaymentSchedule.EACH_WEEK.value)
      expect(paymentSchedule.displayValue).to.equal(PaymentSchedule.EACH_WEEK.displayValue)
    })

    it('should throw exception for invalid input', () => {
      try {
        PaymentSchedule.of('unknown')
      } catch (e) {
        expect(e.message).to.equal(`There is no PaymentSchedule: 'unknown'`)
      }
    })
  })
})
