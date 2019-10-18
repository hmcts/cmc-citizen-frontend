import { IsDefined, ValidateIf, ValidateNested } from '@hmcts/class-validator'
import {
  PaymentOption,
  PaymentType
} from 'main/common/components/payment-intention/model/paymentOption'
import { PaymentDate } from 'main/common/components/payment-intention/model/paymentDate'
import { PaymentPlan } from 'main/common/components/payment-intention/model/paymentPlan'

import * as domain from 'claims/models/response/core/paymentIntention'

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

  static deserialize (input: any): PaymentIntention {
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

  toDomainInstance (): domain.PaymentIntention {
    const instance = new domain.PaymentIntention()
    instance.paymentOption = this.paymentOption.option.value as any

    switch (this.paymentOption.option) {
      case PaymentType.BY_SET_DATE:
        instance.paymentDate = this.paymentDate.date.toMoment()
        break
      case PaymentType.INSTALMENTS:
        instance.repaymentPlan = {
          instalmentAmount: this.paymentPlan.instalmentAmount,
          paymentSchedule: this.paymentPlan.paymentSchedule.value as any,
          firstPaymentDate: this.paymentPlan.firstPaymentDate.toMoment(),
          completionDate: this.paymentPlan.completionDate.toMoment(),
          paymentLength: this.paymentPlan.paymentLength
        }
        break
    }

    return instance
  }
}
