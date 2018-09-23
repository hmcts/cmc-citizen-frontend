import * as express from 'express'

import { Paths } from 'claimant-response/paths'

import { Claim } from 'claims/models/claim'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'

import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.counterOfferAcceptedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.draft

      const claimantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDraft(draft.document)
      const defendantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)

      res.render(Paths.counterOfferAcceptedPage.associatedView, {
        isCourtOrderPaymentPlanConvertedByDefendantFrequency: defendantPaymentPlan.frequency ? false : claimantPaymentPlan.frequency !== defendantPaymentPlan.frequency,
        claimantPaymentPlan: claimantPaymentPlan,
        defendantPaymentPlan: defendantPaymentPlan,
        courtOrderPaymentPlan: draft.document.courtOfferedPaymentIntention.repaymentPlan
      })
    }))
  .post(
    Paths.counterOfferAcceptedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const { externalId } = await req.params
      const draft: Draft<DraftClaimantResponse> = res.locals.draft
      const user: User = res.locals.user

      draft.document.settlementAgreement = undefined
      draft.document.formaliseRepaymentPlan = undefined
      draft.document.rejectionReason = undefined

      await new DraftService().save(draft, user.bearerToken)

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    }))
