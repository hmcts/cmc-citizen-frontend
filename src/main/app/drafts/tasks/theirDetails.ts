import DraftClaim from 'app/drafts/models/draftClaim'

export class TheirDetails {

  static isCompleted (claim: DraftClaim): boolean {
    if (!claim || !claim.defendant || !claim.defendant.name || !claim.defendant.partyDetails) {
      return false
    }
    return claim.defendant.name.isCompleted() && claim.defendant.partyDetails.isCompleted()
  }

}
