export class ClaimValue {

  static readonly OVER_10000 = new ClaimValue('OVER_10000')
  static readonly UNDER_10000 = new ClaimValue('UNDER_10000')
  static readonly NOT_KNOWN = new ClaimValue('NOT_KNOWN')

  constructor (public readonly option: string) {
  }

  static fromObject (input?: any): ClaimValue {
    if (!input) {
      return input
    }
    return this.all().filter(claimValue => claimValue.option === input).pop()
  }

  static all (): ClaimValue[] {
    return [
      ClaimValue.OVER_10000,
      ClaimValue.UNDER_10000,
      ClaimValue.NOT_KNOWN
    ]
  }
}
