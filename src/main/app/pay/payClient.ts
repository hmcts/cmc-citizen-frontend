import * as config from 'config'

import PaymentRequest from 'app/pay/paymentRequest'
import PaymentResponse from 'app/pay/paymentResponse'
import PaymentStatus from 'app/pay/payment'
import request from 'client/request'
import User from 'app/idam/user'
import ServiceAuthToken from 'app/idam/serviceAuthToken'

import * as uuid from 'uuid/v4'
import { RangeFee } from 'app/fees/rangeFee'

const payUrl = config.get('pay.url')

export default class PayClient {
  constructor (public serviceAuthToken: ServiceAuthToken) {
    this.serviceAuthToken = serviceAuthToken
  }

  /**
   * Creates a payment request for CC-Pay
   *
   * @param user a user
   * @param rangeFee the amount in pounds
   * @param returnURL the url the user should be redirected to
   * @returns {Promise.URL}
   */
  create (user: User, rangeFee: RangeFee, returnURL: string): Promise<PaymentResponse> {
    const paymentReference = `CMC1$$$${uuid()}$$$AA00$$$${rangeFee.id}`

    return request.post({
      uri: `${payUrl}/users/${user.id}/payments`,
      body: new PaymentRequest(rangeFee.amount, paymentReference, 'Money Claim issue fee', returnURL),
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    })
  }

  retrieve (user: User, paymentId: string): Promise<PaymentStatus> {
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
