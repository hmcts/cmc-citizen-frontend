import * as express from 'express'

import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { StatesPaidPaths } from 'claimant-response/paths'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { AllStatesPaidTasksCompleteGuard } from 'claimant-response/guards/allStatesPaidTasksCompleteGuard'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { ClaimStoreClient } from 'claims/claimStoreClient'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    StatesPaidPaths.checkAndSendPage.uri,
    AllStatesPaidTasksCompleteGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      const claim: Claim = res.locals.claim
      const response: PartialAdmissionResponse = claim.response as PartialAdmissionResponse

      res.render(StatesPaidPaths.checkAndSendPage.associatedView, {
        draft: draft.document,
        claimAmount: claim.totalAmountTillToday,
        paidAmount: response.amount
      })
    })
  )
  .post(
    StatesPaidPaths.checkAndSendPage.uri,
    AllStatesPaidTasksCompleteGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      const user: User = res.locals.user

      await new ClaimStoreClient().saveClaimantResponseForUser(claim.externalId, draft, claim, user)
      await new DraftService().delete(draft.id, user.bearerToken)

      res.redirect(StatesPaidPaths.confirmationPage.evaluateUri({
        externalId: claim.externalId
      }))
    }))
