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
