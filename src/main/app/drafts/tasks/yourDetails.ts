import DraftClaim from 'app/drafts/models/draftClaim'

export class YourDetails {

  static isCompleted (claim: DraftClaim): boolean {
    if (!claim || !claim.claimant) {
      return false
    }
    const claimant = claim.claimant
    if (!claimant.name || !claimant.dateOfBirth || !claimant.partyDetails || !claimant.mobilePhone) {
      return false
    }

    return claimant.name.isCompleted() && claimant.dateOfBirth.isCompleted() &&
      claimant.partyDetails.isCompleted() && claimant.mobilePhone.isCompleted()
  }

}
