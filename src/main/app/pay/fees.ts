export class Fee {
  constructor (public calculated_amount: number, // tslint:disable-line variable-name allow snake_case
               public code: string,
               public version: number) {
  }
}
