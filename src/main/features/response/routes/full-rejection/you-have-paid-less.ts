import * as express from 'express'
import { FullRejectionPaths, Paths } from 'response/paths'
import { FullRejectionGuard } from 'response/guards/fullRejectionGuard'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(FullRejectionPaths.youHavePaidLessPage.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    FullRejectionGuard.requestHandler(),
    async (req: express.Request, res: express.Response) => {
      await Promise.resolve(res.render(FullRejectionPaths.youHavePaidLessPage.associatedView, { claim: res.locals.claim }))
    })
  .post(FullRejectionPaths.youHavePaidLessPage.uri,
    OptInFeatureToggleGuard.featureEnabledGuard('admissions'),
    FullRejectionGuard.requestHandler(),
    function (req: express.Request, res: express.Response) {
      const claim: Claim = res.locals.claim
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
    })
