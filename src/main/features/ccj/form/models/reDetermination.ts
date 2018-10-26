import { IsDefined } from 'class-validator'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Enter a valid reason'
}

export class ReDetermination {
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  text?: string

  constructor (text?: string) {
    this.text = text
  }

  static fromObject (value?: any): ReDetermination {
    if (value == null) {
      return value
    }

    return new ReDetermination(value.text)
  }

  deserialize (input?: any): ReDetermination {
    if (input) {
      this.text = input.text
    }

    return this
  }
}
