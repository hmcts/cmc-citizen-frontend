import { ResponseCommon } from 'claims/models/response/responseCommon'
import { ResponseType } from 'claims/models/response/responseType'

import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'

export interface FullAdmissionResponse extends ResponseCommon {
  responseType: ResponseType.FULL_ADMISSION
  paymentIntention?: PaymentIntention
  statementOfMeans?: StatementOfMeans
}

export namespace FullAdmissionResponse {
  export function deserialize (input: any): FullAdmissionResponse {
    return {
      ...ResponseCommon.deserialize(input),
      responseType: ResponseType.FULL_ADMISSION,
      paymentIntention: PaymentIntention.deserialize(input.paymentIntention),
      statementOfMeans: input.statementOfMeans
    }
  }
}
