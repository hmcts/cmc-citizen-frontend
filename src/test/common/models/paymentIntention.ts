import { PaymentIntention, PaymentIntentionBuilder } from 'shared/models/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { MomentFactory } from 'shared/momentFactory'

import { expect } from 'chai'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import { PaymentIntention as CorePaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

describe('PaymentIntentionBuilder', () => {

  it('should return correct instance of PaymentIntention from PaymentIntentionBuilder', () => {
    const paymentIntentionBuilderWithSetDate: PaymentIntention = new PaymentIntentionBuilder(PaymentOption.BY_SPECIFIED_DATE)
      .setPaymentDate(MomentFactory.currentDate())
      .build()

    const paymentIntentionBuilderWithRepaymentPlan: PaymentIntention = new PaymentIntentionBuilder(PaymentOption.INSTALMENTS)
      .setRepaymentPlan(new RepaymentPlan(
        100,MomentFactory.currentDate(), PaymentSchedule.EVERY_MONTH, MomentFactory.maxDate(), '10 years')
      )
      .build()

    expect(paymentIntentionBuilderWithSetDate).to.be.instanceOf(PaymentIntention)
    expect(paymentIntentionBuilderWithRepaymentPlan).to.be.instanceOf(PaymentIntention)
  })

  it('should return correct instance of PaymentIntention from convertFromCorePaymentIntention', () => {
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
