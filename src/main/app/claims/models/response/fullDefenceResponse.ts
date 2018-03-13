import { ResponseCommon, ResponseType } from './responseCommon'
import { PaymentDeclaration } from 'claims/models/paymentDeclaration'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'

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
}

export namespace FullDefenceResponse {
  export function deserialize (input: any): FullDefenceResponse {
    return {
      ...ResponseCommon.deserialize(input),
      defenceType: input.defenceType,
      paymentDeclaration: input.paymentDeclaration ? new PaymentDeclaration().deserialize(input.paymentDeclaration) : undefined,
      defence: input.defence,
      timeline: {
        rows: input.timeline && input.timeline.rows || [],
        comment: input.timeline && input.timeline.comment || undefined
      } as DefendantTimeline
    }
  }
}
