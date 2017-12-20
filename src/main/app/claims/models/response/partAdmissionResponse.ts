import { ResponseCommon, ResponseType } from './responseCommon'
import { Evidence } from './evidence'
import { HowMuchOwed } from './howMuchOwed'
import { Timeline } from './timeline'
import { PaymentPlan } from './paymentPlan'

export enum PartAdmissionType {
  AMOUNT_TOO_HIGH = 'AMOUNT_TOO_HIGH',
  PAID_WHAT_BELIEVED_WAS_OWED = 'PAID_WHAT_BELIEVED_WAS_OWED'
}

export interface PartAdmissionResponse extends ResponseCommon {
  responseType: ResponseType.PART_ADMISSION
  partAdmissionType: PartAdmissionType
  howMuchOwed: HowMuchOwed
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
      howMuchOwed: input.howMuchOwed,
      timeline: input.timeline,
      evidence: input.evidence,
      paymentPlan: PaymentPlan.deserialize(input.paymentPlan)
    }
  }
}
