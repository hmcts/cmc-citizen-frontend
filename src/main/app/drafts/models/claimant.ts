import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import PartyTypeResponse from 'forms/models/partyTypeResponse'
import { PartyType } from 'forms/models/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import Payment from 'app/pay/payment'
import { CompletableTask } from 'app/models/task'

export default class Claimant implements CompletableTask {
  partyDetails?: PartyDetails
  partyTypeResponse: PartyTypeResponse
  mobilePhone?: MobilePhone
  payment: Payment = new Payment()

  static fromObject (input?: any): Claimant {
    if (input == null) {
      return input
    }
    let deserialized = new Claimant()
    deserialized.mobilePhone = MobilePhone.fromObject(input.mobilePhone)
    if (input.partyTypeResponse) {
      if (input.partyTypeResponse.type === PartyType.INDIVIDUAL) {
        deserialized.partyDetails = IndividualDetails.fromObject(input.partyDetails)
      } else if (input.partyTypeResponse.type === PartyType.COMPANY) {
        deserialized.partyDetails = CompanyDetails.fromObject(input.partyDetails)
      } else if (input.partyTypeResponse.type === PartyType.SOLE_TRADER_OR_SELF_EMPLOYED) {
        deserialized.partyDetails = SoleTraderDetails.fromObject(input.partyDetails)
      } else if (input.partyTypeResponse.type === PartyType.ORGANISATION) {
        deserialized.partyDetails = OrganisationDetails.fromObject(input.partyDetails)
      }
    }
    return deserialized
  }

  deserialize (input?: any): Claimant {
    if (input) {
      this.partyTypeResponse = PartyTypeResponse.fromObject(input.partyTypeResponse)
      this.payment = new Payment().deserialize(input.payment)
      if (input.mobilePhone) {
        this.mobilePhone = new MobilePhone().deserialize(input.mobilePhone)
      }
      if (this.partyTypeResponse) {
        if (this.partyTypeResponse.type === PartyType.INDIVIDUAL) {
          this.partyDetails = new IndividualDetails().deserialize(input.partyDetails)
        } else if (this.partyTypeResponse.type === PartyType.COMPANY) {
          this.partyDetails = new CompanyDetails().deserialize(input.partyDetails)
        } else if (this.partyTypeResponse.type === PartyType.SOLE_TRADER_OR_SELF_EMPLOYED) {
          this.partyDetails = new SoleTraderDetails().deserialize(input.partyDetails)
        } else if (this.partyTypeResponse.type === PartyType.ORGANISATION) {
          this.partyDetails = new OrganisationDetails().deserialize(input.partyDetails)
        }
      }
    }
    return this
  }

  isCompleted (): boolean {
    let result = false
    if (this.partyTypeResponse) {
      if (this.partyTypeResponse.type === PartyType.INDIVIDUAL) {
        let individualDetails = this.partyDetails as IndividualDetails
        result = !!individualDetails && individualDetails.isCompleted(true)
      } else if (this.partyTypeResponse.type === PartyType.COMPANY) {
        let companyDetails = this.partyDetails as CompanyDetails
        result = !!companyDetails && companyDetails.isCompleted()
      } else if (this.partyTypeResponse.type === PartyType.SOLE_TRADER_OR_SELF_EMPLOYED) {
        let soleTraderDetails = this.partyDetails as SoleTraderDetails
        result = !!soleTraderDetails && soleTraderDetails.isCompleted()
      } else if (this.partyTypeResponse.type === PartyType.ORGANISATION) {
        let organisationDetails = this.partyDetails as OrganisationDetails
        result = !!organisationDetails && organisationDetails.isCompleted()
      }
    }
    return result && !!this.mobilePhone && this.mobilePhone.isCompleted()
  }
}
