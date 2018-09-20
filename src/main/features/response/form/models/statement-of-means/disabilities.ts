import { IsDefined, IsIn } from 'class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option'
}

export class Disabilities {
  static readonly NO = new Disabilities('NO', 'No')
  static readonly SINGLE = new Disabilities('SINGLE', 'Single')
  static readonly COUPLE = new Disabilities('COUPLE', 'Couple')
  static readonly SEVERE_SINGLE = new Disabilities('SEVERE SINGLE', 'Severe Disability Single')
  static readonly SEVERE_COUPLE = new Disabilities('SEVERE COUPLE', 'Severe Disability Couple')
  static readonly DISABLED_DEPENDANT = new Disabilities('DISABLED DEPENDANT', 'Disabled Dependant')
  static readonly CARER = new Disabilities('CARER', 'Carer')

  value: string
  displayValue: string

  constructor (value?: string, displayValue?: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static valueOf (value: string): Disabilities {
    return Disabilities.all().filter(type => type.value === value).pop()
  }

  static fromObject (value?: any): Disabilities {
    if (!value) {
      return value
    }

    return this.valueOf(value.value)
  }

  public static all (): Disabilities[] {
    return [
      Disabilities.NO,
      Disabilities.SINGLE,
      Disabilities.COUPLE,
      Disabilities.SEVERE_SINGLE,
      Disabilities.SEVERE_COUPLE,
      Disabilities.DISABLED_DEPENDANT,
      Disabilities.CARER
    ]
  }
}

export class DisabilitiesStatus {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(Disabilities.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: Disabilities

  constructor (option?: Disabilities) {
    this.option = option
  }

  static fromObject (value?: any): DisabilitiesStatus {
    if (!value) {
      return value
    }
    if (value.option) {
      const option: Disabilities = Disabilities.valueOf(value.option)
      return new DisabilitiesStatus(option)
    } else {
      return new DisabilitiesStatus()
    }
  }

  deserialize (input?: any): DisabilitiesStatus {
    if (input && input.option) {
      this.option = Disabilities.valueOf(input.option.value)
    }
    return this
  }
}
