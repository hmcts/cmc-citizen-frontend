import * as express from 'express'

import { Paths as AppPaths } from 'app/paths'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.privacyPolicyPage.uri,
    FeatureToggleGuard.featureEnabledGuard('finePrint'),
    function (req, res) {
      res.render(AppPaths.privacyPolicyPage.associatedView)
    })
