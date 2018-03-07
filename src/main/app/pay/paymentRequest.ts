import { Fees } from 'app/pay/fees'

export class PaymentRequest {
  // tslint:disable-next-line variable-name allow snake_case
  constructor (public amount: number, public case_reference: string, public description: string, public service_name: string, public currency: string, public site_id: string, public fees: Fees[]) {
    this.amount = amount
    this.case_reference = case_reference
    this.description = description
    this.service_name = service_name
    this.currency = currency
    this.site_id = site_id
    this.fees = fees
  }
}
