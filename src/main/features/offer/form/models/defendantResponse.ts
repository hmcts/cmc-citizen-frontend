import { IsDefined } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no or make an offer'
}

export class DefendantResponse implements Serializable<DefendantResponse> {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  option?: boolean

  constructor (option?: boolean) {
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
