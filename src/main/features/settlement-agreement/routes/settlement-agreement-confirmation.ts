import * as express from 'express'

import { Paths as DashboardPaths } from 'dashboard/paths'

import { GuardFactory } from 'response/guards/guardFactory'
import { Claim } from 'main/app/claims/models/claim'
import { Paths } from 'settlement-agreement/paths'

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const claim: Claim = res.locals.claim

  return claim.settlement.isOfferRejected() || claim.settlement.isOfferAccepted()
}, (req: express.Request, res: express.Response): void => {
  res.redirect(DashboardPaths.dashboardPage.uri)
})

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.settlementAgreementConfirmation.uri,
    stateGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      res.render(Paths.settlementAgreementConfirmation.associatedView, {
        claim: claim
      })
    })
