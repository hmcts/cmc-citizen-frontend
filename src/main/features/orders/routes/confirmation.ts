import * as express from 'express'
import { Paths } from 'orders/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user: User = res.locals.user
      const claim: Claim = res.locals.claim

      res.render(Paths.confirmationPage.associatedView, {
        otherParty: claim.otherPartyName(user),
        deadline: MomentFactory.currentDate().add(12, 'days')
      })
    }))
