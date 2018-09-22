/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentType } from 'main/common/components/payment-intention/model/paymentOption'
import { MomentFactory } from 'shared/momentFactory'

import {
  intentionOfImmediatePayment,
  intentionOfPaymentInFullBySetDate,
  intentionOfPaymentByInstallments
} from 'test/data/draft/paymentIntentionDraft'

describe('PaymentIntention', () => {
  describe('toDomainInstance', () => {
    it('should convert immediate payment', () => {
      const paymentIntention = PaymentIntention.deserialise(intentionOfImmediatePayment)

      const result = paymentIntention.toDomainInstance()
      expect(result.paymentOption).to.be.equal(PaymentType.IMMEDIATELY)
      expect(result.paymentDate).to.be.undefined
      expect(result.repaymentPlan).to.be.undefined
    })

    it('should convert payment in full by specified date', () => {
      const paymentIntention = PaymentIntention.deserialise(intentionOfPaymentInFullBySetDate)

      const result = paymentIntention.toDomainInstance()
      expect(result.paymentOption).to.be.equal(PaymentType.BY_SET_DATE)
      expect(result.paymentDate.toISOString()).to.be.deep.equal(MomentFactory.parse('2018-12-31').toISOString())
      expect(result.repaymentPlan).to.be.undefined
    })

    it('should convert payment by installments', () => {
      const paymentIntention = PaymentIntention.deserialise(intentionOfPaymentByInstallments)

      const result = paymentIntention.toDomainInstance()
      expect(result.paymentOption).to.be.equal(PaymentType.INSTALMENTS)
      expect(result.paymentDate).to.be.undefined
      expect(result.repaymentPlan.instalmentAmount).to.be.equal(100)
    })
  })
})
