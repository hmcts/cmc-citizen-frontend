import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { PartyType } from 'app/common/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import { Payment } from 'app/pay/payment'
import { CompletableTask } from 'app/models/task'

export class Claimant implements CompletableTask {
  partyDetails?: PartyDetails
  mobilePhone?: MobilePhone
  payment: Payment = new Payment()

  deserialize (input?: any): Claimant {
    if (input) {
      this.payment = new Payment().deserialize(input.payment)
      if (input.mobilePhone) {
        this.mobilePhone = new MobilePhone().deserialize(input.mobilePhone)
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
    let result = false
    if (this.partyDetails && this.partyDetails.type) {
      switch (this.partyDetails.type) {
        case PartyType.INDIVIDUAL.value:
          const individualDetails = this.partyDetails as IndividualDetails
          result = individualDetails.isCompleted('claimant')
          break
        case PartyType.COMPANY.value:
          const companyDetails = this.partyDetails as CompanyDetails
          result = companyDetails.isCompleted('claimant')
          break
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          const soleTraderDetails = this.partyDetails as SoleTraderDetails
          result = soleTraderDetails.isCompleted('claimant')
          break
        case PartyType.ORGANISATION.value:
          const organisationDetails = this.partyDetails as OrganisationDetails
          result = organisationDetails.isCompleted('claimant')
          break
      }
    }
    return result && !!this.mobilePhone && this.mobilePhone.isCompleted()
  }
}
