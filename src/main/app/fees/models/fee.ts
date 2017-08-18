export class Fee {
  readonly code: string
  readonly description: string
  readonly amount: number
  readonly type: string

  constructor (code: string, description: string, amount: number, type: string) {
    this.code = code
    this.description = description
    this.amount = amount
    this.type = type
  }
}
