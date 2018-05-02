import * as express from 'express'
import { Paths } from 'response/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'shared/interestUtils'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimDetailsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const interestData = await getInterestDetails(claim)
      res.render(Paths.claimDetailsPage.associatedView, {
        interestData: interestData,
        pdfUrl: (res.locals.claim.defendantId === res.locals.user.id) ? ClaimPaths.sealedClaimPdf : ClaimPaths.receiptReceiver
      })
    })
  )
