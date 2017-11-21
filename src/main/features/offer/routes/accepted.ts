import * as express from 'express'
import { Paths } from 'offer/paths'
import { User } from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.acceptedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user: User = res.locals.user
      res.render(Paths.acceptedPage.associatedView, {
        claim: user.claim,
        agreementLink: Paths.agreementReceiver.evaluateUri({ externalId: user.claim.externalId })
      })
    }))
