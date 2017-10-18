import * as express from 'express'
import { Paths } from 'offer/paths'
import { Paths as ResponsePaths } from 'response/paths'
import User from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'

export default express.Router()
  .get(
    Paths.offerConfirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user: User = res.locals.user
      res.render(Paths.offerConfirmationPage.associatedView, {
        claim: user.claim,
        submittedOn: user.claim.respondedAt,
        defendantEmail: user.email,
        paths: Paths,
        responsePaths: ResponsePaths
      })
    }))
