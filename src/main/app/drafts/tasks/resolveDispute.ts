import { DraftClaim } from 'drafts/models/draftClaim'

export class ResolveDispute {

  static isCompleted (claim: DraftClaim): boolean {
    return claim.readResolveDispute
  }
}
