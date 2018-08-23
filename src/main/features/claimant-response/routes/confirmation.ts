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
import { isResponseAlreadyPaid } from 'claimant-response/helpers/statesPaidHelper'
import { ResponseRejection } from 'claims/models/claimant-response/responseRejection'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'

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

      if (isResponseAlreadyPaid(claim)) {
        let accepted: boolean = true
        let mediationRequested: boolean = false

        if (claim.claimantResponse.type === ClaimantResponseType.REJECTION) {
          accepted = false
          mediationRequested = (claim.claimantResponse as ResponseRejection).freeMediation
        } else {
          accepted = true
        }

        res.render(
          Paths.confirmationPage.associatedView,
          {
            claim: claim,
            confirmationDate: MomentFactory.currentDate(),
            accepted: accepted,
            mediationRequested: mediationRequested,
          })
      } else {
        res.render(
          Paths.confirmationPage.associatedView,
          {
            claim: claim,
            confirmationDate: MomentFactory.currentDate(),
            repaymentPlanOrigin: claim.settlement && getRepaymentPlanOrigin(claim.settlement),
            paymentIntentionAccepted: hasAcceptedDefendantsPaymentIntention(claim)
          })
      }

    }))
