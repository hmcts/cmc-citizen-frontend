import { PartyDetails } from './partyDetails'
import DateOfBirth from 'app/forms/models/dateOfBirth'
import { PartyType } from 'forms/models/partyType'

export class IndividualDetails extends PartyDetails {

  dateOfBirth?: DateOfBirth
  constructor () {
    super()
    this.type = PartyType.INDIVIDUAL.value
  }

  static fromObject (input?: any): IndividualDetails {
    if (input == null) {
      return input
    }
    const deserialized = new IndividualDetails()
    Object.assign(deserialized, PartyDetails.fromObject(input))
    deserialized.type = PartyType.INDIVIDUAL.value
    if (input.dateOfBirth) {
      deserialized.dateOfBirth = DateOfBirth.fromObject(input.dateOfBirth)
    }
    return deserialized
  }

  deserialize (input?: any): IndividualDetails {
    if (input) {
      Object.assign(this, new PartyDetails().deserialize(input))
      this.type = PartyType.INDIVIDUAL.value
      if (input.dateOfBirth) {
        this.dateOfBirth = DateOfBirth.fromObject(input.dateOfBirth)
      }
    }
    return this
  }

  isCompleted (isClaimant?: boolean): boolean {
    const dobComplete: boolean = isClaimant ? !!this.dateOfBirth && this.dateOfBirth.isCompleted() : true
    return super.isCompleted() && dobComplete
  }
}
