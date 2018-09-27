import { IsDefined } from 'class-validator'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Enter a valid reason'
}

export class Redetermination {
  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  text?: string

  constructor (text?: string) {
    this.text = text
  }

  static fromObject (value?: any): Redetermination {
    if (value == null) {
      return value
    }

    return new Redetermination(value.text)
  }

  deserialize (input?: any): Redetermination {
    if (input) {
      this.text = input.text
    }

    return this
  }
}
