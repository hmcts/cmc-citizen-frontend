import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

import { ResponseCommon } from 'claims/models/response/responseCommon'
import { ResponseType } from 'claims/models/response/responseType'

import { PaymentOption } from 'claims/models/response/core/paymentOption'
import { RepaymentPlan } from 'claims/models/response/core/repaymentPlan'

import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'

export interface PaymentDetails {
  amount: number,
  date: Moment,
  paymentMethod: string
}

export interface PartAdmissionResponse extends ResponseCommon {
  responseType: ResponseType.PART_ADMISSION
  isAlreadyPaid: YesNoOption
  howMuchHaveYouPaid: PaymentDetails
  defence: string,
  timeline: DefendantTimeline
  evidence: DefendantEvidence
  paymentOption?: PaymentOption
  paymentDate?: Moment
  repaymentPlan?: RepaymentPlan
  statementOfMeans?: StatementOfMeans
}

export namespace PartAdmissionResponse {
  export function deserialize (input: any): PartAdmissionResponse {
    return {
      ...ResponseCommon.deserialize(input),
      responseType: ResponseType.PART_ADMISSION,
      isAlreadyPaid: input.isAlreadyPaid,
      howMuchHaveYouPaid: {
        amount: input.howMuchHaveYouPaid.amount,
        date: input.howMuchHaveYouPaid.date,
        paymentMethod: input.howMuchHaveYouPaid.paymentMethod
      } as PaymentDetails,
      defence: input.defence,
      timeline: {
        rows: input.timeline && input.timeline.rows || [],
        comment: input.timeline && input.timeline.comment || undefined
      } as DefendantTimeline,
      evidence: {
        rows: input.evidence && input.evidence.rows || [],
        comment: input.evidence && input.evidence.comment || undefined
      } as DefendantEvidence,
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
