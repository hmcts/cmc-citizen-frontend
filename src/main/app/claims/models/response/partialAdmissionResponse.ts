import { ResponseCommon } from 'claims/models/response/responseCommon'
import { ResponseType } from 'claims/models/response/responseType'

import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { StatementOfMeans } from 'claims/models/response/statement-of-means/statementOfMeans'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { PaymentDeclaration } from 'claims/models/paymentDeclaration'
import { DirectionsQuestionnaire } from 'claims/models/directions-questionnaire/directionsQuestionnaire'

export interface PartialAdmissionResponse extends ResponseCommon {
  responseType: ResponseType.PART_ADMISSION
  amount: number
  paymentDeclaration: PaymentDeclaration
  defence: string,
  timeline: DefendantTimeline
  evidence: DefendantEvidence
  freeMediation?: YesNoOption,
  paymentIntention?: PaymentIntention
  statementOfMeans?: StatementOfMeans,
  directionsQuestionnaire?: DirectionsQuestionnaire
}

export namespace PartialAdmissionResponse {
  export function deserialize (input: any): PartialAdmissionResponse {
    return {
      ...ResponseCommon.deserialize(input),
      responseType: ResponseType.PART_ADMISSION,
      amount: input.amount,
      paymentDeclaration: input.paymentDeclaration
      && {
        paidDate: input.paymentDeclaration.paidDate,
        explanation: input.paymentDeclaration.explanation
      } as PaymentDeclaration,
      defence: input.defence,
      timeline: {
        rows: input.timeline && input.timeline.rows || [],
        comment: input.timeline && input.timeline.comment || undefined
      } as DefendantTimeline,
      evidence: {
        rows: input.evidence && input.evidence.rows || [],
        comment: input.evidence && input.evidence.comment || undefined
      } as DefendantEvidence,
      paymentIntention: PaymentIntention.deserialize(input.paymentIntention),
      statementOfMeans: input.statementOfMeans,
      directionsQuestionnaire: input.directionsQuestionnaire &&
        DirectionsQuestionnaire.fromObject(input.directionsQuestionnaire)
    }
  }
}
