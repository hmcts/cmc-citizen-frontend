import * as express from 'express'
import { Paths } from 'offer/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { User } from 'idam/user'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.offerConfirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const user: User = res.locals.user
      res.render(Paths.offerConfirmationPage.associatedView, {
        claim: claim,
        submittedOn: claim.respondedAt,
        defendantEmail: user.email,
        responsePaths: ResponsePaths
      })
    }))
