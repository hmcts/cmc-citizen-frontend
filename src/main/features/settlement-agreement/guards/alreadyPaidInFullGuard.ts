import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Paths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('settlement-agreement/guards/settlementAgreementGuard')

export class AlreadyPaidInFullGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.claim

    if (claim.moneyReceivedOn) {
      logger.info(`Claim ${claim.claimNumber} has been paid-in-full`)
      res.redirect(Paths.defendantPage.uri.replace(':externalId', claim.externalId))
    } else {
      next()
    }
  }

}
