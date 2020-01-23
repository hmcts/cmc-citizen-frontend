import { expect } from 'chai'

import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { PaymentSchedule as PS } from 'claims/models/response/core/paymentSchedule'
import { Frequency } from 'common/frequency/frequency'

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

    it('should return correct frequency for payment schedule', () => {
      expect(PaymentSchedule.toFrequency(PS.EACH_WEEK)).to.equal(Frequency.WEEKLY)
      expect(PaymentSchedule.toFrequency(PS.EVERY_TWO_WEEKS)).to.equal(Frequency.TWO_WEEKLY)
      expect(PaymentSchedule.toFrequency(PS.EVERY_MONTH)).to.equal(Frequency.MONTHLY)
    })
  })
})
