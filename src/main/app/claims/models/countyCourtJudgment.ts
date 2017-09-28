import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { RepaymentPlan } from 'claims/models/replaymentPlan'
import { MomentFactory } from 'common/momentFactory'
import { CountyCourtJudgmentImmediatePayment } from 'claims/models/ccj/countyCourtJudgmentImmediatePayment'
import { CountyCourtJudgmentPaidByInstalments } from 'claims/models/ccj/countyCourtJudgmentPaidByInstalments'
import { CountyCourtJudgmentPaidFullBySetDate } from 'claims/models/ccj/countyCourtJudgmentPaidFullBySetDate'

export abstract class CountyCourtJudgment {

  constructor (public defendant?: TheirDetails,
               public paymentOption?: string,
               public paidAmount?: number) {

    this.defendant = defendant
    this.paymentOption = paymentOption
    this.paidAmount = paidAmount
  }

  public static of (input: any): CountyCourtJudgment {
    if (input && input.paymentOption) {

      switch (input.paymentOption) {
        case PaymentType.IMMEDIATELY.value:
          return new CountyCourtJudgmentImmediatePayment(
            new TheirDetails(),
            input.paidAmount
          )

        case PaymentType.INSTALMENTS.value:
          return new CountyCourtJudgmentPaidByInstalments(
            new TheirDetails(), input.paidAmount, new RepaymentPlan().deserialize(input.repaymentPlan)
          )

        case PaymentType.FULL_BY_SPECIFIED_DATE.value:
          return new CountyCourtJudgmentPaidFullBySetDate(
            new TheirDetails(), input.paidAmount, MomentFactory.parse(input.payBySetDate)
          )

        default:
          throw new Error(`Unknown payment option ${input.paymentOption}`)
      }
    }

    return undefined
  }
}

// export class CountyCourtJudgmentImmediatePayment extends CountyCourtJudgment
//   implements Serializable<CountyCourtJudgmentPaidFullBySetDate> {
//
//   constructor (public defendant?: TheirDetails,
//                public paidAmount?: number) {
//     super(defendant, PaymentType.IMMEDIATELY.value, paidAmount)
//   }
//
//   deserialize (input: any): CountyCourtJudgmentPaidFullBySetDate {
//     if (input) {
//       this.defendant = new TheirDetails().deserialize(input.defendant)
//       this.paymentOption = input.paymentOption
//       this.paidAmount = input.paidAmount
//     }
//
//     return this
//   }
// }
//
// export class CountyCourtJudgmentPaidByInstalments extends CountyCourtJudgment
//   implements Serializable<CountyCourtJudgmentPaidFullBySetDate> {
//
//   constructor (public defendant?: TheirDetails,
//                public paidAmount?: number,
//                public repaymentPlan?: RepaymentPlan) {
//     super(defendant, PaymentType.INSTALMENTS.value, paidAmount)
//     this.repaymentPlan = repaymentPlan
//   }
//
//   deserialize (input: any): CountyCourtJudgmentPaidFullBySetDate {
//     if (input) {
//       this.defendant = new TheirDetails().deserialize(input.defendant)
//       this.paidAmount = input.paidAmount
//       this.paymentOption = input.paymentOption
//       this.repaymentPlan = new RepaymentPlan().deserialize(input.repaymentPlan)
//     }
//
//     return this
//   }
// }
//
// export class CountyCourtJudgmentPaidFullBySetDate extends CountyCourtJudgment
//   implements Serializable<CountyCourtJudgmentPaidFullBySetDate> {
//
//   constructor (public defendant?: TheirDetails,
//                public paidAmount?: number,
//                public payBySetDate?: string | Moment) {
//     super(defendant, PaymentType.FULL_BY_SPECIFIED_DATE.value, paidAmount)
//     this.payBySetDate = payBySetDate
//   }
//
//   deserialize (input: any): CountyCourtJudgmentPaidFullBySetDate {
//     if (input) {
//       this.defendant = new TheirDetails().deserialize(input.defendant)
//       this.paidAmount = input.paidAmount
//       this.paymentOption = input.paymentOption
//       this.payBySetDate = MomentFactory.parse(input.payBySetDate)
//     }
//
//     return this
//   }
// }
