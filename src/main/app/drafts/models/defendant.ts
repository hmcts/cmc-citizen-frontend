import Email from 'app/forms/models/email'
import { CompletableTask } from 'app/models/task'
import { PartyType } from 'forms/models/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'

export class Defendant implements CompletableTask {
  partyDetails?: PartyDetails
  email?: Email
  mobilePhone?: MobilePhone

  deserialize (input: any): Defendant {
    if (input) {
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
    const emailCompleted = this.email ? this.email.isCompleted() : true
    if (this.partyDetails && this.partyDetails.type) {
      switch (this.partyDetails.type) {
        case PartyType.INDIVIDUAL.value:
          const individualDetails = this.partyDetails as IndividualDetails
          return individualDetails.isCompleted(false) && emailCompleted
        case PartyType.COMPANY.value:
          const companyDetails = this.partyDetails as CompanyDetails
          return !!companyDetails && companyDetails.isCompleted() && emailCompleted
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          const soleTraderDetails = this.partyDetails as SoleTraderDetails
          return !!soleTraderDetails && soleTraderDetails.isCompleted(false) && emailCompleted
        case PartyType.ORGANISATION.value:
          const organisationDetails = this.partyDetails as OrganisationDetails
          return !!organisationDetails && organisationDetails.isCompleted() && emailCompleted
      }
    }
    return false
  }
}
