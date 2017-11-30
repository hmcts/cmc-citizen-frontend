import { RepaymentPlan } from 'claims/models/replaymentPlan'
import { MomentFactory } from 'common/momentFactory'
import { Moment } from 'moment'
import { StatementOfTruth } from 'claims/models/statementOfTruth'

export class CountyCourtJudgment {

  constructor (public defendantDateOfBirth?: Moment,
               public paymentOption?: string,
               public paidAmount?: number,
               public repaymentPlan?: RepaymentPlan,
               public payBySetDate?: Moment,
               public statementOfTruth?: StatementOfTruth) {
    this.defendantDateOfBirth = defendantDateOfBirth
    this.paymentOption = paymentOption
    this.paidAmount = paidAmount
    this.repaymentPlan = repaymentPlan
    this.payBySetDate = payBySetDate
  }

  public deserialize (input: any): CountyCourtJudgment {
    if (input) {
      if (input.defendantDateOfBirth) {
        this.defendantDateOfBirth = MomentFactory.parse(input.defendantDateOfBirth)
      }
      this.paymentOption = input.paymentOption
      this.paidAmount = input.paidAmount ? parseFloat(input.paidAmount) : undefined
      this.repaymentPlan = input.repaymentPlan ? new RepaymentPlan().deserialize(input.repaymentPlan) : undefined
      this.payBySetDate = input.payBySetDate ? MomentFactory.parse(input.payBySetDate) : undefined
      this.statementOfTruth = new StatementOfTruth().deserialize(input.statementOfTruth)
    }
    return this
  }
}
