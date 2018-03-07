export class ClaimType {

  static readonly PERSONAL_CLAIM = new ClaimType('PERSONAL_CLAIM', 'Just myself or my organisation')
  static readonly MULTIPLE_CLAIM = new ClaimType('MULTIPLE_CLAIM', 'More than one person or organisation')
  static readonly REPRESENTATIVE_CLAIM = new ClaimType('REPRESENTATIVE_CLAIM', 'A client - I’m their solicitor')

  readonly option: string
  readonly displayValue: string

  constructor (option: string, displayValue: string) {
    this.option = option
    this.displayValue = displayValue
  }

  static fromObject (input?: any): ClaimType {
    if (!input) {
      return input
    }
    return ClaimType.all().filter(claimType => claimType.option === input).pop()
  }

  static all (): ClaimType[] {
    return [
      ClaimType.PERSONAL_CLAIM,
      ClaimType.MULTIPLE_CLAIM,
      ClaimType.REPRESENTATIVE_CLAIM
    ]
  }
}
