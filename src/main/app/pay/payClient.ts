import { ServiceAuthToken } from 'app/idam/serviceAuthToken'
import { User } from 'app/idam/user'
import { plainToClass } from 'class-transformer'
import { request } from 'client/request'
import { checkDefined, checkNotEmpty } from 'common/preconditions'
import * as config from 'config'
import * as HttpStatus from 'http-status-codes'
import { Fee } from 'payment-hub-client/fee'
import { Payment } from 'payment-hub-client/payment'
import { PaymentRetrieveResponse } from 'payment-hub-client/paymentRetrieveResponse'

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
   * @param caseReference - reference number of the case associated with the payment
   * @param fees - fees array used to calculate total fee amount
   * @param returnURL - the url the user should be redirected to
   * @returns response with payment status and link to card payment page
   */
  async create (user: User, caseReference: string, fees: Fee[], returnURL: string): Promise<Payment> {
    checkDefined(user, 'User is required')
    checkNotEmpty(caseReference, 'Case reference is required')
    checkNotEmpty(fees, 'Fees array is required')
    checkNotEmpty(returnURL, 'Post payment redirect URL is required')

    const payment: object = await request.post({
      uri: baseURL,
      body: this.preparePaymentRequest(caseReference, fees),
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
   * @param paymentReference - payment reference number within Reform Payment Hub, generated when payment was created
   * @returns response all payment details including most recent payment status or undefined when reference does not exist
   */
  async retrieve (user: User, paymentReference: string): Promise<PaymentRetrieveResponse | undefined> {
    checkDefined(user, 'User is required')
    checkNotEmpty(paymentReference, 'Payment reference is required')

    try {
      const paymentResponse: object = await request.get({
        uri: `${baseURL}/${paymentReference}`,
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

  private preparePaymentRequest (caseReference: string, fees: Fee[]): object {
    return {
      case_reference: caseReference,
      ccd_case_number: 'UNKNOWN',
      description: description,
      service: serviceName,
      currency: currency,
      site_id: siteId,
      fees: fees,
      amount: fees.reduce((amount: number, fee: Fee) => {
        return amount + fee.calculated_amount
      }, 0)
    }
  }
}
