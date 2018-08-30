import { Moment } from 'moment'

import { MomentFactory } from 'shared/momentFactory'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'

import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentIntention as DraftPaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

export class PaymentIntentionConverter {
  static convertFromDraft (paymentIntention: DraftPaymentIntention): PaymentIntention {
    function getPaymentDate (): Moment {
      switch (paymentIntention.paymentOption.option) {
        case PaymentType.IMMEDIATELY:
          return MomentFactory.currentDate().add(5, 'days')
        case PaymentType.BY_SET_DATE:
          return paymentIntention.paymentDate.date.toMoment()
        default:
          throw new Error(`Unsupported payment option: ${paymentIntention.paymentOption.option}`)
      }
    }

    return PaymentIntention.deserialize({
      paymentOption: paymentIntention.paymentOption.option.value,
      paymentDate: paymentIntention.paymentOption.option === PaymentType.IMMEDIATELY || paymentIntention.paymentOption.option === PaymentType.BY_SET_DATE ? getPaymentDate() : undefined,
      repaymentPlan: paymentIntention.paymentOption.option === PaymentType.INSTALMENTS ? {
        instalmentAmount: paymentIntention.paymentPlan.instalmentAmount,
        firstPaymentDate: paymentIntention.paymentPlan.firstPaymentDate.asString(),
        paymentSchedule: paymentIntention.paymentPlan.paymentSchedule.value
      } : undefined
    })
  }
}
