export class Service {
  static readonly MCOL = new Service('mcol')
  static readonly MONEYCLAIMS = new Service('moneyclaims')

  constructor (readonly option?: string) {}

  static fromObject (input?: any): Service {
    if (!input) {
      return input
    }
    if (input === Service.MCOL.option) {
      return Service.MCOL
    } else if (input === Service.MONEYCLAIMS.option) {
      return Service.MONEYCLAIMS
    } else {
      throw new Error(`Invalid Services value: ${JSON.stringify(input)}`)
    }
  }

  static all (): Service[] {
    return [
      Service.MCOL,
      Service.MONEYCLAIMS
    ]
  }
}
