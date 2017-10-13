import { IsBoolean } from 'class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Select an option'
}

export class CounterClaim {
  @IsBoolean({ message: ValidationErrors.OPTION_REQUIRED })
  counterClaim?: boolean

  constructor (counterClaim?: boolean) {
    this.counterClaim = counterClaim
  }

  static fromObject (value?: any): CounterClaim {
    if (!value) {
      return value
    }

    if (typeof value.counterClaim === 'string' && value.counterClaim !== 'true' && value.counterClaim !== 'false') {
      return new CounterClaim()
    }

    if (typeof value.counterClaim === 'string') {
      return new CounterClaim(value.counterClaim === 'true')
    }

    return new CounterClaim(value.counterClaim)
  }
}
