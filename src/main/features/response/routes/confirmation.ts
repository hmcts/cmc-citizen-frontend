import * as express from 'express'
import { Paths } from 'response/paths'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const claim: Claim = res.locals.claim
      const user: User = res.locals.user

      res.render(Paths.confirmationPage.associatedView, {
        claim: claim,
        submittedOn: claim.respondedAt,
        defendantEmail: user.email,
        paths: Paths
      })
    } catch (err) {
      next(err)
    }
  })
