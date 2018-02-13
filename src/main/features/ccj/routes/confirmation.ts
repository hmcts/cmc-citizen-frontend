import * as express from 'express'

import { Paths } from 'ccj/paths'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      res.render(Paths.confirmationPage.associatedView,
        {
          defendantName: claim.claimData.defendant.name,
          ccjRequestedAt: claim.countyCourtJudgmentRequestedAt
        })
    }))
