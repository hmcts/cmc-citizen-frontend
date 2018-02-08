export class ValidDefendant {

  static readonly PERSONAL_CLAIM = new ValidDefendant('PERSONAL_CLAIM', 'Just myself or my organisation')
  static readonly MULTIPLE_CLAIM = new ValidDefendant('MULTIPLE_CLAIM', 'More than one person or organisation')
  static readonly REPRESENTATIVE_CLAIM = new ValidDefendant('REPRESENTATIVE_CLAIM', 'A client - I’m their legal representative')

  readonly option: string
  readonly displayValue: string

  constructor (option: string, displayValue: string) {
    this.option = option
    this.displayValue = displayValue
  }

  static fromObject (input?: any): ValidDefendant {
    if (!input) {
      return input
    }
    return this.all().filter(validDefendant => validDefendant.option === input).pop()
  }

  static all (): ValidDefendant[] {
    return [
      ValidDefendant.PERSONAL_CLAIM,
      ValidDefendant.MULTIPLE_CLAIM,
      ValidDefendant.REPRESENTATIVE_CLAIM
    ]
  }



}
