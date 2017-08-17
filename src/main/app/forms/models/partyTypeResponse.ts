import { IsDefined, IsIn } from 'class-validator'
import { PartyType } from 'forms/models/partyType'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose your response'
}

export default class PartyTypeResponse {
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(PartyType.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: PartyType

  constructor (type?: PartyType) {
    this.type = type
  }

  static fromObject (value?: any): PartyTypeResponse {
    if (value && value.type) {
      const claimantType = PartyType.all()
        .filter(type => type.value === value.type.value)
        .pop()

      return new PartyTypeResponse(claimantType)
    } else {
      return new PartyTypeResponse()
    }
  }
}
