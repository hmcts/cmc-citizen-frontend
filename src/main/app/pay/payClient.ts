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
import * as uuid from 'uuid'

const baseURL = `${config.get('pay.url')}/card-payments`

const serviceName = config.get<string>('pay.service-name')
const currency = config.get<string>('pay.currency')
const siteId = config.get<string>('pay.site-id')
const description = config.get<string>('pay.description')

export interface PayClient {
  serviceAuthToken: ServiceAuthToken

  /**
   * Creates a payment within Reform Payment Hub
   *
   * @param user - user who make a call
   * @param caseReference - reference number of the case associated with the payment
   * @param externalId - externalId of claim
   * @param fees - fees array used to calculate total fee amount
   * @param returnURL - the url the user should be redirected to
   * @returns response with payment status and link to card payment page
   */
  create (user: User, caseReference: string, externalId: string, fees: Fee[], returnURL: string): Promise<Payment>

  /**
   * Retrieves a payment from Reform Payment Hub
   *
   * @param user - user who makes a call
   * @param paymentReference - payment reference number within Reform Payment Hub, generated when payment was created
   * @returns response all payment details including most recent payment status or undefined when reference does not exist
   */
  retrieve (user: User, paymentReference: string): Promise<PaymentRetrieveResponse | undefined>
}

const delay = ms => new Promise(_ => setTimeout(_, ms))

export class MockPayClient implements PayClient {
  constructor (public serviceAuthToken: ServiceAuthToken) {
    this.serviceAuthToken = serviceAuthToken
  }

  async create (user: User, caseReference: string, externalId: string, fees: Fee[], returnURL: string): Promise<Payment> {
    const payCreateDelayInMs = 300
    await delay(payCreateDelayInMs)

    return Promise.resolve({
      reference: 'RC-1530-1936-3463-2155',
      date_created: '2018-06-28T13:38:46.047+0000',
      status: 'Initiated',
      _links: {
        next_url: {
          href: `https://localhost:3010/claim/pay/${externalId}/receiver`,
          method: 'GET'
        }
      }
    })
  }

  async retrieve (user: User, paymentReference: string): Promise<PaymentRetrieveResponse | undefined> {
    const payRetrieveDelayInMs = 300
    await delay(payRetrieveDelayInMs)

    return Promise.resolve(
      {
        amount: 185,
        description: description,
        reference: paymentReference,
        currency: 'GBP',
        caseReference: uuid(),
        channel: 'online',
        method: 'card',
        externalProvider: 'gov pay',
        status: 'Success',
        externalReference: 'a-gov-pay-reference',
        siteId: siteId,
        serviceName: serviceName,
        fees: [
          { calculated_amount: 185, code: 'X0029', version: '1' }
        ]
      })
  }

}

export class GovPayClient implements PayClient {
  constructor (public serviceAuthToken: ServiceAuthToken) {
    this.serviceAuthToken = serviceAuthToken
  }

  async create (user: User, caseReference: string, externalId: string, fees: Fee[], returnURL: string): Promise<Payment> {
    checkDefined(user, 'User is required')
    checkNotEmpty(caseReference, 'Case reference is required')
    checkNotEmpty(externalId, 'ExternalId is required')
    checkNotEmpty(fees, 'Fees array is required')
    checkNotEmpty(returnURL, 'Post payment redirect URL is required')

    const payment: object = await request.post({
      uri: baseURL,
      body: this.preparePaymentRequest(caseReference, externalId, fees),
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`,
        'return-url': `${returnURL}`
      }
    })
    return Payment.deserialize(payment)
  }

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

  private preparePaymentRequest (caseReference: string, externalId: string, fees: Fee[]): object {
    return {
      case_reference: externalId,
      ccd_case_number: caseReference === externalId ? 'UNKNOWN' : caseReference,
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
