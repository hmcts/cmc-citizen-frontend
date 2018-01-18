import { ResponseDraft } from 'response/draft/responseDraft'
import { PartyType } from 'app/common/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { PartyDetails } from 'forms/models/partyDetails'

export class YourDetails {

  static isDateOfBirthCompleted (partyDetails: PartyDetails): boolean {
    if (partyDetails.type === PartyType.INDIVIDUAL.value) {
      const dateOfBirth = (partyDetails as IndividualDetails).dateOfBirth
      return dateOfBirth && dateOfBirth.isCompleted()
    } else {
      return true
    }
  }

  static isCompleted (response: ResponseDraft): boolean {
    if (!response || !response.defendantDetails || !response.defendantDetails.partyDetails) {
      return false
    }
    return this.isDateOfBirthCompleted(response.defendantDetails.partyDetails)
      && response.defendantDetails.partyDetails.isCompleted('response')
  }
}
