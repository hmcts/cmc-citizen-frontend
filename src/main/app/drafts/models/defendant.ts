import { Email } from 'forms/models/email'
import { CompletableTask } from 'models/task'
import { PartyType } from 'common/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { Phone } from 'forms/models/phone'

export class Defendant implements CompletableTask {
  partyDetails?: PartyDetails
  email?: Email
  phone?: Phone

  constructor (partyDetails?: PartyDetails, email?: Email, phone?: Phone) {
    this.partyDetails = partyDetails
    this.email = email
    this.phone = phone
  }

  deserialize (input: any): Defendant {
    if (input) {
      if (input.email) {
        this.email = new Email().deserialize(input.email)
      }
      if (input.phone) {
        this.phone = new Phone().deserialize(input.phone)
      } else if (input.mobilePhone) {
        this.phone = new Phone().deserialize(input.mobilePhone)
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
    const emailCompleted = !!this.email && this.email.isCompleted()
    if (this.partyDetails && this.partyDetails.type) {
      switch (this.partyDetails.type) {
        case PartyType.INDIVIDUAL.value:
          const individualDetails = this.partyDetails as IndividualDetails
          return individualDetails.isCompleted('defendant') && emailCompleted
        case PartyType.COMPANY.value:
          const companyDetails = this.partyDetails as CompanyDetails
          return companyDetails.isCompleted('defendant') && emailCompleted
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          const soleTraderDetails = this.partyDetails as SoleTraderDetails
          return soleTraderDetails.isCompleted('defendant') && emailCompleted
        case PartyType.ORGANISATION.value:
          const organisationDetails = this.partyDetails as OrganisationDetails
          return organisationDetails.isCompleted('defendant') && emailCompleted
      }
    }
    return false
  }
}
