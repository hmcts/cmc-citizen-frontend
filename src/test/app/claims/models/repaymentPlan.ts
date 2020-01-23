import { expect } from 'chai'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'

describe('RepaymentPlan', () => {
  describe('deserialize', () => {
    it('should return undefined when undefined input given', () => {
      const actual: RepaymentPlan = new RepaymentPlan().deserialize(undefined)

      expect(actual.paymentSchedule).to.be.eq(undefined)
    })

    it('should deserialize valid JSON to valid instance of RepaymentPlan object', () => {
      const actual: RepaymentPlan = new RepaymentPlan().deserialize({
        instalmentAmount: 50,
        firstPaymentDate: { year: 2018, month: 10, day: 10 },
        paymentSchedule: PaymentSchedule.EVERY_MONTH.value
      })

      expect(actual).to.be.instanceof(RepaymentPlan)
    })
  })
})
