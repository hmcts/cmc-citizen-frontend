import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { ErrorHandling } from 'shared/errorHandling'
import { getRepaymentPlanOrigin } from 'claimant-response/helpers/settlementHelper'
import { MomentFactory } from 'shared/momentFactory'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'
import { ResponseType } from 'claims/models/response/responseType'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { CalendarClient } from 'claims/calendarClient'

function hasAcceptedDefendantsPaymentIntention (claim: Claim): boolean {
  const paymentIntentionFromResponse: PaymentIntention = (claim.response as FullAdmissionResponse | PartialAdmissionResponse).paymentIntention
  const paymentOptionFromCCJ = claim.countyCourtJudgment.paymentOption

  if (paymentIntentionFromResponse.paymentOption !== paymentOptionFromCCJ) {
    return false
  }

  switch (paymentOptionFromCCJ) {
    case PaymentOption.BY_SPECIFIED_DATE:
      return paymentIntentionFromResponse.paymentDate.toISOString() === claim.countyCourtJudgment.payBySetDate.toISOString()
    case PaymentOption.INSTALMENTS:
      return paymentIntentionFromResponse.repaymentPlan === claim.countyCourtJudgment.repaymentPlan
    default:
      throw new Error(`Unhandled payment option ${paymentOptionFromCCJ}`)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
      const alreadyPaid: boolean = StatesPaidHelper.isResponseAlreadyPaid(claim)
      const acceptedPaymentPlanClaimantDeadline = await new CalendarClient().getNextWorkingDayAfterDays(claim.claimantRespondedAt, 7)

      let directionsQuestionnaireEnabled = false
      if (claim.claimantResponse.type === ClaimantResponseType.REJECTION && claim.claimantResponse.directionsQuestionnaire) {
        directionsQuestionnaireEnabled = true
      }
      res.render(
        Paths.confirmationPage.associatedView,
        {
          confirmationDate: MomentFactory.currentDate(),
          repaymentPlanOrigin: (alreadyPaid || claim.response.responseType === ResponseType.FULL_DEFENCE) ? undefined : claim.settlement && getRepaymentPlanOrigin(claim.settlement),
          paymentIntentionAccepted: (alreadyPaid || claim.response.responseType === ResponseType.FULL_DEFENCE) ? undefined : response.paymentIntention && hasAcceptedDefendantsPaymentIntention(claim),
          directionsQuestionnaireEnabled: directionsQuestionnaireEnabled,
          acceptedPaymentPlanClaimantDeadline
        })
    }))
