import * as config from 'config'
import { PaymentRetrieveResponse } from 'app/pay/paymentRetrieveResponse'
import { Payment } from 'app/pay/payment'
import { request } from 'client/request'
import { User } from 'app/idam/user'
import { ServiceAuthToken } from 'app/idam/serviceAuthToken'
import * as uuid from 'uuid/v4'
import { Fee } from 'app/pay/fees'
import { plainToClass } from 'class-transformer'

const payUrl = config.get<string>('pay.url')
const payPath = config.get<string>('pay.path')
const serviceName = config.get<string>('pay.service-name')
const currency = config.get<string>('pay.currency')
const siteId = config.get<string>('pay.site-id')
const description = config.get<string>('pay.description')

export class PayClient {
  constructor (public serviceAuthToken: ServiceAuthToken) {
    this.serviceAuthToken = serviceAuthToken
  }

  /**
   *
   * @param user a user
   * @param {Fee[]} array of fees
   * @param amount fee amount
   * @param returnURL the url the user should be redirected to
   * @returns Promise.Payment
   */
  async create (user: User, fees: Fee[], amount: number, returnURL: string): Promise<Payment> {
    const paymentReq: object = this.preparePaymentRequest(amount, fees)
    const payment: object = await request.post({
      uri: `${payUrl}/${payPath}`,
      body: paymentReq,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`,
        'return-url': `${returnURL}`
      }
    })
    return plainToClass(Payment, payment)
  }

  /**
   *
   * @param user a user
   * @param paymentRef Ref when payment initiated
   * @returns Promise<Payment>
   */
  async retrieve (user: User, paymentRef: string): Promise<PaymentRetrieveResponse> {
    if (!paymentRef) {
      return Promise.reject(new Error('Payment reference must be set'))
    }
    const paymentResponse: object = await request.get({
      uri: `${payUrl}/${payPath}/${paymentRef}`,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    })
    return plainToClass(PaymentRetrieveResponse, paymentResponse)
  }

  private preparePaymentRequest (amount: number, fees: Fee[]): object {
    const caseReference: string = uuid()
    return {
      amount: amount,
      case_reference: caseReference,
      description: description,
      service: serviceName,
      currency: currency,
      site_id: siteId,
      fee: fees,
      ccd_case_number: 'UNKNOWN'
    }
  }
}
