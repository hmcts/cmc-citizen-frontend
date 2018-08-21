import * as express from 'express'
import { FullRejectionPaths, Paths } from 'response/paths'
import { FullRejectionGuard } from 'response/guards/fullRejectionGuard'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(FullRejectionPaths.youHavePaidLess.uri,
    FullRejectionGuard.requestHandler(),
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    async (req: express.Request, res: express.Response) => {
      await Promise.resolve(res.render(FullRejectionPaths.youHavePaidLess.associatedView, { claim: res.locals.claim }))
    })
  .post(FullRejectionPaths.youHavePaidLess.uri,
    FullRejectionGuard.requestHandler(),
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    function (req: express.Request, res: express.Response) {
      const claim: Claim = res.locals.claim
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
    })
