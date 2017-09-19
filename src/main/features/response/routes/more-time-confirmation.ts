import * as express from 'express'

import { Paths } from 'response/paths'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import MoreTimeRequestRequiredGuard from 'response/guards/moreTimeRequestRequiredGuard'
import User from 'idam/user'

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    const claim: Claim = await ClaimStoreClient.retrieveLatestClaimByDefendantId(res.locals.user.id)
    res.render(Paths.moreTimeConfirmationPage.associatedView, {
      newDeadline: claim.responseDeadline,
      claimantFullName: claim.claimData.claimant.name
    })
  } catch (err) {
    next(err)
  }
}

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
      const user: User = res.locals.user

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
    })
