import { IsDefined, ValidateIf, ValidateNested } from 'class-validator'
import {
  DefendantPaymentOption as PaymentOption,
  DefendantPaymentType as PaymentType
} from 'response/form/models/defendantPaymentOption'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { DefendantPaymentPlan as PaymentPlan } from 'response/form/models/defendantPaymentPlan'

export class PaymentIntention {
  @IsDefined()
  @ValidateNested()
  paymentOption?: PaymentOption

  @ValidateIf((o: PaymentIntention) => o.paymentOption.option === PaymentType.BY_SET_DATE)
  @IsDefined()
  @ValidateNested()
  paymentDate?: PaymentDate

  @ValidateIf((o: PaymentIntention) => o.paymentOption.option === PaymentType.INSTALMENTS)
  @IsDefined()
  @ValidateNested()
  paymentPlan?: PaymentPlan

  static deserialise (input: any): PaymentIntention {
    if (!input) {
      return input
    }

    const instance = new PaymentIntention()
    if (input.paymentOption) {
      instance.paymentOption = new PaymentOption().deserialize(input.paymentOption)

      switch (instance.paymentOption.option) {
        case PaymentType.BY_SET_DATE:
          if (input.paymentDate) {
            instance.paymentDate = new PaymentDate().deserialize(input.paymentDate)
          }
          break
        case PaymentType.INSTALMENTS:
          if (input.paymentPlan) {
            instance.paymentPlan = new PaymentPlan().deserialize(input.paymentPlan)
          }
          break
      }
    }
    return instance
  }
}
