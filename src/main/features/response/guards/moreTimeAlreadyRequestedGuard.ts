import * as express from 'express'
import { Paths } from 'response/paths'

export default class MoreTimeAlreadyRequestedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (res.locals.user.responseDraft.isMoreTimeRequested()) {
      res.redirect(Paths.moreTimeConfirmationPage.uri)
    } else {
      next()
    }
  }

}
