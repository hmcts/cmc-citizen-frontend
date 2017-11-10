import * as express from 'express'
import { Paths } from 'response/paths'
import { User } from 'idam/user'

export class MoreTimeAlreadyRequestedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const user: User = res.locals.user
    if (user.responseDraft.document.isMoreTimeRequested()) {
      res.redirect(Paths.moreTimeConfirmationPage.evaluateUri({ externalId: user.claim.externalId }))
    } else {
      next()
    }
  }
}
