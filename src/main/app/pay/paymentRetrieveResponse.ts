import 'reflect-metadata'
import { Payment } from 'app/pay/payment'
import { Fee } from 'app/pay/fees'
import { Expose, Type } from 'class-transformer'

export class PaymentRetrieveResponse extends Payment {

  readonly description: string

  readonly currency: string

  @Expose({ name: 'ccd_case_number' })
  readonly ccdCaseNumber: string

  @Expose({ name: 'case_reference' })
  readonly caseReference: string

  readonly channel: string

  readonly method: string

  @Expose({ name: 'external_provider' })
  readonly externalProvider: string

  @Expose({ name: 'external_reference' })
  readonly externalReference: string

  @Expose({ name: 'site_id' })
  readonly siteId: string

  @Expose({ name: 'service_name' })
  readonly serviceName: string

  @Type(() => Fee)
  readonly fees: Fee
}
