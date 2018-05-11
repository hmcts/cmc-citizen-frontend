import { DraftClaim } from 'drafts/models/draftClaim'

export class YourDetails {

  static isCompleted (claim: DraftClaim): boolean {
    if (!claim || !claim.claimant) {
      return false
    }
    return claim.claimant.isCompleted()
  }

}
