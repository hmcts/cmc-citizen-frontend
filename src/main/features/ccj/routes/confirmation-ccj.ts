import * as express from 'express'

import { Paths } from 'ccj/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.ccjConfirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      res.render(Paths.ccjConfirmationPage.associatedView,
        {
          defendantName: claim.claimData.defendant.name,
          ccjRequestedAt: claim.countyCourtJudgmentRequestedAt
        })
    }))
