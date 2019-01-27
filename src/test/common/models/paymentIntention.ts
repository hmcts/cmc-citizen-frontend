import { PaymentIntention, PaymentIntentionBuilder } from 'shared/models/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { MomentFactory } from 'shared/momentFactory'
import { expect } from 'chai'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import { PaymentIntention as CorePaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

describe('PaymentIntention', () => {

  context('PaymentIntentionBuilder', () => {
    it('should return correct instance of PaymentIntention from PaymentIntentionBuilder - Pay Immediately', () => {
      const paymentIntentionBuilderWithImmediately: PaymentIntention = new PaymentIntentionBuilder(PaymentOption.IMMEDIATELY)
        .build()

      expect(paymentIntentionBuilderWithImmediately).to.be.instanceOf(PaymentIntention)
    })

    it('should return correct instance of PaymentIntention from PaymentIntentionBuilder - Pay By Set Date', () => {
      const paymentIntentionBuilderWithSetDate: PaymentIntention = new PaymentIntentionBuilder(PaymentOption.BY_SPECIFIED_DATE)
        .setPaymentDate(MomentFactory.currentDate())
        .build()

      expect(paymentIntentionBuilderWithSetDate).to.be.instanceOf(PaymentIntention)
    })

    it('should return correct instance of PaymentIntention from PaymentIntentionBuilder - Pay By Instalments', () => {
      const paymentIntentionBuilderWithRepaymentPlan: PaymentIntention = new PaymentIntentionBuilder(PaymentOption.INSTALMENTS)
        .setRepaymentPlan(new RepaymentPlan(
          100,MomentFactory.currentDate(), PaymentSchedule.EVERY_MONTH, MomentFactory.maxDate(), '10 years')
        )
        .build()

      expect(paymentIntentionBuilderWithRepaymentPlan).to.be.instanceOf(PaymentIntention)
    })
  })

  context('PaymentIntention', () => {
    it('should return Immediately paymentIntention ', () => {
      const paymentIntention: PaymentIntention = new PaymentIntentionBuilder(PaymentOption.IMMEDIATELY)
        .build()

      expect(paymentIntention.PaymentOption).equal(PaymentOption.IMMEDIATELY)
    })

    it('should return By Set Date paymentIntention ', () => {
      const paymentIntention: PaymentIntention = new PaymentIntentionBuilder(PaymentOption.BY_SPECIFIED_DATE)
          .setPaymentDate(MomentFactory.currentDate())
          .build()

      expect(paymentIntention.PaymentOption).equal(PaymentOption.BY_SPECIFIED_DATE)
      expect(paymentIntention.PaymentDate.toISOString()).equal(MomentFactory.currentDate().toISOString())
    })

    it('should return Instalments paymentIntention ', () => {
      const paymentIntention: PaymentIntention = new PaymentIntentionBuilder(PaymentOption.INSTALMENTS)
        .setRepaymentPlan(new RepaymentPlan(
          100,MomentFactory.currentDate(), PaymentSchedule.EVERY_MONTH, MomentFactory.maxDate(), '10 years'))
        .build()

      expect(paymentIntention.PaymentOption).equal(PaymentOption.INSTALMENTS)
      expect(paymentIntention.RepaymentPlan.instalmentAmount).equal(100)
    })
  })

  context('PaymentIntention --> convertFromCorePaymentIntention', () => {

    it('should return correct instance of PaymentIntention from convertFromCorePaymentIntention - Immediately', () => {
      let corePaymentIntention: CorePaymentIntention = new CorePaymentIntention()

      corePaymentIntention.paymentOption = PaymentOption.IMMEDIATELY
      const convertFromCorePaymentIntention: PaymentIntention = PaymentIntention.convertFromCorePaymentIntention(corePaymentIntention)

      expect(convertFromCorePaymentIntention).to.be.instanceOf(PaymentIntention)
    })

    it('should return correct instance of PaymentIntention from convertFromCorePaymentIntention - By Set Date', () => {
      let corePaymentIntention: CorePaymentIntention = new CorePaymentIntention()

      corePaymentIntention.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      corePaymentIntention.paymentDate = MomentFactory.currentDate()
      const convertFromCorePaymentIntention: PaymentIntention = PaymentIntention.convertFromCorePaymentIntention(corePaymentIntention)

      expect(convertFromCorePaymentIntention).to.be.instanceOf(PaymentIntention)
    })

    it('should return correct instance of PaymentIntention from convertFromCorePaymentIntention - Instalments', () => {
      let corePaymentIntention: CorePaymentIntention = new CorePaymentIntention()

      corePaymentIntention.paymentOption = PaymentOption.INSTALMENTS
      corePaymentIntention.repaymentPlan = {
        instalmentAmount: 100,
        firstPaymentDate: MomentFactory.currentDate(),
        paymentSchedule: PaymentSchedule.EVERY_MONTH,
        completionDate: MomentFactory.maxDate(),
        paymentLength: '10 Years'
      }
      const convertFromCorePaymentIntention: PaymentIntention = PaymentIntention.convertFromCorePaymentIntention(corePaymentIntention)

      expect(convertFromCorePaymentIntention).to.be.instanceOf(PaymentIntention)
    })
  })
})
