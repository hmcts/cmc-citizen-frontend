import Email from 'app/forms/models/email'
import { CompletableTask } from 'app/models/task'
import { PartyType } from 'forms/models/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import Payment from 'app/pay/payment'
import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'

export class Defendant implements CompletableTask {
  partyDetails?: PartyDetails
  email?: Email
  payment: Payment = new Payment()
  mobilePhone?: MobilePhone

  static fromObject (input?: any): Defendant {
    if (input == null) {
      return input
    }
    let deserialized = new Defendant()
    if (input.email) {
      deserialized.email = new Email().deserialize(input.email)
    }
    if (input.mobilePhone) {
      deserialized.mobilePhone = MobilePhone.fromObject(input.mobilePhone)
    }

    if (input.partyDetails && input.partyDetails.type) {
      switch (input.partyDetails.type) {
        case PartyType.INDIVIDUAL.value:
          deserialized.partyDetails = IndividualDetails.fromObject(input.partyDetails)
          break
        case PartyType.COMPANY.value:
          deserialized.partyDetails = CompanyDetails.fromObject(input.partyDetails)
          break
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          deserialized.partyDetails = SoleTraderDetails.fromObject(input.partyDetails)
          break
        case PartyType.ORGANISATION.value:
          deserialized.partyDetails = OrganisationDetails.fromObject(input.partyDetails)
          break
      }
    }
    return deserialized
  }

  deserialize (input: any): Defendant {
    if (input) {
      this.payment = new Payment().deserialize(input.payment)
      if (input.email) {
        this.email = new Email().deserialize(input.email)
      }
      if (input.mobilePhone) {
        this.mobilePhone = MobilePhone.fromObject(input.mobilePhone)
      }
      if (input.partyDetails && input.partyDetails.type) {
        switch (input.partyDetails.type) {
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
    let emailCompleted = !!this.email && this.email.isCompleted()
    if (this.partyDetails && this.partyDetails.type) {
      switch (this.partyDetails.type) {
        case PartyType.INDIVIDUAL.value:
          let individualDetails = this.partyDetails as IndividualDetails
          return individualDetails.isCompleted(false) && emailCompleted
        case PartyType.COMPANY.value:
          let companyDetails = this.partyDetails as CompanyDetails
          return !!companyDetails && companyDetails.isCompleted() && emailCompleted
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          let soleTraderDetails = this.partyDetails as SoleTraderDetails
          return !!soleTraderDetails && soleTraderDetails.isCompleted(false) && emailCompleted
        case PartyType.ORGANISATION.value:
          let organisationDetails = this.partyDetails as OrganisationDetails
          return !!organisationDetails && organisationDetails.isCompleted() && emailCompleted
      }
    }
    return false
  }
}
