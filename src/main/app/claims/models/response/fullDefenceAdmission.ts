import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

import { ResponseCommon } from 'claims/models/response/responseCommon'
import { ResponseType } from 'claims/models/response/responseType'

import { PaymentOption } from 'claims/models/response/core/paymentOption'
import { RepaymentPlan } from 'claims/models/response/core/repaymentPlan'

import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'

export interface FullAdmissionResponse extends ResponseCommon {
  responseType: ResponseType.FULL_ADMISSION
  paymentOption: PaymentOption
  paymentDate?: Moment
  repaymentPlan?: RepaymentPlan
  statementOfMeans?: StatementOfMeans
}

export namespace FullAdmissionResponse {
  export function deserialize (input: any): FullAdmissionResponse {
    return {
      ...ResponseCommon.deserialize(input),
      responseType: ResponseType.FULL_ADMISSION,
      paymentOption: input.paymentOption as PaymentOption,
      paymentDate: input.paymentDate && MomentFactory.parse(input.paymentDate),
      repaymentPlan: input.repaymentPlan && {
        instalmentAmount: input.repaymentPlan.instalmentAmount,
        firstPaymentDate: MomentFactory.parse(input.repaymentPlan.firstPaymentDate),
        paymentSchedule: input.repaymentPlan.paymentSchedule
      },
      statementOfMeans: input.statementOfMeans
    }
  }
}
