import { ResponseCommon, ResponseType } from './responseCommon'
import { Evidence } from './evidence'
import { HowMuchOwed } from './howMuchOwed'
import { HowMuchPaid } from './howMuchPaid'
import { PayBySetDate } from './payBySetDate'
import { Timeline } from './timeline'
import { PaymentPlan } from './paymentPlan'

export enum PartAdmissionType {
  AMOUNT_TOO_HIGH = 'AMOUNT_TOO_HIGH',
  PAID_WHAT_BELIEVED_WAS_OWED = 'PAID_WHAT_BELIEVED_WAS_OWED'
}

export interface PartAdmissionResponse extends ResponseCommon {
  responseType: ResponseType.PART_ADMISSION
  partAdmissionType: PartAdmissionType
  howMuchOwed?: HowMuchOwed
  howMuchPaid?: HowMuchPaid
  payBySetDate?: PayBySetDate
  impactOfDispute: string
  timeline: Timeline
  evidence: Evidence
  paymentPlan?: PaymentPlan
}

export namespace PartAdmissionResponse {
  export function deserialize (input: any): PartAdmissionResponse {
    return {
      ...ResponseCommon.deserialize(input),
      responseType: ResponseType.PART_ADMISSION,
      partAdmissionType: input.partAdmissionType,
      ...deserializeHowMuchOwedOrPaid(),
      ...(input.payBySetDate ? { payBySetDate: input.payBySetDate } : {}),
      impactOfDispute: input.impactOfDispute,
      timeline: input.timeline,
      evidence: input.evidence,
      paymentPlan: PaymentPlan.deserialize(input.paymentPlan)
    }

    function deserializeHowMuchOwedOrPaid () {
      switch (input.partAdmissionType) {
        case PartAdmissionType.AMOUNT_TOO_HIGH:
          return { howMuchOwed: input.howMuchOwed }
        case PartAdmissionType.PAID_WHAT_BELIEVED_WAS_OWED:
          return { howMuchPaid: input.howMuchPaid }
      }
    }
  }
}
