import * as express from 'express'
import { Paths } from 'offer/paths'
import User from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'

export default express.Router()
  .get(
    Paths.settleOutOfCourtPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user: User = res.locals.user
      res.render(Paths.settleOutOfCourtPage.associatedView, {
        claim: user.claim,
        paths: Paths
      })
    }))
