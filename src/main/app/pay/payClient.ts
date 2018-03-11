import { ServiceAuthToken } from 'app/idam/serviceAuthToken'
import { User } from 'app/idam/user'
import { plainToClass } from 'class-transformer'
import { request } from 'client/request'
import * as config from 'config'
import * as HttpStatus from 'http-status-codes'
import { Fee } from 'payment-hub-client/fee'
import { Payment } from 'payment-hub-client/payment'
import { PaymentRetrieveResponse } from 'payment-hub-client/paymentRetrieveResponse'
import * as uuid from 'uuid/v4'

const baseURL = `${config.get('pay.url')}/card-payments`

const serviceName = config.get<string>('pay.service-name')
const currency = config.get<string>('pay.currency')
const siteId = config.get<string>('pay.site-id')
const description = config.get<string>('pay.description')

export class PayClient {
  constructor (public serviceAuthToken: ServiceAuthToken) {
    this.serviceAuthToken = serviceAuthToken
  }

  /**
   * Creates a payment within Reform Payment Hub
   *
   * @param user - user who make a call
   * @param fees - fees array used to calculate total fee amount
   * @param returnURL - the url the user should be redirected to
   * @returns response with payment status and link to card payment page
   */
  async create (user: User, fees: Fee[], returnURL: string): Promise<Payment> {
    if (!user) {
      throw new Error('User is required')
    }
    if (!fees) {
      throw new Error('Fees array is required')
    }
    if (!returnURL) {
      throw new Error('Post payment redirect URL is required')
    }

    const payment: object = await request.post({
      uri: baseURL,
      body: this.preparePaymentRequest(fees),
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`,
        'return-url': `${returnURL}`
      }
    })
    return Payment.deserialize(payment)
  }

  /**
   * Retrieves a payment from Reform Payment Hub
   *
   * @param user - user who makes a call
   * @param paymentRef - payment reference number within Reform Payment Hub, generated when payment was created
   * @returns response all payment details including most recent payment status or undefined when reference does not exist
   */
  async retrieve (user: User, paymentRef: string): Promise<PaymentRetrieveResponse | undefined> {
    if (!user) {
      throw new Error('User is required')
    }
    if (!paymentRef) {
      throw new Error('Payment reference is required')
    }
    try {
      const paymentResponse: object = await request.get({
        uri: `${baseURL}/${paymentRef}`,
        headers: {
          Authorization: `Bearer ${user.bearerToken}`,
          ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
        }
      })
      return plainToClass(PaymentRetrieveResponse, paymentResponse)
    } catch (err) {
      if (err.statusCode === HttpStatus.NOT_FOUND) {
        return undefined
      }
      throw err
    }
  }

  private preparePaymentRequest (fees: Fee[]): object {
    return {
      case_reference: uuid(),
      ccd_case_number: 'UNKNOWN',
      description: description,
      service: serviceName,
      currency: currency,
      site_id: siteId,
      fee: fees,
      amount: fees.reduce((amount: number, fee: Fee) => {
        return amount + fee.calculated_amount
      }, 0)
    }
  }
}
