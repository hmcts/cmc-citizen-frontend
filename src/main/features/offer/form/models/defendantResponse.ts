import { IsDefined, IsIn } from '@hmcts/class-validator'
import { StatementType } from './statementType'
export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no or make an offer'
}

export class DefendantResponse {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(StatementType.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: StatementType

  constructor (option?: StatementType) {
    this.option = option
  }

  static fromObject (value?: any): DefendantResponse {
    if (!value) {
      return value
    }
    return new DefendantResponse(StatementType.valueOf(value.option))
  }

  deserialize (input: any): DefendantResponse {
    if (input) {
      this.option = StatementType.valueOf(input.option)
    }
    return this
  }
}
