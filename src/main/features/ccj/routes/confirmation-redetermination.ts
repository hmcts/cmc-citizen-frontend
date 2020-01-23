import * as express from 'express'

import { Paths } from 'ccj/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'
import { MadeBy } from 'claims/models/madeBy'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.redeterminationConfirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      res.render(Paths.redeterminationConfirmationPage.associatedView,
        {
          defendantName: claim.claimData.defendant.name,
          claimantName: claim.claimData.claimant.name,
          reDeterminationRequestedAt: claim.reDeterminationRequestedAt,
          reDeterminationByClaimant: claim.reDetermination && claim.reDetermination.partyType === MadeBy.CLAIMANT
        })
    }))
