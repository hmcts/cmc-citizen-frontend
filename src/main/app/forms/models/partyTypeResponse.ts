import { IsDefined, IsIn } from 'class-validator'
import { PartyType } from 'forms/models/partyType'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose your response'
}

export class PartyTypeResponse {
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(PartyType.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: PartyType

  constructor (type?: PartyType) {
    this.type = type
  }

  static fromObject (value?: any): PartyTypeResponse {
    if (!value) {
      return value
    }
    return new PartyTypeResponse(value.type ? PartyType.valueOf(value.type.value) : undefined)
  }
}
