import { CompanyDetails } from 'forms/models/companyDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { IndividualDetails } from 'forms/models/individualDetails'
import { PartyType } from 'forms/models/partyType'
import { PartyDetails } from 'forms/models/partyDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import Payment from 'app/pay/payment'
import { CompletableTask } from 'app/models/task'

export default class Claimant implements CompletableTask {
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
          let individualDetails = this.partyDetails as IndividualDetails
          result = !!individualDetails && individualDetails.isCompleted(true)
          break
        case PartyType.COMPANY.value:
          let companyDetails = this.partyDetails as CompanyDetails
          result = !!companyDetails && companyDetails.isCompleted()
          break
        case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
          let soleTraderDetails = this.partyDetails as SoleTraderDetails
          result = !!soleTraderDetails && soleTraderDetails.isCompleted(true)
          break
        case PartyType.ORGANISATION.value:
          let organisationDetails = this.partyDetails as OrganisationDetails
          result = !!organisationDetails && organisationDetails.isCompleted()
          break
      }
    }
    return result && !!this.mobilePhone && this.mobilePhone.isCompleted()
  }
}
