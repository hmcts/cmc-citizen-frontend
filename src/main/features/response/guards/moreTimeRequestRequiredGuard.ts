import * as express from 'express'
import { Paths } from 'response/paths'

export default class MoreTimeRequestRequiredGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (res.locals.user.responseDraft.isMoreTimeRequested()) {
      next()
    } else {
      res.redirect(Paths.moreTimeRequestPage.uri)
    }
  }

}
