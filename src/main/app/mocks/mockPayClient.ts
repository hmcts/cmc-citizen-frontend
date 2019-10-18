import { User } from 'idam/user'
import * as config from 'config'
import { Fee } from 'payment-hub-client/fee'
import { Payment } from 'payment-hub-client/payment'
import { PaymentRetrieveResponse } from 'payment-hub-client/paymentRetrieveResponse'
import * as uuid from 'uuid'
import { MomentFactory } from 'shared/momentFactory'
import { PayClient } from 'payment-hub-client/payClient'

const serviceName = config.get<string>('pay.service-name')
const siteId = config.get<string>('pay.site-id')
const description = config.get<string>('pay.description')

const delay = ms => new Promise(_ => setTimeout(_, ms))

export class MockPayClient implements PayClient {
  constructor (private requestUrl: string) {}

  async create (user: User, externalId: string, fees: Fee[], returnURL: string): Promise<Payment> {
    /*
    Calculated from:
     dependencies
      | where name == "POST /card-payments"
      | summarize avg(duration)
     */
    const payCreateDelayInMs = 694
    await delay(payCreateDelayInMs)

    const reference = `RC-${this.referencePart()}-${this.referencePart()}-${this.referencePart()}-${this.referencePart()}`
    return Promise.resolve({
      reference: reference,
      date_created: MomentFactory.currentDateTime().toISOString(),
      status: 'Initiated',
      _links: {
        next_url: {
          href: `${this.requestUrl}/${externalId}/receiver`,
          method: 'GET'
        }
      }
    })
  }

  private referencePart (): number {
    return Math.floor(1000 + Math.random() * 9000)
  }

  async retrieve (user: User, paymentReference: string): Promise<PaymentRetrieveResponse | undefined> {
    /*
    Calculated from:
     dependencies
      | where name contains "GET /card-payments"
      | summarize avg(duration)
     */
    const payRetrieveDelayInMs = 681
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

  async update (user: User, paymentReference: string, caseReference: string, caseNumber: string): Promise<void> {
    const payUpdateDelayInMs = 681
    await delay(payUpdateDelayInMs)

    return Promise.resolve()
  }

}
