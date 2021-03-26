import { MaxLength } from '@hmcts/class-validator'

export class BreathingSpaceReferenceNumber {
  @MaxLength(16, { message: 'Reference number must not be more than 16 characters' })
  bsNumber?: string

  constructor (num?: string) {
    this.bsNumber = num
  }

  static fromObject (value?: any): BreathingSpaceReferenceNumber {
    if (!value) {
      return value
    }

    return new BreathingSpaceReferenceNumber(value.bsNumber)
  }

  deserialize (input?: any): BreathingSpaceReferenceNumber {
    if (input) {
      this.bsNumber = input.bsNumber
    }
    return this
  }

}
