import * as express from 'express'

import { ResponseType } from 'response/form/models/responseType'
import { Paths } from 'response/paths'
import User from 'idam/user'

export default class OweNoneResponseRequiredGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const user: User = res.locals.user
    if (user.responseDraft.document.response.type === ResponseType.OWE_NONE) {
      next()
    } else {
      res.redirect(Paths.responseTypePage.evaluateUri({ externalId: user.claim.externalId }))
    }
  }

}
