import * as express from 'express'

import { Paths } from 'response/paths'

import MoreTimeRequestRequiredGuard from 'response/guards/moreTimeRequestRequiredGuard'
import User from 'idam/user'

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user

    res.render(Paths.moreTimeConfirmationPage.associatedView, {
      newDeadline: user.claim.responseDeadline,
      claimantFullName: user.claim.claimData.claimant.name
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
