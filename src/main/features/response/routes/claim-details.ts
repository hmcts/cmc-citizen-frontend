import * as express from 'express'
import { Paths } from 'response/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'shared/interestUtils'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'

function isCurrentUserLinkedToClaim (user: User, claim: Claim): boolean {
  return claim.defendantId === user.id
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimDetailsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const interestData = await getInterestDetails(claim)
      res.render(Paths.claimDetailsPage.associatedView, {
        interestData: interestData,
        pdfUrl: isCurrentUserLinkedToClaim(res.locals.user, res.locals.claim) ? ClaimPaths.sealedClaimPdfReceiver : ClaimPaths.receiptReceiver
      })
    })
  )
