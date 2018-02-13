import { Payment } from 'app/pay/payment'

class PaymentLinks {
  next_url: LinkedUrl // tslint:disable-line variable-name allow snake_case
  cancel: LinkedUrl
}

class LinkedUrl {
  href: string
  method: string
}

export class PaymentResponse extends Payment {
  _links: PaymentLinks
}
