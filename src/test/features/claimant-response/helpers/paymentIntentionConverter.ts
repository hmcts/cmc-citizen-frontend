/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { PaymentIntentionConverter } from 'claimant-response/helpers/paymentIntentionConverter'

import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'

import { immediatePayment, paymentBySetDate, paymentByInstallments } from 'test/data/draft/fragments/paymentIntention'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

describe('PaymentIntentionConverter', () => {
  it('should convert immediate payment (with payment date 5 days in the future)', () => {
    const draftPaymentIntention = DraftPaymentIntention.deserialise(immediatePayment)

    const paymentIntention = PaymentIntentionConverter.convertFromDraft(draftPaymentIntention)

    expect(paymentIntention.paymentOption).to.be.equal(PaymentOption.IMMEDIATELY)
    expect(paymentIntention.paymentDate.toISOString()).to.be.equal(MomentFactory.currentDate().add(5, 'days').toISOString())
    expect(paymentIntention.repaymentPlan).to.be.undefined
  })

  it('should convert payment by set date', () => {
    const draftPaymentIntention = DraftPaymentIntention.deserialise(paymentBySetDate)

    const paymentIntention = PaymentIntentionConverter.convertFromDraft(draftPaymentIntention)

    expect(paymentIntention.paymentOption).to.be.equal(PaymentOption.BY_SPECIFIED_DATE)
    expect(paymentIntention.paymentDate.toISOString()).to.be.equal(MomentFactory.parse('2025-12-31').toISOString())
    expect(paymentIntention.repaymentPlan).to.be.undefined
  })

  it('should convert payment by installments', () => {
    const draftPaymentIntention = DraftPaymentIntention.deserialise(paymentByInstallments)

    const paymentIntention = PaymentIntentionConverter.convertFromDraft(draftPaymentIntention)

    expect(paymentIntention.paymentOption).to.be.equal(PaymentOption.INSTALMENTS)
    expect(paymentIntention.paymentDate).to.be.undefined
    expect(paymentIntention.repaymentPlan.instalmentAmount).to.be.equal(100)
    expect(paymentIntention.repaymentPlan.firstPaymentDate.toISOString()).to.be.equal(MomentFactory.parse('2025-12-31').toISOString())
    expect(paymentIntention.repaymentPlan.paymentSchedule).to.be.equal(PaymentSchedule.EVERY_MONTH)
  })
})
