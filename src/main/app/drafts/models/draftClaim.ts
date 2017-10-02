import { Serializable } from 'models/serializable'
import Claimant from 'drafts/models/claimant'
import ClaimAmountBreakdown from 'forms/models/claimAmountBreakdown'
import Interest from 'forms/models/interest'
import InterestDate from 'forms/models/interestDate'
import Reason from 'forms/models/reason'
import * as uuid from 'uuid'
import { Defendant } from 'app/drafts/models/defendant'
import { Draft } from 'app/models/draft'
import { QualifiedStatementOfTruth } from 'app/forms/models/qualifiedStatementOfTruth'

export default class DraftClaim implements Draft, Serializable<DraftClaim> {

  externalId = uuid()
  claimant: Claimant = new Claimant()
  defendant: Defendant = new Defendant()
  amount: ClaimAmountBreakdown = new ClaimAmountBreakdown()
  interest: Interest = new Interest()
  interestDate: InterestDate = new InterestDate()
  reason: Reason = new Reason()
  readResolveDispute: boolean = false
  readCompletingClaim: boolean = false
  qualifiedStatementOfTruth?: QualifiedStatementOfTruth

  deserialize (input: any): DraftClaim {
    if (input) {
      this.externalId = input.externalId
      this.claimant = new Claimant().deserialize(input.claimant)
      this.defendant = new Defendant().deserialize(input.defendant)
      this.interest = new Interest().deserialize(input.interest)
      this.interestDate = new InterestDate().deserialize(input.interestDate)
      this.amount = new ClaimAmountBreakdown().deserialize(input.amount)
      this.reason = new Reason().deserialize(input.reason)
      this.readResolveDispute = input.readResolveDispute
      this.readCompletingClaim = input.readCompletingClaim
      if (input.qualifiedStatementOfTruth) {
        this.qualifiedStatementOfTruth = new QualifiedStatementOfTruth().deserialize(input.qualifiedStatementOfTruth)
      }
    }
    return this
  }
}
