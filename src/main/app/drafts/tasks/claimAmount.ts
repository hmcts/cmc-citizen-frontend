import { DraftClaim } from 'app/drafts/models/draftClaim'
import { InterestOption } from 'claim/form/models/interest'
import { InterestDateType } from 'app/common/interestDateType'

export class ClaimAmount {

  static isCompleted (claim: DraftClaim): boolean {
    if (claim.interest.option === InterestOption.NO) {
      return this.amountAndNoInterestCompleted(claim)
    } else {
      return this.amountAndInterestCompleted(claim)
    }
  }

  private static amountAndInterestCompleted (claim: DraftClaim): boolean {
    if (claim.interestDate.type === InterestDateType.SUBMISSION) {
      return claim.amount.totalAmount() > 0 &&
        claim.interestType.isCompleted() &&
        claim.interestRate.isCompleted()
    } else {
      return claim.amount.totalAmount() > 0 &&
        claim.interestType.isCompleted() &&
        claim.interestRate.isCompleted() &&
        claim.interestStartDate.isCompleted() &&
        claim.interestEndDate.isCompleted()
    }
  }

  private static amountAndNoInterestCompleted (claim: DraftClaim): boolean {
    return claim.amount.totalAmount() > 0 && claim.interest.option === InterestOption.NO
  }

}
