export class PaymentState {
  status: string
  finished: boolean

  deserialize (input?: any): PaymentState {
    if (input) {
      this.status = input.status
      this.finished = input.finished
    }
    return this
  }
}

export class Payment {
  id: string
  amount: number
  reference: string
  description: string
  date_created: number // tslint:disable-line variable-name allow snake_case
  state: PaymentState

  static fromObject (input?: any): Payment {
    return new Payment().deserialize(input)
  }

  deserialize (input?: any): Payment {
    if (input) {
      this.id = input.id
      this.amount = input.amount
      this.reference = input.reference
      this.description = input.description
      this.date_created = input.date_created
      this.state = new PaymentState().deserialize(input.state)
    }
    return this
  }
}
