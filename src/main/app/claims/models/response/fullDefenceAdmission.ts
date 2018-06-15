import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { ResponseCommon, ResponseType } from 'claims/models/response/responseCommon'
import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'

export enum PaymentOption {
  IMMEDIATELY = 'IMMEDIATELY',
  FULL_BY_SPECIFIED_DATE = 'FULL_BY_SPECIFIED_DATE',
  INSTALMENTS = 'INSTALMENTS'
}

export enum PaymentSchedule {
  EACH_WEEK = 'EACH_WEEK',
  EVERY_TWO_WEEKS = 'EVERY_TWO_WEEKS',
  EVERY_MONTH = 'EVERY_MONTH'
}

export interface RepaymentPlan {
  instalmentAmount: number
  firstPaymentDate: Moment
  paymentSchedule: PaymentSchedule
}

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
