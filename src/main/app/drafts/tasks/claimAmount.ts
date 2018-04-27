import { DraftClaim } from 'drafts/models/draftClaim'
import { InterestDateType } from 'app-common/interestDateType'
import { InterestTypeOption } from 'claim/form/models/interestType'
import { YesNoOption } from 'models/yesNoOption'

export class ClaimAmount {

  static isCompleted (claim: DraftClaim): boolean {
    if (claim.interest.option === YesNoOption.NO) {
      return this.amountAndNoInterestCompleted(claim)
    } else {
      return this.amountAndInterestCompleted(claim)
    }
  }

  private static amountAndInterestCompleted (claim: DraftClaim): boolean {
    if (claim.interestType.option === InterestTypeOption.SAME_RATE) {
      if (claim.interestDate.type === InterestDateType.SUBMISSION) {
        return claim.amount.totalAmount() > 0 &&
          claim.amount.totalAmount() < 10000 &&
          claim.interestType.isCompleted() &&
          claim.interestRate.isCompleted()
      } else {
        return claim.amount.totalAmount() > 0 &&
          claim.amount.totalAmount() < 10000 &&
          claim.interestType.isCompleted() &&
          claim.interestRate.isCompleted() &&
          claim.interestStartDate.isCompleted() &&
          claim.interestEndDate.isCompleted()
      }
    } else {
      if (claim.interestContinueClaiming.option === YesNoOption.NO) {
        return claim.amount.totalAmount() > 0 &&
          claim.amount.totalAmount() < 10000 &&
          claim.interestTotal.isCompleted() &&
          claim.interestContinueClaiming.isCompleted()
      } else {
        return claim.amount.totalAmount() > 0 &&
          claim.amount.totalAmount() < 10000 &&
        claim.interestTotal.isCompleted() &&
        claim.interestContinueClaiming.isCompleted() &&
        claim.interestHowMuch.isCompleted()
      }
    }
  }

  private static amountAndNoInterestCompleted (claim: DraftClaim): boolean {
    return claim.amount.totalAmount() > 0 && claim.interest.option === YesNoOption.NO
  }

}
