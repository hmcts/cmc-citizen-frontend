import * as express from 'express'

import { StatesPaidPaths } from 'claimant-response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'

function renderView (res: express.Response, page: number): void {
  const claim: Claim = res.locals.claim

  res.render(StatesPaidPaths.defendantsResponsePage.associatedView, {
    claim: claim,
    page: page
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    StatesPaidPaths.defendantsResponsePage.uri,
    (req: express.Request, res: express.Response) => {
      const page: number = 0
      renderView(res, page)
    }
  )
  .post(
    StatesPaidPaths.defendantsResponsePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      const user: User = res.locals.user
      draft.document.defendantResponseViewed = true
      await new DraftService().save(draft, user.bearerToken)

      const { externalId } = req.params
      res.redirect(StatesPaidPaths.taskListPage.evaluateUri({ externalId: externalId }))
    }))
