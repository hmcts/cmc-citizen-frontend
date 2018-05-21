import * as express from 'express'
import { PayBySetDatePaths } from 'response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import {Claim} from "claims/models/claim";

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    PayBySetDatePaths.payByDatestatementPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      res.render(PayBySetDatePaths.payByDatestatementPage.associatedView, {
        claim: claim
      })
    })
    .post(
    PayBySetDatePaths.payByDatestatementPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      res.redirect(PayBySetDatePaths.explanationPage.evaluateUri({ externalId: req.params.externalId }))
    }))
