import * as express from 'express'

import { Paths } from 'ccj/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'
import { MadeBy } from 'offer/form/models/madeBy'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      res.render(Paths.confirmationPage.associatedView,
        {
          defendantName: claim.claimData.defendant.name,
          ccjRequestedAt: claim.countyCourtJudgmentRequestedAt,
          reDeterminationRequestedAt: claim.reDeterminationRequestedAt,
          reDeterminationByClaimant: claim.reDetermination && claim.reDetermination.partyType === MadeBy.CLAIMANT
        })
    }))
