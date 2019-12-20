import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Paths } from 'dashboard/paths'

export class AlreadyPaidInFullGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.claim
    const user: User = res.locals.user

    if (!!claim && !!user && user.id === claim.defendantId && claim.moneyReceivedOn) {
      res.redirect(Paths.defendantPage.uri.replace(':externalId', claim.externalId))
    } else {
      next()
    }
  }

}
