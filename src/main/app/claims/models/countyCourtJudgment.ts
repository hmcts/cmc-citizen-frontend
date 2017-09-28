import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { RepaymentPlan } from 'claims/models/replaymentPlan'
import { MomentFactory } from 'common/momentFactory'
import { Serializable } from 'models/serializable'
import { Moment } from 'moment'

export class CountyCourtJudgment implements Serializable<CountyCourtJudgment> {

  constructor (public defendant?: TheirDetails,
               public paymentOption?: string,
               public paidAmount?: number,
               public repaymentPlan?: RepaymentPlan,
               public payBySetDate?: Moment) {

    this.defendant = defendant
    this.paymentOption = paymentOption
    this.paidAmount = paidAmount
    this.repaymentPlan = repaymentPlan
    this.payBySetDate = payBySetDate
  }

  public deserialize (input: any): CountyCourtJudgment {
    if (input) {

      this.paymentOption = input.paymentOption
      this.defendant = new TheirDetails().deserialize(input.defendant)
      this.paidAmount = input.paidAmount ? parseFloat(input.paidAmount) : undefined
      this.repaymentPlan = input.repaymentPlan ? new RepaymentPlan().deserialize(input.repaymentPlan) : undefined
      this.payBySetDate = input.payBySetDate ? MomentFactory.parse(input.payBySetDate) : undefined
    }
    return this
  }
}
