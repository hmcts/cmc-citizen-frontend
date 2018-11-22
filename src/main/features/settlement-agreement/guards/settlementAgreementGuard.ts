import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Paths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'
import { Settlement } from 'claims/models/settlement'

const logger = Logger.getLogger('settlement-agreement/guards/settlementAgreementGuard')

export class SettlementAgreementGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.claim
    const settlement: Settlement = claim.settlement

    if (!settlement || !settlement.isSettlementAgreement() || settlement.isSettled() || settlement.isOfferRejected()) {
      logger.warn(`Claim ${claim.claimNumber} no suitable settlement agreement for claim`)
      res.redirect(Paths.dashboardPage.uri)
    } else {
      next()
    }
  }

}
