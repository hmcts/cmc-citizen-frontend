import { ResponseDraft } from 'response/draft/responseDraft'
import { PartyType } from 'common/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { PartyDetails } from 'forms/models/partyDetails'
import { Validator } from '@hmcts/class-validator'
import { Defendant } from 'drafts/models/defendant'

const validator = new Validator()

export class YourDetails {

  static isCompleted (response: ResponseDraft): boolean {
    if (!response || !response.defendantDetails) {
      return false
    }

    return this.isDefinedAndValid(response.defendantDetails.partyDetails, ['response'])
      && this.isDateOfBirthCompleted(response.defendantDetails.partyDetails)
      && this.isPhoneCompleted(response.defendantDetails)
  }

  private static isDateOfBirthCompleted (partyDetails: PartyDetails): boolean {
    if (partyDetails.type === PartyType.INDIVIDUAL.value) {
      return this.isDefinedAndValid((partyDetails as IndividualDetails).dateOfBirth)
    } else {
      return true
    }
  }

  private static isPhoneCompleted (defendant: Defendant): boolean {
    return this.isDefinedAndValid(defendant.phone)
  }

  private static isDefinedAndValid (value: any, validationGroups: string[] = []): boolean {
    return !!value && validator.validateSync(value, { groups: validationGroups }).length === 0
  }
}
