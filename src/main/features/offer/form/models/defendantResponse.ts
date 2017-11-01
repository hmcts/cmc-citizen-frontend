import { IsDefined, IsIn } from 'class-validator'
import { Serializable } from 'models/serializable'
import { StatementType } from './statementType'
export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no or make an offer'
}

export class DefendantResponse implements Serializable<DefendantResponse> {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn([StatementType.ACCEPTATION.value, StatementType.REJECTION.value, StatementType.OFFER.value], { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }

  static fromObject (value?: any): DefendantResponse {
    if (!value) {
      return value
    }
    return new DefendantResponse(value.option)
  }

  deserialize (input: any): DefendantResponse {
    if (input) {
      this.option = input.option
    }
    return this
  }
}
