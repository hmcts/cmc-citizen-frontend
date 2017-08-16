import DraftClaim from 'app/drafts/models/draftClaim'

export class ClaimAmount {

  static isCompleted (claim: DraftClaim): boolean {
    if (claim.interestDate.type) {
      return this.amountAndInterestCompleted(claim) && claim.interestDate.isCompleted()
    } else {
      return this.amountAndInterestCompleted(claim)
    }
  }

  private static amountAndInterestCompleted (claim: DraftClaim) {
    return claim.amount.totalAmount() > 0 &&
      claim.interest.isCompleted()
  }

}
