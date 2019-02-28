import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Paths } from 'dashboard/paths'
import { Logger } from '@hmcts/nodejs-logging'
import { Settlement } from 'claims/models/settlement'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { AcceptationClaimantResponse } from 'claims/models/claimant-response/acceptationClaimantResponse'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'
import { ClaimantResponse } from 'claims/models/claimantResponse'

const logger = Logger.getLogger('settlement-agreement/guards/settlementAgreementGuard')

export class SettlementAgreementGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.claim
    const settlement: Settlement = claim.settlement
    const claimantResponse: ClaimantResponse = claim.claimantResponse

    if (!claimantResponse || claimantResponse.type !== ClaimantResponseType.ACCEPTATION
      || AcceptationClaimantResponse.deserialize(claimantResponse).formaliseOption !== FormaliseOption.SETTLEMENT) {
      logger.warn(`Claim ${claim.claimNumber} no acceptance claimant response for claim`)
      res.redirect(Paths.dashboardPage.uri)
    } else if (!settlement || settlement.isSettled() || settlement.isOfferRejected()) {
      logger.warn(`Claim ${claim.claimNumber} no suitable settlement agreement for claim`)
      res.redirect(Paths.dashboardPage.uri)
    } else {
      next()
    }
  }

}
