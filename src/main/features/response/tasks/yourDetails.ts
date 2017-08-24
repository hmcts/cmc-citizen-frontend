import { ResponseDraft } from 'response/draft/responseDraft'
import { PartyType } from 'forms/models/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { PartyDetails } from 'forms/models/partyDetails'

export class YourDetails {

  static isDateOfBirthCompleted (partyDetails: PartyDetails): boolean {
    if (partyDetails.type === PartyType.INDIVIDUAL.value) {
      return (partyDetails as IndividualDetails).dateOfBirth.isCompleted()
    } else if (partyDetails.type === PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value) {
      return (partyDetails as SoleTraderDetails).dateOfBirth.isCompleted()
    } else {
      return false
    }
  }
  static isCompleted (response: ResponseDraft): boolean {
    if (!response || !response.defendantDetails || !response.defendantDetails.partyDetails || !response.defendantDetails.partyDetails.name ) {
      return false
    }

    return response.defendantDetails.partyDetails.name
      && this.isDateOfBirthCompleted(response.defendantDetails.partyDetails)
      && response.defendantDetails.partyDetails.isCompleted()
      && response.defendantDetails.email.isCompleted()
  }
}
