import { Fees } from 'app/pay/fees'

export class NewPaymentRequest {
  // tslint:disable-next-line variable-name allow snake_case
  constructor (public amount: number, public case_reference: string, public description: string, public service_name: string, public currency: string, public siteId: string, public fees: Fees[], public return_url: string) {
    this.amount = amount
    this.case_reference = case_reference
    this.description = description
    this.service_name = service_name
    this.currency = currency
    this.siteId = siteId
    this.return_url = return_url
    this.fees = fees
  }
}
