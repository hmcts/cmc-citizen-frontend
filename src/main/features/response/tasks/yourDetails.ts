import { ResponseDraft } from 'response/draft/responseDraft'
import { Defendant } from 'app/drafts/models/defendant'

export class YourDetails {

  static isCompleted (response: ResponseDraft): boolean {
    if (
      !response ||
      !response.defendantDetails ||
      !response.defendantDetails.name ||
      !response.defendantDetails.dateOfBirth ||
      !response.defendantDetails.partyDetails ||
      !response.defendantDetails.mobilePhone
    ) {
      return false
    }

    const defendantDetails: Defendant = response.defendantDetails
    return defendantDetails.name.isCompleted() &&
      defendantDetails.dateOfBirth.isCompleted() &&
      defendantDetails.partyDetails.isCompleted() &&
      defendantDetails.mobilePhone.isCompleted()
  }

}
