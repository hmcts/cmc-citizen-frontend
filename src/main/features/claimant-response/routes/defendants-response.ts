import { NotFoundError } from 'errors'
import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { GuardFactory } from 'response/guards/guardFactory'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { ResponseType } from 'claims/models/response/responseType'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const claim: Claim = res.locals.claim

  return claim.response.responseType === ResponseType.FULL_ADMISSION
    || (claim.response.responseType === ResponseType.PART_ADMISSION)
    || (claim.response.responseType === ResponseType.FULL_DEFENCE && claim.response.paymentDeclaration !== undefined)
}, (req: express.Request): void => {
  throw new NotFoundError(req.path)
})

function renderView (res: express.Response): void {
  const claim: Claim = res.locals.claim
  const alreadyPaid: boolean = StatesPaidHelper.isResponseAlreadyPaid(claim)

  res.render(Paths.defendantsResponsePage.associatedView, {
    claim: claim,
    alreadyPaid: alreadyPaid,
    partiallyPaid: alreadyPaid ? StatesPaidHelper.isAlreadyPaidLessThanAmount(claim) : undefined
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.defendantsResponsePage.uri,
    stateGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      renderView(res)
    }
  )
  .post(
    Paths.defendantsResponsePage.uri,
    stateGuardRequestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user
      const claim: Claim = res.locals.claim
      const alreadyPaid: boolean = StatesPaidHelper.isResponseAlreadyPaid(claim)

      if (req.body.action && !alreadyPaid) {
        return renderView(res)
      }

      draft.document.defendantResponseViewed = true
      await new DraftService().save(draft, user.bearerToken)

      const { externalId } = req.params
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    }))
