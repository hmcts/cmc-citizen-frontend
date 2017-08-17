import { ResponseDraft } from 'response/draft/responseDraft'

export class YourDetails {

  static isCompleted (response: ResponseDraft): boolean {
    if (!response || !response.defendantDetails || !response.defendantDetails.partyDetails.name || !response.defendantDetails.partyDetails) {
      return false
    }

    return response.defendantDetails.partyDetails.name
      // && response.defendantDetails.partyDetails.dateOfBirth.isCompleted()
      && response.defendantDetails.partyDetails.isCompleted()
      && response.defendantDetails.email.isCompleted()
  }

}
