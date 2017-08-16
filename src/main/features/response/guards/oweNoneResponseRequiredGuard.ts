import * as express from 'express'

import { ResponseType } from 'response/form/models/responseType'
import { Paths } from 'response/paths'

export default class OweNoneResponseRequiredGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (res.locals.user.responseDraft.response.type === ResponseType.OWE_NONE) {
      next()
    } else {
      res.redirect(Paths.responseTypePage.uri)
    }
  }

}
