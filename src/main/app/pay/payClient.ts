import * as config from 'config'
import { PaymentResponse } from 'app/pay/paymentResponse'
import { Payment } from 'app/pay/payment'
import { request } from 'client/request'
import { User } from 'app/idam/user'
import { ServiceAuthToken } from 'app/idam/serviceAuthToken'
import * as uuid from 'uuid/v4'
import { Fees } from 'app/pay/fees'
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
   * @param User a user
   * @param {Fees[]} array of fees
   * @param amount fee amount
   * @param returnURL the url the user should be redirected to
   * @returns Promise.Payment
   */
  async create (user: User, fees: Fees[], amount: number, returnURL: string): Promise<Payment> {
    const paymentReq: object = this.preparePaymentRequest(amount, fees)
    console.log('bearer token:' + user.bearerToken, '\nauthtoken:' + this.serviceAuthToken.bearerToken, '\nreturnUrl:' + returnURL)
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
   * @param paymentId Id when payment initiated
   * @returns Promise<Payment>
   */
  async retrieve (user: User, paymentId: string): Promise<PaymentResponse> {
    if (!paymentId) {
      return Promise.reject(new Error('Payment id must be set'))
    }
    const paymentResponse: object = await request.get({
      uri: `${payUrl}/${payPath}/${paymentId}`,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    })
    console.log("responseXXX: " + JSON.stringify(paymentResponse))
    return plainToClass(PaymentResponse, paymentResponse)
  }

  private preparePaymentRequest (amount: number, fees: Fees[]): object {
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
