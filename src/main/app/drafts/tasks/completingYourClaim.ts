import { DraftClaim } from 'drafts/models/draftClaim'

export class CompletingYourClaim {

  static isCompleted (claim: DraftClaim): boolean {
    return claim.readCompletingClaim
  }

}
