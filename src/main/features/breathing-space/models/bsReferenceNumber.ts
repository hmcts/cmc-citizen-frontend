export class ValidationErrors {
  static readonly NUMBER_REQUIRED: string = 'Enter UK phone number'
}

export class BreathingSpaceReferenceNumber {
  bsNumber?: string

  constructor (num?: string) {
    this.bsNumber = num
  }

  static fromObject (input?: any): BreathingSpaceReferenceNumber {
    return new BreathingSpaceReferenceNumber(input.bsNumber)
  }

  deserialize (input?: any): BreathingSpaceReferenceNumber {
    if (input) {
      this.bsNumber = input.bsNumber
    }
    return this
  }

}
