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
      return PartyTypeResponse.valueOf(value.type.value)
    }
  }

  static valueOf (value?: string): PartyTypeResponse {
    if (value) {
      const claimantType = PartyType.all()
        .filter(type => type.value === value)
        .pop()

      return new PartyTypeResponse(claimantType)
    } else {
      return new PartyTypeResponse()
    }
  }
}
