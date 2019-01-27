import { Moment } from 'moment'
import { RepaymentPlan } from 'claims/models/repaymentPlan'
import { PaymentIntention as CorePaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'

export class PaymentIntentionBuilder {
  private readonly paymentOption: PaymentOption
  private paymentDate?: Moment
  private repaymentPlan?: RepaymentPlan

  constructor (paymentOption: PaymentOption) {
    this.paymentOption = paymentOption
  }

  get PaymentOption () {
    return this.paymentOption
  }

  setPaymentDate (value: Moment): PaymentIntentionBuilder {
    this.paymentDate = value
    return this
  }

  get PaymentDate () {
    return this.paymentDate
  }

  setRepaymentPlan (value: RepaymentPlan): PaymentIntentionBuilder {
    this.repaymentPlan = value
    return this
  }

  get RepaymentPlan () {
    return this.repaymentPlan
  }

  build (): PaymentIntention {
    return new PaymentIntention(this)
  }
}

export class PaymentIntention {
  private readonly paymentOption: PaymentOption
  private readonly paymentDate?: Moment
  private readonly repaymentPlan?: RepaymentPlan

  constructor (builder: PaymentIntentionBuilder) {
    this.paymentOption = builder.PaymentOption
    this.paymentDate = builder.PaymentDate
    this.repaymentPlan = builder.RepaymentPlan
  }

  get PaymentOption () {
    return this.paymentOption
  }

  get PaymentDate () {
    return this.paymentDate
  }

  get RepaymentPlan () {
    return this.repaymentPlan
  }

  static convertFromCorePaymentIntention (paymentIntention: CorePaymentIntention): PaymentIntention {
    switch (paymentIntention.paymentOption) {
      case PaymentOption.IMMEDIATELY:
        return new PaymentIntentionBuilder(paymentIntention.paymentOption)
          .build()
      case PaymentOption.BY_SPECIFIED_DATE:
        return new PaymentIntentionBuilder(paymentIntention.paymentOption)
          .setPaymentDate(paymentIntention.paymentDate)
          .build()
      case PaymentOption.INSTALMENTS:
        return new PaymentIntentionBuilder(paymentIntention.paymentOption)
          .setRepaymentPlan(
            new RepaymentPlan(
              paymentIntention.repaymentPlan.instalmentAmount,
              paymentIntention.repaymentPlan.firstPaymentDate,
              paymentIntention.repaymentPlan.paymentSchedule,
              paymentIntention.repaymentPlan.completionDate,
              paymentIntention.repaymentPlan.paymentLength
            ))
          .build()
      default:
        return undefined
    }
  }
}
