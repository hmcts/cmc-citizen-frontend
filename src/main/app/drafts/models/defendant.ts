import Email from 'app/forms/models/email'
import { CompletableTask } from 'app/models/task'
import PartyTypeResponse from 'forms/models/partyTypeResponse'
import { PartyType } from 'forms/models/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import Payment from 'app/pay/payment'
import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { IndividualDetails } from 'forms/models/individualDetails'

export class Defendant implements CompletableTask {
  partyDetails?: PartyDetails
  partyTypeResponse: PartyTypeResponse
  email?: Email
  payment: Payment = new Payment()

  static fromObject (input?: any): Defendant {
    if (input == null) {
      return input
    }
    let deserialized = new Defendant()
    if (input.email) {
      deserialized.email = new Email().deserialize(input.email)
    }
    if (input.partyTypeResponse) {
      switch (input.partyTypeResponse.type) {
        case PartyType.INDIVIDUAL:
          deserialized.partyDetails = IndividualDetails.fromObject(input.partyDetails)
          break
        case PartyType.COMPANY:
          deserialized.partyDetails = CompanyDetails.fromObject(input.partyDetails)
          break
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED:
          deserialized.partyDetails = SoleTraderDetails.fromObject(input.partyDetails)
          break
        case PartyType.ORGANISATION:
          deserialized.partyDetails = OrganisationDetails.fromObject(input.partyDetails)
          break
      }
    }
    return deserialized
  }

  deserialize (input: any): Defendant {
    if (input) {
      this.partyTypeResponse = PartyTypeResponse.fromObject(input.partyTypeResponse)
      this.payment = new Payment().deserialize(input.payment)
      if (input.email) {
        this.email = new Email().deserialize(input.email)
      }
      if (input.partyTypeResponse) {
        switch (input.partyTypeResponse.type.value) {
          case PartyType.INDIVIDUAL.value:
            this.partyDetails = new IndividualDetails().deserialize(input.partyDetails)
            break
          case PartyType.COMPANY.value:
            this.partyDetails = new CompanyDetails().deserialize(input.partyDetails)
            break
          case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            this.partyDetails = new SoleTraderDetails().deserialize(input.partyDetails)
            break
          case PartyType.ORGANISATION.value:
            this.partyDetails = new OrganisationDetails().deserialize(input.partyDetails)
            break
        }
      }
    }
    return this
  }

  isCompleted (): boolean {
    let result = false
    if (this.partyTypeResponse) {
      switch (this.partyTypeResponse.type) {
        case PartyType.INDIVIDUAL:
          let individualDetails = this.partyDetails as IndividualDetails
          result = individualDetails.isCompleted(false)
          break
        case PartyType.COMPANY:
          let companyDetails = this.partyDetails as CompanyDetails
          result = !!companyDetails && companyDetails.isCompleted()
          break
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED:
          let soleTraderDetails = this.partyDetails as SoleTraderDetails
          result = !!soleTraderDetails && soleTraderDetails.isCompleted()
          break
        case PartyType.ORGANISATION:
          let organisationDetails = this.partyDetails as OrganisationDetails
          result = !!organisationDetails && organisationDetails.isCompleted()
          break
      }
    }
    return result && !!this.email && this.email.isCompleted()
  }
}
