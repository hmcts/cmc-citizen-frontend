import { ClaimMiddleware } from 'claims/claimMiddleware'
import * as express from 'express'

import { Paths } from 'claim/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantDetailsPage.uri,
    ClaimMiddleware.retrieveByExternalId,
    (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      res.render(Paths.claimantDetailsPage.associatedView,
        {
          claim: claim
        })
    })
