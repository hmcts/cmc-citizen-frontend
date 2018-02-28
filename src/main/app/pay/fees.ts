export class Fees {
  // tslint:disable-line variable-name allow snake_case
  constructor (public code: string, public version: number) {
    // this.calculated_amount = calculated_amount
    this.code = code
    this.version = version
  }
}
