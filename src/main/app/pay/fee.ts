/* tslint:disable variable-name allow snake_case */

export class Fee {
  constructor (public calculated_amount: number, public code: string, public version: string | number) {}
}
