import * as express from 'express'
import { Paths } from 'response/paths'
import User from 'idam/user'

export default class MoreTimeRequestRequiredGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const user: User = res.locals.user
    if (user.responseDraft.document.isMoreTimeRequested()) {
      next()
    } else {
      res.redirect(Paths.moreTimeRequestPage.evaluateUri({ externalId: user.claim.externalId }))
    }
  }

}
