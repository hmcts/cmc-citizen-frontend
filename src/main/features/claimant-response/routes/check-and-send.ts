import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { AllClaimantResponseTasksCompletedGuard } from 'claimant-response/guards/allClaimantResponseTasksCompletedGuard'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { OfferClient } from 'claims/offerClient'
import { Settlement } from 'claims/models/settlement'
import { prepareSettlement } from 'claimant-response/helpers/settlementHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const claim: Claim = res.locals.claim
      const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)

      res.render(Paths.checkAndSendPage.associatedView, {
        draft: draft.document,
        claim: claim,
        lastPaymentDate: paymentPlan ? paymentPlan.calculateLastPaymentDate() : undefined
      })
    })
  )
  .post(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user
      const settlement: Settlement = prepareSettlement(claim, draft.document)

      await OfferClient.signSettlementAgreement(claim.externalId, user, settlement)
      await new DraftService().delete(draft.id, user.bearerToken)

      res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
    }))
