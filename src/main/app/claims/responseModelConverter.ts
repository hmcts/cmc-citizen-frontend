import { ResponseDraft } from 'response/draft/responseDraft'

export class ResponseModelConverter {

  static convert (responseDraft: ResponseDraft): any {
    responseDraft.defendantDetails.mobilePhone = responseDraft.defendantDetails.mobilePhone.number as any
    responseDraft.defendantDetails.dateOfBirth = responseDraft.defendantDetails.dateOfBirth.date.asString() as any

    this.convertPartyDetails(responseDraft)

    const response = {
      response: responseDraft.response.type.value as string,
      defendantDetails: responseDraft.defendantDetails
    }

    if (responseDraft.requireDefence()) {
      response['defence'] = responseDraft.defence.text as string
      response['freeMediation'] = responseDraft.freeMediation.option as string
    }

    return response
  }

  private static convertPartyDetails (responseDraft: ResponseDraft): void {
    responseDraft.defendantDetails['address'] = responseDraft.defendantDetails.partyDetails.address
    if (responseDraft.defendantDetails.partyDetails.hasCorrespondenceAddress) {
      responseDraft.defendantDetails['correspondenceAddress'] = responseDraft.defendantDetails.partyDetails.correspondenceAddress
    }
    delete responseDraft.defendantDetails.partyDetails

    responseDraft.defendantDetails['name'] = responseDraft.defendantDetails.name.name as any

    if (!responseDraft.defendantDetails.email || !responseDraft.defendantDetails.email.address) {
      delete responseDraft.defendantDetails.email
    }
  }

}
