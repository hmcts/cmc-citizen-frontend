import * as express from 'express'

import { Paths } from 'claimant-response/paths'

import { Claim } from 'claims/models/claim'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'

import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { CourtOrderHelper } from 'shared/helpers/courtOrderHelper'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.counterOfferAcceptedPage.uri, async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.draft
      const user: User = res.locals.user

      const claimantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDraft(draft.document)
      const defendantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)

      const courtOrderPaymentPlan: PaymentPlan = new PaymentPlan(
        defendantPaymentPlan.totalAmount,
        claimantPaymentPlan.instalmentAmount,
        claimantPaymentPlan.frequency,
        claimantPaymentPlan.startDate
      )

      draft.document.courtOrderAmount = CourtOrderHelper
        .createCourtOrder(claim, draft.document)
        .calculateAmount()

      await new DraftService().save(draft, user.bearerToken)

      res.render(Paths.counterOfferAcceptedPage.associatedView, {
        isCourtOrderPaymentPlanConvertedByDefendantFrequency: claimantPaymentPlan.frequency !== defendantPaymentPlan.frequency,
        claimantPaymentPlan,
        courtOrderPaymentPlan: courtOrderPaymentPlan.convertTo(defendantPaymentPlan.frequency) })
    })
  .post(
    Paths.counterOfferAcceptedPage.uri, async (req: express.Request, res: express.Response) => {
      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    })
