import * as config from 'config'

import { PaymentRequest } from 'app/pay/paymentRequest'
import { PaymentResponse } from 'app/pay/paymentResponse'
import { Payment } from 'app/pay/payment'
import { request } from 'client/request'
import { User } from 'app/idam/user'
import { ServiceAuthToken } from 'app/idam/serviceAuthToken'

import * as uuid from 'uuid/v4'
import { Fees } from 'app/pay/fees'
import { NewPaymentRequest } from 'app/pay/newPaymentRequest'
import { NewPaymentResponse } from 'app/pay/newPaymentResponse'

const payUrl = config.get<string>('pay.url')
const payPath = config.get<string>('pay.path')

export class PayClient {
  constructor (public serviceAuthToken: ServiceAuthToken) {
    this.serviceAuthToken = serviceAuthToken
  }

  /**
   * Creates a payment request for CC-Pay
   *
   * @param user a user
   * @param feeCode the fee code
   * @param amount the amount in pounds
   * @param returnURL the url the user should be redirected to
   * @returns {Promise.URL}
   */
  create (user: User, feeCode: string, amount: number, returnURL: string): Promise<PaymentResponse> {
    const paymentReference = `CMC1$$$${uuid()}$$$AA00$$$${feeCode}`
    return request.post({
      uri: `${payUrl}/users/${user.id}/payments`,
      body: new PaymentRequest(amount, paymentReference, 'Money Claim issue fee', returnURL),
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    })
  }

  createNewPayment (user: User, fees: Fees[], amount: number, returnURL: string): Promise<NewPaymentResponse> {
    const caseReference: string = uuid()
    const serviceName = config.get<string>('pay.service-name')
    const currency = config.get<string>('pay.currency')
    const siteId = config.get<string>('pay.site-id')
    const description = config.get<string>('pay.description')
    let paymentReq: NewPaymentRequest = new NewPaymentRequest(amount, caseReference, description, serviceName, currency, siteId, fees, returnURL)

    return request.post({
      uri: `${payUrl}/${payPath}`,
      body: paymentReq,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    })
  }

  retrieve (user: User, paymentId: string): Promise<Payment> {
    if (!paymentId) {
      return Promise.reject(new Error('Payment id must be set'))
    }

    return request.get({
      uri: `${payUrl}/users/${user.id}/payments/${paymentId}`,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    })
  }

  retrieveNew (user: User, paymentId: string): Promise<Payment> {
    if (!paymentId) {
      return Promise.reject(new Error('Payment id must be set'))
    }

    return request.get({
      uri: `${payUrl}/${payPath}/${paymentId}`,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    })
  }
}
