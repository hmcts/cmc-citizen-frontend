import * as express from 'express'

import { Paths } from 'claimant-response/paths'

import { Claim } from 'claims/models/claim'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'

import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { ErrorHandling } from 'shared/errorHandling'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentOption } from 'claims/models/paymentOption'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.counterOfferAcceptedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.draft

      const response = claim.response as FullAdmissionResponse | PartialAdmissionResponse

      const claimantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDraft(draft.document)
      const defendantPaymentOption: PaymentOption = response.paymentIntention.paymentOption
      const defendantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim, draft.document)

      const differentPaymentFrequency: boolean = claimantPaymentPlan.frequency !== defendantPaymentPlan.frequency

      const isCourtOrderPaymentPlanConvertedByDefendantFrequency =
        (defendantPaymentOption !== 'BY_SPECIFIED_DATE') ? defendantPaymentPlan.frequency && differentPaymentFrequency : false

      res.render(Paths.counterOfferAcceptedPage.associatedView, {
        isCourtOrderPaymentPlanConvertedByDefendantFrequency: isCourtOrderPaymentPlanConvertedByDefendantFrequency,
        claimantPaymentPlan: claimantPaymentPlan,
        courtOrderPaymentPlan: draft.document.courtDetermination.courtDecision ?
          draft.document.courtDetermination.courtDecision.repaymentPlan : undefined
      })
    }))
  .post(
    Paths.counterOfferAcceptedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const { externalId } = req.params
      const draft: Draft<DraftClaimantResponse> = res.locals.draft
      const user: User = res.locals.user

      draft.document.settlementAgreement = undefined
      draft.document.formaliseRepaymentPlan = undefined
      draft.document.courtDetermination.rejectionReason = undefined

      await new DraftService().save(draft, user.bearerToken)

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    }))
