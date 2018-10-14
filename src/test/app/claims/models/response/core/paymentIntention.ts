import { expect } from 'chai'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { MomentFactory } from 'shared/momentFactory'

describe('PaymentIntention', () => {
  describe('deserialize', () => {
    it('should deserialize payment intention', () => {
      const paymentIntention = PaymentIntention.deserialize({
        repaymentPlan: {
          instalmentAmount: 100,
          paymentSchedule: {
            value: PaymentSchedule.EVERY_MONTH.value
          },
          firstPaymentDate: MomentFactory.parse('2018-12-31'),
          completionDate: MomentFactory.parse('2019-12-31'),
          paymentLength: '10 weeks'
        } })

      expect(paymentIntention).to.be.instanceOf(PaymentIntention)
    })

    it('should deserialize without completion date or payment length', () => {
      const paymentIntention = PaymentIntention.deserialize({
        repaymentPlan: {
          instalmentAmount: 100,
          paymentSchedule: {
            value: PaymentSchedule.EVERY_MONTH.value
          },
          firstPaymentDate: MomentFactory.parse('2018-12-31'),
          completionDate: undefined,
          paymentLength: undefined
        } })

      expect(paymentIntention).to.be.instanceOf(PaymentIntention)
    })
  })
})
