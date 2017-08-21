import { ResponseDraft } from 'response/draft/responseDraft'

export class ResponseModelConverter {

  static convert (responseDraft: ResponseDraft): any {
    responseDraft.defendantDetails.email = responseDraft.defendantDetails.email as any
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

    responseDraft.defendantDetails.partyDetails['name'] = responseDraft.defendantDetails.partyDetails.name as any

    if (!responseDraft.defendantDetails.email || !responseDraft.defendantDetails.email.address) {
      delete responseDraft.defendantDetails.email
    }
  }

}
