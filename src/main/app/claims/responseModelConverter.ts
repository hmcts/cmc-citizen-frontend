import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseData } from 'response/draft/responseData'
import { PartyType } from 'forms/models/partyType'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Party } from 'app/claims/models/details/yours/party'
import { Individual } from 'app/claims/models/details/yours/individual'
import { Company } from 'app/claims/models/details/yours/company'
import { Address } from 'app/claims/models/address'
import { Organisation } from 'app/claims/models/details/yours/organisation'
import { SoleTrader } from 'app/claims/models/details/yours/soleTrader'

export class ResponseModelConverter {

  static convert (responseDraft: ResponseDraft): ResponseData {

    const responseData = new ResponseData(responseDraft.response.type.value,
                                          responseDraft.defence.text,
                                          responseDraft.freeMediation == null ? undefined : responseDraft.freeMediation.option,
                                          responseDraft.moreTimeNeeded == null ? undefined : responseDraft.moreTimeNeeded.option,
                                          this.convertPartyDetails(responseDraft))
    return responseData
  }

  private static convertPartyDetails (responseDraft: ResponseDraft): Party {
    let partyDetails: Party = undefined
    switch (responseDraft.defendantDetails.partyDetails.type) {
      case PartyType.INDIVIDUAL.value:
        partyDetails = new Individual()
        if ((responseDraft.defendantDetails.partyDetails as IndividualDetails).dateOfBirth) {
          (partyDetails as Individual).dateOfBirth = (responseDraft.defendantDetails.partyDetails as IndividualDetails).dateOfBirth.date.asString()
        }
        break
      case PartyType.COMPANY.value:
        partyDetails = new Company()
        break
      case PartyType.ORGANISATION.value:
        partyDetails = new Organisation()
        break
      case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
        partyDetails = new SoleTrader()
        break
    }
    partyDetails['address'] = new Address().deserialize(responseDraft.defendantDetails.partyDetails.address)
    if (responseDraft.defendantDetails.partyDetails.hasCorrespondenceAddress) {
      partyDetails['correspondenceAddress'] = new Address().deserialize(responseDraft.defendantDetails.partyDetails.correspondenceAddress)
    }
    partyDetails['name'] = responseDraft.defendantDetails.partyDetails.name as any
    if (responseDraft.defendantDetails.email) {
      partyDetails.email = responseDraft.defendantDetails.email.address
    }
    if (responseDraft.defendantDetails.mobilePhone) {
      partyDetails.mobilePhone = responseDraft.defendantDetails.mobilePhone.number
    }
    return partyDetails
  }

}
