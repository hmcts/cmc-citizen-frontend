import * as express from 'express'
import { Paths } from 'response/paths'
import User from 'idam/user'

export default express.Router()
  .get(Paths.confirmationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
      const user: User = res.locals.user

      res.render(Paths.confirmationPage.associatedView, {
        claim: user.claim,
        submittedOn: user.claim.respondedAt,
        defendantEmail: user.email
      })
    } catch (err) {
      next(err)
    }
  })
