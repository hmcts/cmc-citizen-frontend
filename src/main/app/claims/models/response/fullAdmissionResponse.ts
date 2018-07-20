import { PaymentIntention } from 'claims/models/response/partialAdmissionResponse'
import { MomentFactory } from 'shared/momentFactory'

import { ResponseCommon } from 'claims/models/response/responseCommon'
import { ResponseType } from 'claims/models/response/responseType'

import { PaymentOption } from 'claims/models/response/core/paymentOption'

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
      paymentIntention: input.paymentIntention && {
        paymentOption: input.paymentIntention.paymentOption as PaymentOption,
        paymentDate: input.paymentIntention.paymentDate && MomentFactory.parse(input.paymentIntention.paymentDate),
        repaymentPlan: input.paymentIntention.repaymentPlan && {
          instalmentAmount: input.paymentIntention.repaymentPlan.instalmentAmount,
          firstPaymentDate: MomentFactory.parse(input.paymentIntention.repaymentPlan.firstPaymentDate),
          paymentSchedule: input.paymentIntention.repaymentPlan.paymentSchedule
        }
      },
      statementOfMeans: input.statementOfMeans
    }
  }
}
