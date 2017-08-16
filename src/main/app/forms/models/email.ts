import { IsEmail } from 'forms/validation/validators/isEmail'

import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly ADDRESS_NOT_VALID: string = 'Enter valid email address'
}

export default class Email implements Serializable<Email> {

  @IsEmail({ message: ValidationErrors.ADDRESS_NOT_VALID })
  address?: string

  constructor (address?: string) {
    this.address = address
  }

  deserialize (input: any): Email {
    if (input) {
      this.address = input.address
    }
    return this
  }
}
