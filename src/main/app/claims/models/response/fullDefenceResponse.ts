import { ResponseCommon, ResponseType } from './responseCommon'
import { PaymentDeclaration } from 'claims/models/paymentDeclaration'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'

export enum DefenceType {
  DISPUTE = 'DISPUTE',
  ALREADY_PAID = 'ALREADY_PAID'
}

export interface FullDefenceResponse extends ResponseCommon {
  responseType: ResponseType.FULL_DEFENCE
  defenceType: DefenceType
  paymentDeclaration?: PaymentDeclaration
  defence: string,
  timeline: DefendantTimeline
  evidence: DefendantEvidence
}

export namespace FullDefenceResponse {
  export function deserialize (input: any): FullDefenceResponse {
    return {
      ...ResponseCommon.deserialize(input),
      responseType: ResponseType.FULL_DEFENCE,
      defenceType: input.defenceType as DefenceType,
      paymentDeclaration: input.paymentDeclaration ? new PaymentDeclaration().deserialize(input.paymentDeclaration) : undefined,
      defence: input.defence as string,
      timeline: {
        rows: input.timeline && input.timeline.rows || [],
        comment: input.timeline && input.timeline.comment || undefined
      } as DefendantTimeline,
      evidence: {
        rows: input.evidence && input.evidence.rows || [],
        comment: input.evidence && input.evidence.comment || undefined
      } as DefendantEvidence
    }
  }
}
