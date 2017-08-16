export class RangeFee {
  constructor (public type: string, public id: string, public description: string, public amount: number) {
    this.type = type
    this.id = id
    this.description = description
    this.amount = amount
  }
}
