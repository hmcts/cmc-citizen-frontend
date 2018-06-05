import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Claim } from 'claims/models/claim'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.explainWhyCannotPayImmediatelyPage.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      res.render(Paths.explainWhyCannotPayImmediatelyPage.associatedView, {
        claimantName: claim.claimData.claimant.name,
        nextPageLink: Paths.bankAccountsPage.evaluateUri({ externalId: claim.externalId })
      })
    })
