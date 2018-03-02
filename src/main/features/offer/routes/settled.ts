import * as express from 'express'
import { Paths } from 'offer/paths'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import { Paths as DashboardPaths } from 'dashboard/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.settledPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      res.render(Paths.settledPage.associatedView, {
        claim: claim,
        agreementLink: Paths.agreementReceiver.evaluateUri({ externalId: claim.externalId }),
        dashboardLink: DashboardPaths.defendantPage.evaluateUri({ externalId: claim.externalId })
      })
    }))
