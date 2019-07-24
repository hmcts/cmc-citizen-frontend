import { ResponseCommon } from './responseCommon'

import { ResponseType } from 'claims/models/response/responseType'
import { DefenceType } from 'claims/models/response/defenceType'

import { PaymentDeclaration } from 'claims/models/paymentDeclaration'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { DirectionsQuestionnaire } from 'claims/models/directions-questionnaire/directionsQuestionnaire'

export interface FullDefenceResponse extends ResponseCommon {
  responseType: ResponseType.FULL_DEFENCE
  defenceType: DefenceType
  paymentDeclaration?: PaymentDeclaration
  defence: string,
  timeline: DefendantTimeline
  evidence: DefendantEvidence,
  directionsQuestionnaire?: DirectionsQuestionnaire
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
      } as DefendantEvidence,
      directionsQuestionnaire: input.directionsQuestionnaire &&
        DirectionsQuestionnaire.fromObject(input.directionsQuestionnaire)
    }
  }
}
