import * as config from 'config'

import { PaymentRequest } from 'app/pay/paymentRequest'
import { PaymentResponse } from 'app/pay/paymentResponse'
import { Payment } from 'app/pay/payment'
import { retryingRequest as request } from 'client/request'
import { User } from 'app/idam/user'
import { ServiceAuthToken } from 'app/idam/serviceAuthToken'

import * as uuid from 'uuid/v4'

const payUrl = config.get('pay.url')

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
}
