class PaymentState {
  status: string
  finished: boolean
}

class PaymentLinks {
  next_url: LinkedUrl // tslint:disable-line variable-name allow snake_case
  cancel: LinkedUrl
}

class LinkedUrl {
  href: string
  method: string
}

export default class PaymentResponse {
  id: string
  amount: number
  state: PaymentState
  description: string
  reference: string
  date_created: number // tslint:disable-line variable-name allow snake_case
  _links: PaymentLinks
}
