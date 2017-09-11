import DraftClaim from 'app/drafts/models/draftClaim'

export class TheirDetails {

  static isCompleted (claim: DraftClaim): boolean {
    if (!claim || !claim.defendant) {
      return false
    }
    return claim.defendant.isCompleted()
  }

}
