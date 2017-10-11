import * as express from 'express'
import { Paths } from 'response/paths'
import User from 'idam/user'

export default express.Router()
  .get(Paths.confirmationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
      const user: User = res.locals.user

      res.render(Paths.confirmationPage.associatedView, {
        claimantName: user.claim.claimData.claimant.name,
        submittedOn: user.claim.respondedAt,
        paths: Paths
      })
    } catch (err) {
      next(err)
    }
  })
