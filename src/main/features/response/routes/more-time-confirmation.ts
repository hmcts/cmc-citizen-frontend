import * as express from 'express'

import { Paths } from 'response/paths'

import { MoreTimeRequestRequiredGuard } from 'response/guards/moreTimeRequestRequiredGuard'
import { Claim } from 'claims/models/claim'

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    const claim: Claim = res.locals.claim

    res.render(Paths.moreTimeConfirmationPage.associatedView, {
      newDeadline: claim.responseDeadline,
      claimantFullName: claim.claimData.claimant.name
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.moreTimeConfirmationPage.uri,
    MoreTimeRequestRequiredGuard.requestHandler,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      await renderView(res, next)
    })
  .post(
    Paths.moreTimeConfirmationPage.uri,
    MoreTimeRequestRequiredGuard.requestHandler,
    (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
    })
