import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { AllClaimantResponseTasksCompletedGuard } from 'claimant-response/guards/allClaimantResponseTasksCompletedGuard'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { AmountHelper } from 'claimant-response/helpers/amountHelper'
import { ClaimStoreClient } from 'claims/claimStoreClient'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const claim: Claim = res.locals.claim

      res.render(Paths.checkAndSendPage.associatedView, {
        draft: draft.document,
        claim: claim,
        totalAmount: AmountHelper.calculateTotalAmount(claim, res.locals.draft.document)
      })
    })
  )
  .post(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user
      await new ClaimStoreClient().saveClaimantResponse(claim,draft,user)
      await new DraftService().delete(draft.id, user.bearerToken)
      res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
    }))
