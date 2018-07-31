import { ClaimMiddleware } from 'claims/claimMiddleware'
import * as express from 'express'

import { Paths } from 'main/features/claim/paths'

/* tslint:disable:no-default-export */
export default express.Router()
.get(Paths.featureOptInPage.uri,
  ClaimMiddleware.retrieveByExternalId,
  (req: express.Request, res: express.Response) => {
    res.render(Paths.featureOptInPage.associatedView)
  })
