import * as express from 'express'
import { Paths } from 'response/paths'
import User from 'idam/user'

export default express.Router()
  .get(Paths.offerSentConfirmationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
      const user: User = res.locals.user

      res.render(Paths.offerSentConfirmationPage.associatedView, {
        claim: user.claim,
        submittedOn: user.claim.respondedAt,
        defendantEmail: user.email,
        paths: Paths
      })
    } catch (err) {
      next(err)
    }
  })
  .post(
    Paths.offerSentConfirmationPage.uri,
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
    })
