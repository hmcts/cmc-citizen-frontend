import * as express from 'express'

import { Paths as AppPaths } from 'app/paths'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.termsAndConditionsPage.uri,
    FeatureToggleGuard.featureEnabledGuard('finePrint'),
    (req: express.Request, res: express.Response) => {
      res.render(AppPaths.termsAndConditionsPage.associatedView)
    })
