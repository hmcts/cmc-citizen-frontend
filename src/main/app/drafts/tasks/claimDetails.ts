import { DraftClaim } from 'drafts/models/draftClaim'

export class ClaimDetails {

  static isCompleted (claim: DraftClaim): boolean {
    return claim.reason.isCompleted() && claim.timeline.isCompleted() && claim.evidence.isCompleted()
  }
}
