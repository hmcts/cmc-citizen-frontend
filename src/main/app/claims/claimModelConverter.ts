import DraftClaim from 'drafts/models/draftClaim'
import { PartyDetails } from 'forms/models/partyDetails'

export class ClaimModelConverter {

  static convert (draftClaim: DraftClaim): any {
    // Remove optional field if empty
    if (draftClaim.interestDate.date.asString() === '') {
      delete draftClaim.interestDate.date
    } else {
      draftClaim.interestDate.date = draftClaim.interestDate.date.asString() as any
    }

    this.convertClaimantDetails(draftClaim)
    this.convertDefendantDetails(draftClaim)

    draftClaim.reason = draftClaim.reason.reason as any

    draftClaim['feeAmountInPennies'] = draftClaim.claimant.payment.amount

    draftClaim['payment'] = draftClaim.claimant.payment as any
    delete draftClaim.claimant.payment

    draftClaim.amount['type'] = 'breakdown'

    return draftClaim
  }

  private static convertClaimantDetails (draftClaim: DraftClaim): void {
    const claimantDetails: PartyDetails = draftClaim.claimant.partyDetails
    draftClaim.claimant['address'] = claimantDetails.address
    if (claimantDetails.hasCorrespondenceAddress) {
      draftClaim.claimant['correspondenceAddress'] = claimantDetails.correspondenceAddress
    }
    delete draftClaim.claimant.partyDetails

    draftClaim.claimant['name'] = draftClaim.claimant.name.name as any

    draftClaim.claimant['type'] = 'individual'

    draftClaim.claimant.mobilePhone = draftClaim.claimant.mobilePhone.number as any

    draftClaim.claimant.dateOfBirth = draftClaim.claimant.dateOfBirth.date.asString() as any
  }

  private static convertDefendantDetails (draftClaim: DraftClaim): void {
    const defendantDetails: PartyDetails = draftClaim.defendant.partyDetails
    draftClaim.defendant['address'] = defendantDetails.address
    delete draftClaim.defendant.partyDetails

    draftClaim.defendant['name'] = draftClaim.defendant.name.name as any

    if (!draftClaim.defendant.dateOfBirth || !draftClaim.defendant.dateOfBirth.date) {
      delete draftClaim.defendant.dateOfBirth
    }

    if (!draftClaim.defendant.mobilePhone || !draftClaim.defendant.mobilePhone.number) {
      delete draftClaim.defendant.mobilePhone
    }

    if (draftClaim.defendant.email) {
      draftClaim.defendant.email = (draftClaim.defendant.email.address || undefined) as any
    }

    draftClaim.defendant['type'] = 'individual'

    draftClaim['defendants'] = [draftClaim.defendant]
    delete draftClaim.defendant
  }

}
