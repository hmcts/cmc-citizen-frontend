import { DraftClaim } from 'app/drafts/models/draftClaim'

export class ClaimDetails {

  static isCompleted (claim: DraftClaim): boolean {
    return claim.reason.isCompleted() && claim.timeline.rows.length > 0
  }
}
