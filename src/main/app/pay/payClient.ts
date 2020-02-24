import { ServiceAuthToken } from 'idam/serviceAuthToken'
import { User } from 'idam/user'
import { plainToClass } from 'class-transformer'
import { request } from 'client/request'
import { checkDefined, checkNotEmpty } from 'shared/preconditions'
import * as config from 'config'
import * as HttpStatus from 'http-status-codes'
import { Fee } from 'payment-hub-client/fee'
import { Payment } from 'payment-hub-client/payment'
import { PaymentRetrieveResponse } from 'payment-hub-client/paymentRetrieveResponse'

const baseURL = `${config.get('pay.url')}/card-payments`
const paymentURL = `${config.get('pay.url')}/payments`

const serviceName = config.get<string>('pay.service-name')
const currency = config.get<string>('pay.currency')
const siteId = config.get<string>('pay.site-id')
const description = config.get<string>('pay.description')

export interface PayClient {
  /**
   * Creates a payment within Reform Payment Hub
   *
   * @param user - user who make a call
   * @param externalId - externalId of claim
   * @param fees - fees array used to calculate total fee amount
   * @param returnURL - the url the user should be redirected to
   * @returns response with payment status and link to card payment page
   */
  create (user: User, externalId: string, fees: Fee[], returnURL: string): Promise<Payment>

  /**
   * Retrieves a payment from Reform Payment Hub
   *
   * @param user - user who makes a call
   * @param paymentReference - payment reference number within Reform Payment Hub, generated when payment was created
   * @returns response all payment details including most recent payment status or undefined when reference does not exist
   */
  retrieve (user: User, paymentReference: string): Promise<PaymentRetrieveResponse | undefined>

  /**
   * Update case reference by payment reference
   *
   * @param user - user who makes a call
   * @param paymentReference - payment reference number within Reform Payment Hub, generated when payment was created
   * @param caseReference - case reference id, which is External id in the claim store.
   * @param caseNumber - case id that is been generated from CCD.
   * @returns response all payment details including most recent payment status or undefined when reference does not exist
   */
  update (user: User, paymentReference: string, caseReference: string, caseNumber: string): Promise<void | undefined>
}

export class GovPayClient implements PayClient {
  constructor (private serviceAuthToken: ServiceAuthToken) {
    this.serviceAuthToken = serviceAuthToken
  }

  async create (user: User, externalId: string, fees: Fee[], returnURL: string): Promise<Payment> {
    checkDefined(user, 'User is required')
    checkNotEmpty(externalId, 'ExternalId is required')
    checkNotEmpty(fees, 'Fees array is required')
    checkNotEmpty(returnURL, 'Post payment redirect URL is required')

    const options = {
      method: 'POST',
      uri: baseURL,
      body: this.preparePaymentRequest(externalId, fees),
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`,
        'return-url': `${returnURL}`
      }
    }

    return request(options).then(function (response) {
      return Payment.deserialize(response)
    })
  }

  async retrieve (user: User, paymentReference: string): Promise<PaymentRetrieveResponse | undefined> {
    checkDefined(user, 'User is required')
    checkNotEmpty(paymentReference, 'Payment reference is required')

    const options = {
      uri: `${baseURL}/${paymentReference}`,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return plainToClass(PaymentRetrieveResponse, response)
    }).catch(function (err) {
      if (err.statusCode === HttpStatus.NOT_FOUND) {
        return undefined
      }
      throw err
    })
  }

  async update (user: User, paymentReference: string, caseReference: string, caseNumber: string): Promise<void> {
    checkDefined(user, 'User is required')
    checkNotEmpty(paymentReference, 'Payment reference is required')
    checkNotEmpty(caseReference, 'Case Reference is required')
    checkNotEmpty(caseNumber, 'Case Number is required')
    return request.patch({
      uri: `${paymentURL}/${paymentReference}`,
      body: this.preparePaymentUpdateRequest(caseReference, caseNumber),
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    }).then(() => Promise.resolve())
      .catch(() => Promise.reject())
  }

  private preparePaymentUpdateRequest (caseReference: string, caseNumber: string): object {
    return {
      case_reference: caseReference,
      ccd_case_number: caseNumber
    }
  }

  private preparePaymentRequest (externalId: string, fees: Fee[]): object {
    return {
      case_reference: externalId,
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
