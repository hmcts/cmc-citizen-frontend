export class Fees {
  constructor (public calculated_amount: number, // tslint:disable-line variable-name allow snake_case
               public code: string,
               public version: number) {
    this.calculated_amount = calculated_amount // tslint:disable-line variable-name allow snake_case
    this.code = code
    this.version = version
  }
}
